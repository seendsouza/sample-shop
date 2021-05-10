import React, { useState, useEffect } from "react";

import { H2, H3, P, Card, Row, Col } from "@bootstrap-styled/v4";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import CartItems from "./cartitems";
import PayPalButton from "./paypalbutton";
import StripeButton from "./stripebutton";

const loadPaypal = (cb) => {
  const id = "paypalCheckoutScript";
  const childScriptId = "xo-pptm";
  const existingScript = document.getElementById(id);
  const childScript = document.getElementById(childScriptId);
  if (!existingScript) {
    const script = document.createElement("script");
    script.src = "https://www.paypalobjects.com/api/checkout.js";
    script.id = id;
    document.head.appendChild(script);
    script.onload = () => {
      if (cb) cb();
    };
  }
  if (existingScript && childScript && cb) cb();
};
const PayPalButtonImpl = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    loadPaypal(() => {
      setLoaded(true);
    });
  });
  return loaded && window.paypal ? (
    <PayPalButton />
  ) : (
    <div>Loading Paypal Checkout...</div>
  );
};
const Cart = (props) => {
  const cartItems = props.items;
  return (
    <Card className="rounded align-items-start flex flex-wrap my-5 p-0">
      <Row className="w-100 h-100 m-0 p-0">
        <Col md={8} className="p-4 text-left">
          <H2 style={{ fontWeight: 900 }}>Shopping Cart</H2>
          {Array.isArray(cartItems) && cartItems.length > 0 && <CartItems />}
          {(!Array.isArray(cartItems) || cartItems.length) <= 0 && (
            <p>Your cart is currently empty.</p>
          )}
        </Col>
        <Col
          md={4}
          className="p-4 text-left"
          style={{ backgroundColor: "black" }}
        >
          <H3 style={{ fontWeight: 900 }} className="text-white">
            SUMMARY
          </H3>
          <div className="d-flex flex-wrap justify-content-between w-100">
            <P className="mb-0 text-white">Subtotal</P>
            <P className="mb-0 text-white float-right ">
              $
              {cartItems
                .reduce((accumulator, currentValue) => {
                  return (
                    accumulator +
                    currentValue.qty *
                      parseFloat(currentValue.item_details.price)
                  );
                }, 0)
                .toFixed(2)}
            </P>
          </div>
          <div className="d-flex flex-wrap justify-content-between w-100">
            <P className="mb-0 text-white">Taxes</P>
            <P className="mb-0 text-white">
              $
              {cartItems
                .reduce((accumulator, currentValue) => {
                  return (
                    accumulator +
                    currentValue.qty *
                      parseFloat(currentValue.item_details.price) *
                      0.13
                  );
                }, 0)
                .toFixed(2)}
            </P>
          </div>
          <div className="d-flex flex-wrap justify-content-between w-100">
            <P className="text-white" style={{ fontWeight: "bolder" }}>
              TOTAL
            </P>
            <P className="mb-0 text-white float-right ">
              $
              {cartItems
                .reduce((accumulator, currentValue) => {
                  return (
                    accumulator +
                    currentValue.qty *
                      parseFloat(currentValue.item_details.price) *
                      1.13
                  );
                }, 0)
                .toFixed(2)}
            </P>
          </div>
          <P className="text-white">Adblockers can block payments</P>
          {Array.isArray(cartItems) && cartItems.length > 0 && (
            <div>
              <PayPalButtonImpl />
              <div style={{ color: "#fff", textAlign: "center" }}>OR</div>
              <StripeButton className="col-xs-1" />
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
};

Cart.propTypes = {
  items: PropTypes.array.isRequired,
};

const mapStatetoProps = (state) => ({
  items: state.cart.items,
});

export default connect(mapStatetoProps, {})(Cart);
