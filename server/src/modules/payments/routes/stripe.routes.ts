import stripePolicy from "../policies/stripe.policy.js";
import stripe from "../controllers/stripe.controller.js";
import carts from "../../carts/controllers/carts.controller.js";
import type { Express } from "express";

export default (app: Express) => {
  app
    .route("/api/payments/stripe/webhook")
    .all(stripePolicy.isAllowed)
    .post(stripe.webhook);
  app
    .route("/api/payments/stripe/checkout/:cartId")
    .all(stripePolicy.isAllowed)
    .post(stripe.createCheckoutSession);
  app
    .route("/api/payments/stripe/success/:sessionId")
    .all(stripePolicy.isAllowed)
    .get(stripe.success);
  app.param("cartId", carts.cartById);
  app.param("sessionId", stripe.sessionId);
};
