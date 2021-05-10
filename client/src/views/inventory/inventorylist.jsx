import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Table, Thead, Tbody, Th, Tr } from "@bootstrap-styled/v4";
import { getProducts } from "@actions/productActions";
import InventoryProduct from "./inventoryproduct";
import AddProductForm from "./addproductform";

const InventoryList = (props) => {
  const { products, getProducts } = props;

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <Table responsive className="table-responsive responsive">
      <Thead>
        <Tr>
          <Th>Qty</Th>
          <Th>Name</Th>
          <Th>Price</Th>
          <Th>Image Link</Th>
          <Th>Description</Th>
          <Th>Update</Th>
          <Th>Delete</Th>
        </Tr>
      </Thead>
      <Tbody>
        <AddProductForm />
        {products.map(({ _id, name, qty, item_details }) => (
          <InventoryProduct
            key={_id}
            _id={_id}
            name={name}
            qty={qty}
            price={item_details.price}
            image={item_details.image}
            description={item_details.description}
          />
        ))}
      </Tbody>
    </Table>
  );
};

InventoryList.propTypes = {
  getProducts: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
};

const mapStatetoProps = (state) => ({
  products: state.product.products,
});

export default connect(mapStatetoProps, { getProducts })(InventoryList);
