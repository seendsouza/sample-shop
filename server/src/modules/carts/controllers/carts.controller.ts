import mongoose from "mongoose";
import { logObject } from "../../core/utils.js";
import Product from "../../products/models/product.model.js";
import Cart, { CartDocument } from "../models/cart.model.js";
import {
  expireCarts,
  cleanupCarts,
  deleteExpiredCarts,
} from "../misc/cleanup.js";

import type { Request, Response, NextFunction } from "express";

export const list = (_: Request, res: Response) => {
  Cart.find({}, function (_, carts) {
    logObject(carts);
    res.send(carts);
  });
};

export const create = (_: Request, res: Response) => {
  const newCart = new Cart();
  newCart.save().then((cart) => {
    logObject(cart);
    return res.json(cart);
  });
};

export const read = (req: Request, res: Response) => {
  const cartId = req.params.cartId;
  Cart.findOne(
    { _id: cartId },
    function (_: mongoose.CallbackError, doc: CartDocument) {
      if (doc && doc.status === "active") {
        res.send(doc);
      } else {
        const newCart = new Cart();
        newCart.save().then((cart) => {
          logObject(cart);
          return res.json(cart);
        });
      }
    }
  );
};

export const check = (req: Request, res: Response) => {
  Cart.findOne(
    { _id: req.params.cartId },
    function (_: mongoose.CallbackError, doc: CartDocument) {
      logObject(doc);
      res.send(doc);
    }
  );
};

export const addItem = async (req: Request, res: Response) => {
  const cartId = req.params.cartId;
  const sku = req.params.sku;
  const qty: number = req.body.qty;
  const product = await Product.findById(sku);
  const now = new Date();
  if (product != null) {
    let result = await Cart.updateOne(
      { _id: cartId, status: "active" },
      {
        $set: { last_modified: now },
        $addToSet: {
          items: {
            _id: mongoose.Types.ObjectId(sku),
            name: product.name,
            qty: qty,
            item_details: product.item_details,
          },
        },
      },
      { writeConcern: 1 }
    );
    if (result.nModified === 0) {
      console.error("Cart Inactive");
      // exception CartInactive
    } else {
      result = await Product.updateOne(
        { _id: sku, qty: { $gte: qty } },
        {
          $inc: { qty: -qty },
          $push: {
            carted: {
              qty: qty,
              _id: mongoose.Types.ObjectId(cartId),
              cart_id: cartId,
              timestamp: now,
            },
          },
        },
        { writeConcern: 1 }
      );
      if (result.nModified === 0) {
        await Cart.updateOne(
          { _id: cartId },
          { $pull: { items: { _id: sku } } }
        );
        console.error("Inadequate Inventory");
        // exception InadequateInventory()
      }
    }
  }
  await Cart.findById(cartId).then((resBody) => {
    if (resBody === null) return res.status(500).end();
    logObject(resBody);
    res.send(resBody);
  });
};

export const updateItem = async (req: Request, res: Response) => {
  const cartId = req.params.cartId;
  const sku = req.params.sku;
  const newQty = await req.body.new_qty;
  const oldQty = await req.body.old_qty;
  const now = new Date();
  const deltaQty = newQty - oldQty;

  // Make sure the cart is still active and add the line item
  let result = await Cart.updateOne(
    { _id: cartId, status: "active", "items._id": sku },
    {
      $set: {
        last_modified: now,
        "items.$.qty": newQty,
      },
    },
    { writeConcern: 1 }
  );
  if (result.nModified === 0) {
    console.error("Inactive Cart");
    // raise CartInactive()
  } else {
    // Update the inventory
    result = await Product.updateOne(
      { _id: sku, "carted._id": cartId, qty: { $gte: deltaQty } },
      {
        $inc: { qty: -deltaQty },
        $set: { "carted.$.qty": newQty, timestamp: now },
      },
      { writeConcern: 1 }
    );
    if (result.nModified === 0) {
      // Roll back our cart update
      await Cart.updateOne(
        { _id: cartId, "items._id": sku },
        { $set: { "items.$.qty": oldQty } }
      );
      console.error("Inadequate Inventory");
      // raise InadequateInventory()
    }
  }

  await Cart.findById(cartId).then((resBody) => {
    if (resBody === null) return res.status(500).end();
    logObject(resBody);
    res.send(resBody);
  });
};

export const deleteItem = async (req: Request, res: Response) => {
  const cartId = req.params.cartId;
  const sku = req.params.sku;
  const now = new Date();

  await Cart.findById(cartId).then(async (resBody) => {
    if (resBody != null && resBody.items != null) {
      const item = resBody.items.find((item) => item._id.toString() === sku);
      if (item) {
        const oldQty = item.qty;
        // Make sure the cart is still active and add the line item
        let result = await Cart.updateOne(
          { _id: cartId, status: "active", "items._id": sku },
          {
            $set: {
              last_modified: now,
            },
            $pull: { items: { _id: sku } },
          },
          { writeConcern: 1 }
        );
        if (result.nModified === 0) {
          console.error("Inactive Cart");
          // raise CartInactive()
        } else {
          // Update the inventory
          result = await Product.updateOne(
            { _id: sku, "carted._id": cartId },
            {
              $inc: { qty: oldQty },
              $pull: { carted: { _id: sku } },
            },
            { writeConcern: 1 }
          );
        }
      }
    }

    await Cart.findById(cartId).then((resBody) => {
      if (resBody === null) return res.status(500).end();
      logObject(resBody);
      res.send(resBody);
    });
  });
};
export const expire = async (req: Request, res: Response) => {
  await expireCarts();
  res.sendStatus(200);
};
export const cleanup = async (req: Request, res: Response) => {
  await cleanupCarts();
  res.sendStatus(200);
};
export const deleteExpired = async (req: Request, res: Response) => {
  await deleteExpiredCarts();
  res.sendStatus(200);
};

export const cartById = (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string
) => {
  if (!(req.method === "GET" && req.route.path === "/api/carts/:cartId")) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Cart is invalid",
      });
    }
    Cart.findById(id)
      .populate("displayName")
      .exec(function (err, cart) {
        if (err) {
          return next(err);
        } else if (!cart) {
          return res.status(404).send({
            message: "No cart with that identifier has been found",
          });
        }
        return next();
      });
  } else {
    return next();
  }
};
export default {
  list,
  create,
  expire,
  cleanup,
  deleteExpired,
  read,
  check,
  addItem,
  updateItem,
  deleteItem,
  cartById,
};
