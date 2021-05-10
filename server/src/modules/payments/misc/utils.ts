import Cart from "../../carts/models/cart.model.js";
import Product from "../../products/models/product.model.js";

export const calculatePrices = (cartItems) => {
  const items = cartItems.map(
    (item) => parseFloat(item.price) * parseFloat(item.quantity)
  );
  const subtotalAmount = items
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0)
    .toFixed(2);

  const tax = (parseFloat(subtotalAmount) * parseFloat("0.13")).toFixed(2);

  const shippingAmount = parseFloat("0.0").toFixed(2);
  /*
                parseFloat(
    parseFloat(subtotalAmount) + parseFloat(tax) >= 50 ? "0.0" : "15.0"
  ).toFixed(2);
        */

  const totalAmount = (
    parseFloat(subtotalAmount) +
    parseFloat(tax) +
    parseFloat(shippingAmount)
  ).toFixed(2);

  return {
    subtotalAmount: subtotalAmount,
    tax: tax,
    shippingAmount: shippingAmount,
    totalAmount: totalAmount,
  };
};

export const completePayment = async (cartId) => {
  await Cart.findByIdAndUpdate(cartId, { $set: { status: "complete" } });
  await Product.updateMany(
    { "carted._id": cartId },
    { $pull: { carted: { _id: cartId } } }
  );
  console.log("Complete payment");
};

export const cancelPayment = async (cartId) => {
  await Cart.findByIdAndUpdate(cartId, { $set: { status: "active" } });
  console.log("Invalid Payment");
};

export const strToArr = (strData: string, strDelimiter = ",") => {
  strDelimiter = strDelimiter || ",";
  const objPattern = new RegExp(
    "(\\" +
      strDelimiter +
      "|\\r?\\n|\\r|^)" +
      '(?:"([^"]*(?:""[^"]*)*)"|' +
      '([^"\\' +
      strDelimiter +
      "\\r\\n]*))",
    "gi"
  );
  let arrData: string[][] = [[]];
  let arrMatches = objPattern.exec(strData);
  while (arrMatches !== null) {
    const strMatchedDelimiter = arrMatches[1];
    if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
      arrData.push([]);
    }
    let strMatchedValue;
    if (arrMatches[2]) {
      strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
    } else {
      strMatchedValue = arrMatches[3];
    }
    arrData[arrData.length - 1].push(strMatchedValue);
    arrMatches = objPattern.exec(strData);
  }
  return arrData;
};

export default { calculatePrices, completePayment, cancelPayment, strToArr };
