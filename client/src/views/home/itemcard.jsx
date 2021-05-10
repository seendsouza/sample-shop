import React from "react";
import { connect } from "react-redux";
import { Card, Img, Button, H4, H5 } from "@bootstrap-styled/v4";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { addItem } from "@actions/cartActions";
import "@css/itemcard.css";

import PropTypes from "prop-types";

library.add(faShoppingCart);

const buttonLabel = (price, qty) => {
  if (!price) {
    return "";
  } else if (qty <= 0) {
    return "[SOLD OUT]";
  } else {
    return "[ADD TO CART]";
  }
};

const ItemCard = (props) => (
  <Card
    className="my-3 mx-auto d-block"
    style={{
      width: "24rem",
      borderWidth: "0px",
      backgroundColor: "transparent",
      fontFamily: "Coolvetica",
    }}
  >
    <Img
      src={props.image}
      className="card-img-top pb-0 ar-1"
      style={{ padding: "5%" }}
      alt={props.description}
    />
    <div className="card-body text-center pt-3">
      <div className="d-flex flex-wrap align-items-center justify-content-center pb-2">
        <H4
          className="card-title d-inline-block my-auto "
          style={{
            fontSize: "2rem",
            verticalAlign: "middle",
          }}
        >
          [{props.name}]
        </H4>
      </div>
      <div className="d-flex flex-wrap align-items-center justify-content-center ">
        <H5
          className="activator d-inline-block my-auto align-middle"
          style={{ fontSize: "2rem" }}
        >
          {props.price ? "$" + props.price : ""}
        </H5>
      </div>
      <Button
        color="secondary"
        style={{
          fontSize: "1.25em",
          borderWidth: "0px",
          backgroundColor: "transparent",
        }}
        className={`justify-content-center w-100`}
        onClick={() => {
          props.addItem(props.cart.cartid, props._id);
        }}
      >
        {buttonLabel(props.price, props.qty)}
      </Button>
    </div>
  </Card>
);

ItemCard.propTypes = {
  name: PropTypes.string,
  qty: PropTypes.number,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  image: PropTypes.string,
  description: PropTypes.string,
  _id: PropTypes.string,
  cart: PropTypes.object.isRequired,
  addItem: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  cart: state.cart,
});

export default connect(mapStateToProps, { addItem })(ItemCard);
