import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "@bootstrap-styled/v4";

import { updateQuantity } from "@actions/cartActions";

const QuantityDropdown = (props) => {
  const [isToggled, setToggled] = useState(false);
  const toggle = () => {
    setToggled(!isToggled);
  };

  const { qty, sku, cart } = props;
  const changeNumber = (n) => {
    setNumber(n);
  };

  const n = 10;
  const arr = Array.from(Array(n).keys());

  const cartId = cart.cartid;
  const cartedQty = cart.items.find((item) => {
    return item._id === sku;
  }).qty;
  const [currentNumber, setNumber] = useState(cartedQty);

  return (
    <Dropdown isOpen={isToggled} toggle={toggle}>
      <DropdownToggle caret>{String(currentNumber)}</DropdownToggle>
      <DropdownMenu>
        {arr
          .filter((n) => n <= qty)
          .map((number) => {
            return (
              <DropdownItem
                key={number}
                onClick={() => {
                  props.updateQuantity(cartId, sku, cartedQty, number);
                  changeNumber(number);
                  toggle();
                }}
              >
                {number}
              </DropdownItem>
            );
          })}
      </DropdownMenu>
    </Dropdown>
  );
};

QuantityDropdown.propTypes = {
  updateQuantity: PropTypes.func.isRequired,
  cart: PropTypes.object.isRequired,
  qty: PropTypes.number.isRequired,
  sku: PropTypes.string
};
const mapStateToProps = (state, ownProps) => {
  const product = state.product.products.filter((product) => {
    return product._id === ownProps.sku;
  })[0];
  const qty = product ? product.qty : 0;
  return {
    cart: state.cart,
    qty: qty,
  };
};
export default connect(mapStateToProps, { updateQuantity })(QuantityDropdown);
