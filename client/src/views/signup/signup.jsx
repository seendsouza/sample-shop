import React from "react";

import SignupForm from "./signupform";

import PropTypes from "prop-types";

const SignupView = (props) => (
  <div className="login">
    <SignupForm history={props.history} />
  </div>
);

SignupView.propTypes = {
  history: PropTypes.object,
};
export default SignupView;
