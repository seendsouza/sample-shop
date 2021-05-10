import React from "react";
import PropTypes from "prop-types";
import { getCart } from "@actions/cartActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import "./stripebutton.css";

const stripePromise = loadStripe(
  import.meta.env.VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY
);
const StripeButton = (props) => {
  const createCheckoutSession = (resolve, reject) => {
    const cartId = props.cart.cartid;
    return fetch(`/api/carts/check/${cartId}`)
      .then((res) => res.json())
      .then((data) => {
        return data.status;
      })
      .then((status) => status === "active")
      .then((isActive) => {
        if (isActive) {
          return fetch(`/api/payments/stripe/checkout/${cartId}`, {
            method: "POST",
          })
            .then((res) => res.json())
            .then((data) => {
              resolve(data);
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

  const handleClick = async (event) => {
    const stripe = await stripePromise;
    try {
      const session = await new Promise(createCheckoutSession);

      // When the customer clicks on the button, redirect them to Checkout.
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      if (result.error) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
      }
    } catch (err) {
      const str = "Error: Expired Cart: Expired Cart";
      if (err.message.startsWith(str)) {
        console.log(str);
        props.history.push("/");
      }
    }

    /*
    const location = {
      pathname: "/success",
    };
    props.history.push(location, data);
          */
  };

  return (
    <button
      type="button"
      id="checkout-button"
      className="stripe-button"
      role="link"
      onClick={handleClick}
    >
      Stripe Checkout
    </button>
  );
};

StripeButton.propTypes = {
  cart: PropTypes.object.isRequired,
  history: PropTypes.object,
};

const mapStatetoProps = (state) => ({
  cart: state.cart,
});

export default connect(mapStatetoProps, { getCart })(withRouter(StripeButton));
