import React, { useEffect } from "react";

import {
  Container,
  Navbar,
  NavLink,
  NavbarBrand,
  H1,
  H2,
} from "@bootstrap-styled/v4";

import { LinkContainer } from "react-router-bootstrap";
import { connect } from "react-redux";

import { getCart } from "@actions/cartActions";
import CartIcon from "./carticon";
import PropTypes from "prop-types";

const NavBar = (props) => {
  const { getCart, cartid } = props;
  useEffect(() => {
    const localStorage = window.localStorage;
    const localCartId = localStorage.getItem("sample-cartid");
    getCart(localCartId);
  }, [getCart, cartid]);

  return (
    <Navbar light id="Top" fixed="top" toggleable="lg" className="bg-primary ">
      <Container className="text-center justify-content- mx-auto">
        <LinkContainer to="/">
          <NavbarBrand>
            <H1
              style={{
                fontFamily: "OsakaSans",
                fontSize: "1.5em",
                marginBottom: 0,
              }}
            >
              Sample Shop
            </H1>
          </NavbarBrand>
        </LinkContainer>
        <div>
          <LinkContainer to="/signup">
            <NavbarBrand>
              <H2
                style={{
                  fontSize: "1em",
                  marginBottom: 0,
                }}
              >
                Signup
              </H2>
            </NavbarBrand>
          </LinkContainer>
          <LinkContainer to="/login">
            <NavbarBrand>
              <H2
                style={{
                  fontSize: "1em",
                  marginBottom: 0,
                }}
              >
                Login
              </H2>
            </NavbarBrand>
          </LinkContainer>
          <LinkContainer to="/shopping-cart">
            <NavLink>
              <CartIcon small={true} className="d-sm-none" />
            </NavLink>
          </LinkContainer>
        </div>
      </Container>
    </Navbar>
  );
};
NavBar.propTypes = {
  getCart: PropTypes.func.isRequired,
  cartid: PropTypes.string,
};
const mapStateToProps = (state) => ({
  cartid: state.cart.cartid,
});

export default connect(mapStateToProps, { getCart })(NavBar);
