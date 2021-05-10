import cron from "node-cron";
import async from "async";
import Product from "../../products/models/product.model.js";
import Cart, { CartDocument } from "../models/cart.model.js";

export const expireCarts = async () => {
  const now = Date.now();
  const timeout = 5 * 60 * 1000; // n(s)* 1000 (ms/s)
  const threshold = new Date(now - timeout);
  // Lock and find all the expiring carts
  console.log("Locking and finding all expiring carts");
  await Cart.updateMany(
    { status: "active", last_modified: { $lt: threshold } },
    { $set: { status: "expiring" } }
  );
  // Actually expire each cart
  console.log("Expiring carts");
  await Cart.find({ status: "expiring" }).then((carts) => {
    async.mapSeries(carts, async (cart) => {
      // Return all line items to inventory
      console.log("Returning items to inventory");
      await async.mapSeries(cart.items, async (item) => {
        await Product.updateMany(
          {
            _id: item._id,
            "carted._id": cart._id,
            "carted.qty": item.qty,
          },
          {
            $inc: { qty: item.qty },
            $pull: { carted: { _id: cart._id } },
          }
        );
        await Product.updateMany(
          {
            _id: item._id,
            "carted.cart_id": cart._id,
            "carted.qty": item.qty,
          },
          {
            $inc: { qty: item.qty },
            $pull: { carted: { cart_id: cart._id } },
          }
        );
      });
      await Cart.updateMany({ _id: cart._id }, { $set: { status: "expired" } });
      return cart;
    });
  });
};

export const cleanupCarts = async () => {
  const now = Date.now();
  const timeout = 30 * 1000; // n(s)* 1000 (ms/s)
  const threshold = new Date(now - timeout);
  const carted = {};
  // Find all the expiring carted items
  console.log("Finding expiring carts");
  await Product.find({ "carted.timestamp": { $lt: threshold } }).then(
    async (items) => {
      await async.map(items, async (item) => {
        // Find all the carted items that matched
        await async.mapSeries(item.carted, async (cartedItem) => {
          if (cartedItem.timestamp < threshold) {
            carted[cartedItem._id] = cartedItem;
          }
        });

        // First Pass: Find any carts that are active and refresh the carted
        // items
        console.log("First pass");
        await Cart.find({
          _id: { $in: Object.keys(carted) },
          status: "active",
        }).then(async (carts) => {
          await Promise.all(
            carts.map(async (cart) => {
              await Product.update(
                { _id: item._id, "carted._id": cart._id },
                { $set: { "carted.$.timestamp": now } }
              );
              delete carted[cart._id];
            })
          );
        });
        // Second Pass: All the carted items left in the dict need to now be
        // returned to inventory
        console.log("Second pass");
        await async.mapSeries(carted, async (cartId: string) => {
          await Product.update(
            {
              _id: item["_id"],
              "carted._id": cartId,
              "carted.qty": carted[cartId]["qty"],
            },
            {
              $inc: { qty: carted[cartId]["qty"] },
              $pull: { carted: { _id: cartId } },
            }
          );
        });
      });
    }
  );
};

export const deleteExpiredCarts = async () => {
  await Cart.deleteMany({
    status: "expired",
    items: { $exists: true, $size: 0 },
  }).exec();
};

const schedule = () => {
  cron.schedule("* */1 * * *", async () => {
    await expireCarts();
    await cleanupCarts();
    await deleteExpiredCarts();
  });
};

export default schedule;
