import {
  GET_PRODUCT,
  GET_PRODUCTS,
  ADD_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
  PRODUCTS_LOADING,
} from "../actions/types.js";

const initialState = {
  products: [],
  loading: false,
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PRODUCT:
      return {
        ...state,
        products: action.payload,
      };
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        loading: false,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(
          (product) => product._id !== action.payload
        ),
      };
    case ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload],
      };
    case UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((product, id) => {
          if (id !== action.id) {
            return product;
          } else {
            return {
              ...product,
              ...action.product,
            };
          }
        }),
      };
    case PRODUCTS_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
