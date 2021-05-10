import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Input, Button, Tr, Th } from "@bootstrap-styled/v4";
import { addProduct } from "../../actions/productActions";

class AddProductForm extends Component {
  state = {
    name: "",
    price: 0.0,
    qty: 0,
    image: "",
    description: "",
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
  onSubmit = () => {
    const newProduct = {
      name: this.state.name,
      price: this.state.price,
      qty: this.state.qty,
      image: this.state.image,
      description: this.state.description,
    };
    this.props.addProduct(newProduct);
  };
  render() {
    return (
      <Tr>
        <Th>
          <Input type="text" name="qty" onChange={this.onChange("int")}></Input>
        </Th>
        <Th>
          <Input
            type="text"
            name="name"
            onChange={this.onChange("str")}
          ></Input>
        </Th>
        <Th>
          <Input
            type="text"
            name="price"
            onChange={this.onChange("dec")}
          ></Input>
        </Th>
        <Th>
          <Input
            type="text"
            name="image"
            onChange={this.onChange("str")}
          ></Input>
        </Th>
        <Th>
          <Input
            type="textarea"
            name="description"
            onChange={this.onChange("str")}
          ></Input>
        </Th>
        <Th>
          <Button type="submit" onClick={this.onSubmit}>
            Submit
          </Button>
        </Th>
      </Tr>
    );
  }
}

AddProductForm.propTypes = {
  addProduct: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
};

const mapStatetoProps = (state) => ({
  product: state.product,
});

export default connect(mapStatetoProps, { addProduct })(AddProductForm);
