import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faShoppingCart, faCircle } from "@fortawesome/free-solid-svg-icons";
import { Img } from "@bootstrap-styled/v4";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Basket from "@assets/basket.png";

library.add(faCircle);
library.add(faShoppingCart);

const reduceItems = (cartItems) => {
  if (cartItems) {
    return cartItems.length;
  } else {
    return 0;
  }
};

const CartIcon = (props) => {
  const noOfItems = reduceItems(props.cartItems);
  const sm = props.small ? true : false;
  return (
    <div
      style={{ position: "relative" }}
      className={sm ? "d-lg-none" : "d-none d-lg-inline-block"}
    >
      <Img
        src={Basket}
        alt={"Cart Icon"}
        fluid
        style={{ width: sm ? "2rem" : "4rem" }}
      />
      {noOfItems > 0 && (
        <span
          style={{
            borderRadius: sm ? "2rem" : "4rem",
            backgroundColor: "#c67605",
            fontFamily: "monospaced",
            fontSize: sm ? "0.5rem" : "1rem",
            background: "#D52B1E",
            color: "white",
            padding: sm ? "0 0.25rem" : "0px 0.5em",
            verticalAlign: "top",
            marginLeft: sm ? "-0.75rem" : "-1.25em",
            fontWeight: 900,
          }}
        >
          {noOfItems}
        </span>
      )}
    </div>
  );
};

CartIcon.propTypes = {
  cartItems: PropTypes.array.isRequired,
  small: PropTypes.bool,
};
const mapStatetoProps = (state) => ({
  cartItems: state.cart.items,
});
export default connect(mapStatetoProps)(CartIcon);
