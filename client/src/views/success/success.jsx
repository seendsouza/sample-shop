import React, { useEffect, useState } from "react";

import { connect } from "react-redux";

import { H2, P, Container } from "@bootstrap-styled/v4";
import { LinkContainer } from "react-router-bootstrap";

import { addCart } from "../../actions/cartActions";
import PropTypes from "prop-types";

import { useLocation } from "react-router-dom";
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SuccessImpl = (props) => {
  useEffect(() => {
    props.addCart();
  }, []);

  const { email, name } = props;
  return (
    <div className="success min-vh-100 bg-primary">
      <Container className="text-center">
        <H2>Thank You {name}</H2>
        <P>You just became a lil&rsquo; more sus.</P>
        <P>
          An email has been sent to <strong>{email}</strong> with your order
          information. If you do not receive an email within an hour, contact us{" "}
          <LinkContainer to="/contact">
            <a href="/contact">here</a>
          </LinkContainer>{" "}
          or at <a href="mailto:ccandsdco@gmail.com">ccandsdco@gmail.com</a>.
        </P>
      </Container>
    </div>
  );
};

const SuccessView = (props) => {
  const query = useQuery();
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    const sessionId = query.get("session_id");
    if (sessionId) {
      fetch(`/api/payments/stripe/success/${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setName(data.name);
          setEmail(data.email);
        });
    }
  }, []);

  if (props.location.state) {
    return (
      <SuccessImpl
        getCart={props.getCart}
        addCart={props.addCart}
        {...props.location.state}
      />
    );
  } else if (name && email) {
    return (
      <SuccessImpl
        getCart={props.getCart}
        addCart={props.addCart}
        email={email}
        name={name}
      />
    );
  } else {
    return null;
  }
};

SuccessImpl.propTypes = {
  addCart: PropTypes.func.isRequired,
  getCart: PropTypes.func.isRequired,
  location: PropTypes.object,
  email: PropTypes.string,
  name: PropTypes.string,
};
const mapStateToProps = (state) => ({
  cart: state.cart,
});

export default connect(mapStateToProps, { addCart })(SuccessView);
