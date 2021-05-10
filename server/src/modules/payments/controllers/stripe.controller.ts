import stripe from "../misc/stripe.js";
import type { Request, Response, NextFunction } from "express";

export const createCheckoutSession = async (req: Request, res: Response) => {
  const cartId = req.params.cartId;
  try {
    const session = await stripe.createCheckoutSession(cartId);
    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const webhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  if (typeof sig !== "string")
    return res.status(400).send("Webhook Error: Invalid stripe-signature");

  let event;

  try {
    event = await stripe.verifyStripeSignature(req.body, sig);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event && event.type) {
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        await stripe.fulfillOrder(session);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.status(400).end();
  }
};

export const success = async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId;
  try {
    const { session, customer } = await stripe.getSessionInfo(sessionId);
    const body = { name: session.shipping.name, email: customer.email };
    res.json(body);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const sessionId = (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string
) => {
  return next();
};

export default { createCheckoutSession, webhook, success, sessionId };
