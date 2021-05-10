import paypal from "paypal-rest-sdk";
import Product from "../../products/models/product.model.js";
import Cart from "../../carts/models/cart.model.js";
import { calculatePrices, completePayment, cancelPayment } from "./utils.js";

const url = "http://localhost:3000";

const createPaymentObject = (cartItems: object[]) => {
  const { subtotalAmount, tax, shippingAmount, totalAmount } = calculatePrices(
    cartItems
  );
  return {
    intent: "sale",
    payer: { payment_method: "paypal" },
    redirect_urls: {
      return_url: `${url}/success`,
      cancel_url: `${url}/shopping-cart`,
    },
    transactions: [
      {
        item_list: { items: cartItems },
        amount: {
          currency: "CAD",
          total: totalAmount,
          details: {
            subtotal: subtotalAmount,
            tax: tax,
            shipping: shippingAmount,
          },
        },
        description: "Payment.",
        payment_options: { allowed_payment_method: "INSTANT_FUNDING_SOURCE" },
      },
    ],
  };
};

const savePayment = (payment: object) => {
  const fs = require("fs");
  const jsonString = JSON.stringify(payment);
  fs.writeFile("./payment.json", jsonString, (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
};

interface PaypalLineItem {
  name: string;
  sku: string;
  description: string;
  price: string;
  currency: string;
  quantity: string;
}

const getCartLineItems = async (cartId: string) => {
  const cart = await Cart.findById(cartId);
  let cartItems: PaypalLineItem[];
  if (cart && cart.items) {
    cartItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item._id);
        if (product && product.item_details) {
          return {
            name: product.name,
            sku: item._id,
            description: product.item_details.get("description"),
            price: product.item_details.get("price").toString(),
            currency: "CAD",
            quantity: item.qty.toString(),
          };
        }
        throw "Product not found";
      })
    );
  } else {
    throw "Cart items not found";
  }
  return cartItems;
};

export const initiatePayPalPayment = async (cartId: string) => {
  let payment: object;
  const mode = process.env.PAYPAL_MODE;
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!(mode && clientId && clientSecret)) throw Error();
  paypal.configure({
    mode: mode, // sandbox or live
    client_id: clientId,
    client_secret: clientSecret,
  });
  const cartItems = await getCartLineItems(cartId);

  const create_payment_json = createPaymentObject(cartItems);
  // 2. Call /v1/payments/payment to set up the payment
  // 3. Return the payment ID to the client
  const paymentPromise = (create_payment_json: object): Promise<object> =>
    new Promise((resolve, reject) => {
      paypal.payment.create(
        create_payment_json,
        function (error: Error, response) {
          if (error) {
            return reject(error);
          } else {
            return resolve(response);
          }
        }
      );
    });
  payment = await paymentPromise(create_payment_json);
  return payment;
};

export const executePayPalPayment = async (payment: any, cartId: string) => {
  console.log(JSON.stringify(payment, null, 2));
  const infoPromise = (): Promise<any> =>
    new Promise((resolve, reject) => {
      paypal.payment.get(payment.id, function (error, paymentInfo) {
        if (error) {
          console.log(error);
          return reject(error);
        } else {
          console.log("Get Payment Response");
          return resolve(paymentInfo);
        }
      });
    });
  const paymentInfo = await infoPromise();
  const payerId = paymentInfo.payer.payer_info.payer_id;
  const paymentPromise = (): Promise<object> =>
    new Promise((resolve, reject) => {
      const execute_payment_json = {
        payer_id: payerId,
        transactions: [
          {
            amount: {
              total: payment.transactions[0].amount.total,
              currency: payment.transactions[0].amount.currency,
            },
          },
        ],
      };
      // console.log(JSON.stringify(execute_payment_json, null, 2));
      paypal.payment.execute(
        payment.id,
        execute_payment_json,
        async function (error: Error, response) {
          if (error) {
            await cancelPayment(cartId);
            return reject(JSON.stringify(error, null, 2));
          } else {
            await completePayment(cartId);
            return resolve(response);
          }
        }
      );
    });
  let ret: object = await paymentPromise();

  return ret;
};

export default { initiatePayPalPayment, executePayPalPayment };
