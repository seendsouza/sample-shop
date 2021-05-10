import Cart from "../../carts/models/cart.model.js";
import { logObject } from "../../core/utils.js";
import paypal from "../misc/paypal.js";
import { cancelPayment } from "../misc/utils.js";
import type { Request, Response } from "express";

// Set up the payment:
// 1. Set up a URL to handle requests from the PayPal button
export const checkout = (req: Request, res: Response) => {
  const cartId = req.params.cartId;
  const now = Date.now();
  console.log(`Checkout paypal for cart: ${cartId}`);
  let cart = Cart.findOneAndUpdate(
    { _id: cartId, status: "active" },
    { update: { $set: { status: "pending", last_modified: now } } }
  );
  if (!cart) {
    return res.send("Cart Inactive");
    // raise CartInactive()
  }
  paypal
    .initiatePayPalPayment(cartId)
    .then((payment) => {
      logObject(payment);
      res.send(payment);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

export const execute = (req: Request, res: Response) => {
  const cartId = req.params.cartId;
  console.log(`Execute PayPal Payment`);
  paypal
    .executePayPalPayment(req.body, cartId)
    .then((payment) => {
      logObject(payment);
      res.send(payment);
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
    });
};

export const cancel = async (req: Request, res: Response) => {
  const cartId = req.params.cartId;
  await cancelPayment(cartId);
  console.log("Items returned to inventory.");
  res.send("Items returned to inventory.");
};

export default { checkout, execute, cancel };
