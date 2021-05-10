import Stripe from "stripe";
import Product from "../../products/models/product.model.js";
import Cart from "../../carts/models/cart.model.js";
import { logObject } from "../../core/utils.js";
import { completePayment, strToArr } from "./utils.js";

const url = "http://localhost:3000";

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2020-08-27",
});

interface StripeLineItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      description: string;
      images: string[];
      metadata: {
        sku: string;
      };
    };
    unit_amount: number;
  };
  quantity: number;
  tax_rates: string[];
}

const getCartLineItems = async (cartId: string) => {
  const taxRates = await stripe.taxRates.create({
    display_name: "Sales Tax",
    inclusive: false,
    percentage: 13,
    country: "CA",
    description: "CAN Sales Tax",
  });
  const cart = await Cart.findById(cartId);
  let cartItems: StripeLineItem[];
  if (cart && cart.items) {
    cartItems = await Promise.all(
      cart.items.map(async (item) => {
        return await Product.findById(item._id).then((product) => {
          if (product && product.item_details) {
            return {
              price_data: {
                currency: "cad",
                product_data: {
                  name: product.name,
                  description: product.item_details.get("description"),
                  images: strToArr(product.item_details.get("images"))[0],
                  metadata: {
                    sku: item._id.toString(),
                  },
                },
                unit_amount: product.item_details.get("price") * 100,
              },
              quantity: item.qty,
              tax_rates: [taxRates.id],
            };
          }
          throw "Product not found";
        });
      })
    );
  } else {
    throw "Cart items not found";
  }
  return cartItems;
};

const createPaymentObject = (cartId: string, cartItems: StripeLineItem[]) => {
  return {
    billing_address_collection: "auto",
    shipping_address_collection: { allowed_countries: ["US", "CA"] },
    payment_method_types: ["card"],
    line_items: cartItems,
    mode: "payment",
    success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${url}/shopping-cart`,
    metadata: {
      cartId: cartId,
    },
  };
};

export const createCheckoutSession = async (cartId: string) => {
  const cartItems = await getCartLineItems(cartId);
  return await stripe.checkout.sessions.create(
    createPaymentObject(cartId, cartItems)
  );
};

export const verifyStripeSignature = (body: Buffer | string, sig: string) => {
  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_ENDPOINT_SECRET
  );
  return event;
};

export const fulfillOrder = async (session: Stripe.Checkout.Sessions) => {
  await completePayment(session.metadata.cartId);
  const fullSession: Stripe.Checkout.Sessions = await stripe.checkout.sessions.retrieve(
    session.id,
    {
      expand: ["line_items"],
    }
  );
  logObject(fullSession);
  const lineItems = await Promise.all(
    fullSession.line_items.data.map((lineItem) =>
      stripe.products.retrieve(lineItem.price.product)
    )
  );
  logObject(lineItems);
};

export const getSessionInfo = async (sessionId: string) => {
  const session: Stripe.Checkout.Session = await stripe.checkout.sessions.retrieve(
    sessionId
  );
  const customer: Stripe.Customer = await stripe.customers.retrieve(
    session.customer
  );
  return { session: session, customer: customer };
};

export default {
  verifyStripeSignature,
  fulfillOrder,
  getSessionInfo,
  createCheckoutSession,
};
