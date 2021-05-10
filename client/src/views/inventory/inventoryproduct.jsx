import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Th, Tr, Input } from "@bootstrap-styled/v4";
import { updateProduct, deleteProduct } from "@actions/productActions";

class InventoryProduct extends Component {
  state = {
    _id: this.props._id,
    name: this.props.name,
    qty: this.props.qty,
    price: this.props.price,
    image: this.props.image,
    description: this.props.description,
  };
  onDeleteClick = () => {
    this.props.deleteProduct(this.state._id);
  };
  onUpdateClick = () => {
    const updatedProduct = {
      name: this.state.name,
      price: this.state.price,
      qty: this.state.qty,
      image: this.state.image,
      description: this.state.description,
    };
    console.log(updatedProduct);
    this.props.updateProduct(this.state._id, updatedProduct);
  };
  onChange = (type) => (e) => {
    if (type === "dec") {
      this.setState({
        [e.target.name]: parseFloat(e.target.value)
          ? parseFloat(e.target.value)
          : 0.0,
      });
    } else if (type === "int") {
      this.setState({
        [e.target.name]: parseInt(e.target.value)
          ? parseInt(e.target.value)
          : 0,
      });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };
  render() {
    return (
      <Tr>
        <Th>
          <Input
            defaultValue={this.state.qty}
            type="text"
            name="qty"
            onChange={this.onChange("int")}
          />
        </Th>
        <Th>
          <Input
            defaultValue={this.state.name}
            type="text"
            name="name"
            onChange={this.onChange("str")}
          />
        </Th>
        <Th>
          <Input
            defaultValue={this.state.price}
            type="text"
            name="price"
            onChange={this.onChange("dec")}
          />
        </Th>
        <Th>
          <Input
            defaultValue={this.state.image}
            type="text"
            name="image"
            onChange={this.onChange("str")}
          />
        </Th>
        <Th>
          <Input
            defaultValue={this.state.description}
            type="textarea"
            name="description"
            onChange={this.onChange("str")}
          />
        </Th>
        <Th>
          <Button
            onClick={() => {
              this.onUpdateClick();
            }}
          >
            &#8593;
          </Button>
        </Th>
        <Th>
          <Button
            className="btn-danger"
            onClick={() => {
              this.onDeleteClick();
            }}
          >
            &times;
          </Button>
        </Th>
      </Tr>
    );
  }
}

InventoryProduct.propTypes = {
  updateProduct: PropTypes.func.isRequired,
  deleteProduct: PropTypes.func.isRequired,
  _id: PropTypes.string,
  name: PropTypes.string,
  qty: PropTypes.number,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  image: PropTypes.string,
  description: PropTypes.string,
};

export default connect(null, { updateProduct, deleteProduct })(
  InventoryProduct
);
