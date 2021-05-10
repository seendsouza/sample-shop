import paypalPolicy from "../policies/paypal.policy.js";
import paypal from "../controllers/paypal.controller.js";
import carts from "../../carts/controllers/carts.controller.js";
import type { Express } from "express";

export default (app: Express) => {
  app
    .route("/api/payments/paypal/checkout/:cartId")
    .all(paypalPolicy.isAllowed)
    .post(paypal.checkout);
  app
    .route("/api/payments/paypal/execute/:cartId")
    .all(paypalPolicy.isAllowed)
    .post(paypal.execute);
  app
    .route("/api/payments/paypal/cancel/:cartId")
    .all(paypalPolicy.isAllowed)
    .post(paypal.cancel);
  app.param("cartId", carts.cartById);
};
