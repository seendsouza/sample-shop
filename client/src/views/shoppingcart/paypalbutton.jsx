import React, { useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { getCart } from "@actions/cartActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const PayPalButton = (props) => {
  let PayPalBtn = (() => {
    if (window.paypal) {
      return window.paypal.Button.driver("react", {
        React: React,
        ReactDOM: ReactDOM,
      });
    }
  })();
  const [payment, setPayment] = useState({});

  const paymentMethod = (resolve, reject) => {
    const cartId = props.cart.cartid;
    fetch(`/api/carts/check/${cartId}`)
      .then((res) => res.json())
      .then((data) => {
        return data.status;
      })
      .then((status) => status === "active")
      .then((isActive) => {
        if (isActive) {
          return fetch(`/api/payments/paypal/checkout/${props.cart.cartid}`, {
            method: "POST",
          })
            .then((res) => res.json())
            .then((data) => {
              setPayment(data);
              resolve(data.id);
            });
        } else {
          getCart(cartId);
          let e = new Error("Expired Cart");
          e.name = "Expired Cart";
          throw e;
        }
      })
      .catch((err) => {
        reject(err);
      });
  };
  const onError = (err) => {
    console.log(err.name);
    console.log(err.message);
    console.log(err.number);
    const str = "Error: Expired Cart: Expired Cart";
    if (err.message.startsWith(str)) {
      props.history.push("/");
    }
  };
  const onAuthorize = () => {
    // (data, actions)
    console.log("Authorizing PayPal Checkout");
    const body = payment;
    return fetch(`/api/payments/paypal/execute/${props.cart.cartid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        const payerInfo = data.payer.payer_info;
        return {
          name: `${payerInfo.first_name} ${payerInfo.last_name}`,
          email: payerInfo.email,
        };
      })
      .then((data) => {
        const location = {
          pathname: "/success",
        };
        props.history.push(location, data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const onCancel = () => {
    // (data, actions)
    console.log("Canceling PayPal payment");
    return fetch(`/api/payments/paypal/cancel/${props.cart.cartid}`, {
      method: "POST",
    }).catch(console.error);
  };
  let client = {
    production: import.meta.env.VITE_PUBLIC_PAYPAL_CLIENT_ID_PROD,
    sandbox: import.meta.env.VITE_PUBLIC_PAYPAL_CLIENT_ID_SAND,
  };
  let env = import.meta.env.VITE_PUBLIC_PAYPAL_ENV;
  return (
    <PayPalBtn
      env={env}
      client={client}
      payment={paymentMethod}
      onAuthorize={onAuthorize}
      onCancel={onCancel}
      onError={onError}
      style={{
        color: "white",
        shape: "rect",
        size: "responsive",
        tagline: "false",
      }}
    />
  );
};

PayPalButton.propTypes = {
  cart: PropTypes.object.isRequired,
  history: PropTypes.object,
};

const mapStatetoProps = (state) => ({
  cart: state.cart,
});

export default connect(mapStatetoProps, { getCart })(withRouter(PayPalButton));
