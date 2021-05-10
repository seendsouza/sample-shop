import { flattenObject, transformFlattenedToMap } from "../utils.js";

const order = {
  ppid: "cs_test_a1ZWQkqoZl5HNqpz4eWd9MLG0Egi4bfiIynBRfkUyj1w8xdiylMezMnoWS",
  amount: {
    currency: "cad",
    subtotal: 52.33,
    total: 59.13,
    total_details: {
      shipping: 0,
      tax: 6.8,
    },
  },
  cart_id: "606fd6335d5a550098559da7",
  email: "ikent@tester.com",
  line_items: [
    {
      currency: "cad",
      description: "abcdefgh",
      name: "abcdefgh",
      price: 52.33,
      quantity: 1,
      sku: "605fc9e499770800b676ace4",
    },
  ],
  payment_processor: "stripe",
  shipping: {
    address: {
      city: "Washington, D.C.",
      country: "US",
      line1: "1600 Pennsylvania Avenue Northwest",
      postal_code: "20500",
      state: "DC",
    },
    name: "Ian Kent",
  },

  time: new Date("2021-04-09T23:54:40.000Z"),
};
const order1 = {
  ppid: "PAYID-L4EQYYY4B550773HE724984Y",
  amount: {
    currency: "CAD",
    subtotal: 24.99,
    total: 28.24,
    total_details: {
      shipping: 0.0,
      tax: 3.25,
    },
  },
  cart_id: "5b8f2713fb6e3e625faffc2f",
  email: "sb-turot683337@personal.example.com",
  line_items: [
    {
      currency: "CAD",
      description: "shop",
      name: "boi",
      price: 24.99,
      quantity: 1,
      sku: "5e9f3713fb6e3e625faffc2f",
    },
  ],
  name: "John Doe",
  payment_processor: "paypal",
  shipping: {
    address: {
      city: "Toronto",
      country: "CA",
      line1: "1 Maire-Victorin",
      postal_code: "M5A 1E1",
      state: "ON",
    },
    name: "John Doe",
  },
  time: new Date("2020-07-11T00:48:35.000Z"),
};

describe("Utility functions", () => {
  describe("Flatten Object", () => {
    test("flattens object", () => {
      const inputObj = {
        a: "aValue",
        b: {
          c: "cValue",
          d: {
            e: 1,
          },
        },
      };
      const output = flattenObject(inputObj);
      const expected = {
        a: "aValue",
        "b.c": "cValue",
        "b.d.e": 1,
      };
      expect(output).toEqual(expected);
    });
    test("flattens order", () => {
      const output = flattenObject(order);
      const expected = {
        "amount.currency": "cad",
        "amount.subtotal": 52.33,
        "amount.total": 59.13,
        "amount.total_details.shipping": 0,
        "amount.total_details.tax": 6.8,
        cart_id: "606fd6335d5a550098559da7",
        email: "ikent@tester.com",
        "line_items.0.currency": "cad",
        "line_items.0.description": "abcdefgh",
        "line_items.0.name": "abcdefgh",
        "line_items.0.price": 52.33,
        "line_items.0.quantity": 1,
        "line_items.0.sku": "605fc9e499770800b676ace4",
        payment_processor: "stripe",
        ppid:
          "cs_test_a1ZWQkqoZl5HNqpz4eWd9MLG0Egi4bfiIynBRfkUyj1w8xdiylMezMnoWS",
        "shipping.address.city": "Washington, D.C.",
        "shipping.address.country": "US",
        "shipping.address.line1": "1600 Pennsylvania Avenue Northwest",
        "shipping.address.postal_code": "20500",
        "shipping.address.state": "DC",
        "shipping.name": "Ian Kent",
      };
      expect(output).toEqual(expected);
    });
  });
});
