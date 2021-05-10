import {
  GET_CART,
  ADD_CART,
  ADD_ITEM,
  DELETE_ITEM,
  UPDATE_QUANTITY,
} from "../actions/types.js";

const initialState = {
  status: "active",
  last_modified: "",
  items: [],
  cartid: "",
};

export default function cartReducer(state = initialState, action) {
  const localStorage = window.localStorage;
  switch (action.type) {
    case GET_CART:
      localStorage.setItem("sample-cartid", action.payload._id);
      return {
        ...state,
        cartid: action.payload._id,
        status: action.payload.status,
        last_modified: action.payload.last_modified,
        items: action.payload.items,
      };
    case ADD_CART:
      localStorage.setItem("sample-cartid", action.payload._id);
      return {
        ...state,
        cartid: action.payload._id,
        status: action.payload.status,
        last_modified: action.payload.last_modified,
        items: action.payload.items,
      };

    case ADD_ITEM:
      return {
        ...state,
        status: action.payload.status,
        last_modified: action.payload.last_modified,
        items: action.payload.items,
      };
    case DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload),
      };
    case UPDATE_QUANTITY:
      return {
        ...state,
        status: action.payload.status,
        last_modified: action.payload.last_modified,
        items: action.payload.items,
      };
    default:
      return state;
  }
}
