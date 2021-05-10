import {
  GET_CART,
  ADD_ITEM,
  DELETE_ITEM,
  UPDATE_QUANTITY,
  ADD_CART,
} from "./types.js";
import { throwErrorUponHTTPError, cartExpired } from "../utils";

export const getCart = (cartId) => async (dispatch) => {
  if (!cartId) {
    cartExpired();
    await addCart()();
  }
  return fetch(`/api/carts/${cartId}`)
    .then(throwErrorUponHTTPError)
    .then((res) => res.json())
    .then((data) =>
      dispatch({
        type: GET_CART,
        payload: data,
      })
    )
    .catch((err) => {
      console.error(err);
    });
};

export const addCart = () => async (dispatch) => {
  return fetch(`/api/carts`, { method: "POST" })
    .then(throwErrorUponHTTPError)
    .then((res) => res.json())
    .then((data) => dispatch({ type: ADD_CART, payload: data }))
    .catch((err) => {
      console.error(err);
    });
};

export const addItem = (cartId, sku) => async (dispatch) => {
  if (!cartId) {
    cartExpired();
    await addCart()();
  }
  const product = {
    qty: 1,
  };
  return fetch(`/api/carts/${cartId}/item/${sku}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })
    .then(throwErrorUponHTTPError)
    .then((res) => res.json())
    .then((data) =>
      dispatch({
        type: ADD_ITEM,
        payload: data,
      })
    )
    .catch((err) => {
      console.error(err);
    });
};
export const deleteItem = (cartId, sku) => async (dispatch) => {
  if (!cartId) {
    cartExpired();
    return addCart()();
  }
  return fetch(`/api/carts/${cartId}/item/${sku}`, { method: "DELETE" })
    .then(throwErrorUponHTTPError)
    .then(() => dispatch({ type: DELETE_ITEM, payload: sku }))
    .catch((err) => {
      console.error(err);
    });
};

export const updateQuantity = (
  cartId,
  sku,
  old_quantity,
  new_quantity
) => async (dispatch) => {
  if (!cartId) {
    cartExpired();
    return addCart()();
  }

  const product = {
    old_qty: old_quantity,
    new_qty: new_quantity,
  };

  return fetch(`/api/carts/${cartId}/item/${sku}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })
    .then(throwErrorUponHTTPError)
    .then((res) => res.json())
    .then((data) =>
      dispatch({
        type: UPDATE_QUANTITY,
        payload: data,
      })
    )
    .catch((err) => {
      console.error(err);
    });
};
