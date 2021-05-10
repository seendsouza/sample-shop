import React, { useEffect, useState, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Col, Row } from "@bootstrap-styled/v4";
import { getProducts } from "@actions/productActions";

import ItemCard from "./itemcard";

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

const ProductList = (props) => {
  const { getProducts } = props;
  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const { products } = props.product;
  const [width] = useWindowSize();
  const filteredProducts = products
    .reduce((acc, current) => {
      const x = acc.find((item) => item.name === current.name);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, [])
    .sort((a, b) => a.qty - b.qty)
    .sort((a, b) => {
      if (a.item_details.order !== null && b.item_details.order !== null) {
        return a.item_details.order - b.item_details.order;
      }
      return 0;
    });
  return (
    <Row
      className={`row-fluid  ${width >= 1140 ? "" : "justify-content-center"}`}
      style={{ minHeight: "712px" }}
    >
      {filteredProducts.map(({ _id, name, qty, item_details }) => (
        <Col xl={4} lg={6} md={8} sm={12} xs={12} key={_id}>
          <ItemCard
            _id={_id}
            name={name}
            qty={qty}
            price={item_details.price}
            image={item_details.image}
            description={item_details.description}
          />
        </Col>
      ))}
    </Row>
  );
};

ProductList.propTypes = {
  getProducts: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
};

const mapStatetoProps = (state) => ({
  product: state.product,
});

export default connect(mapStatetoProps, { getProducts })(ProductList);
