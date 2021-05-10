import {
  GET_PRODUCT,
  GET_PRODUCTS,
  ADD_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
  PRODUCTS_LOADING,
} from "./types.js";
import { throwErrorUponHTTPError } from "../utils";

export const getProduct = (id) => (dispatch) => {
  return fetch(`/api/products/${id}`)
    .then(throwErrorUponHTTPError)
    .then((res) => res.json())
    .then((data) =>
      dispatch({
        type: GET_PRODUCT,
        payload: data,
      })
    )
    .catch((err) => {
      console.error(err);
    });
};

export const getProducts = () => (dispatch) => {
  dispatch(setProductsLoading());
  return fetch("/api/products")
    .then(throwErrorUponHTTPError)
    .then((res) => res.json())
    .then((data) =>
      dispatch({
        type: GET_PRODUCTS,
        payload: data,
      })
    )
    .catch((err) => {
      console.error(err);
    });
};

export const addProduct = (product) => (dispatch) => {
  return fetch("/api/products", {
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
        type: ADD_PRODUCT,
        payload: data,
      })
    )
    .catch((err) => {
      console.error(err);
    });
};

export const deleteProduct = (id) => (dispatch) => {
  return fetch(`/api/products/${id}`, {
    method: "DELETE",
  })
    .then(throwErrorUponHTTPError)
    .then(() =>
      dispatch({
        type: DELETE_PRODUCT,
        payload: id,
      })
    )
    .catch((err) => {
      console.error(err);
    });
};

export const updateProduct = (id, product) => (dispatch) => {
  return fetch(
    `/api/products/${id}`,

    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    }
  )
    .then(throwErrorUponHTTPError)
    .then((res) => res.json())
    .then((data) =>
      dispatch({
        type: UPDATE_PRODUCT,
        payload: data,
      })
    )
    .catch((err) => {
      console.error(err);
    });
};

export const setProductsLoading = () => {
  return {
    type: PRODUCTS_LOADING,
  };
};
