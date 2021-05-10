import React from 'react';

import LoginForm from './loginform';

import PropTypes from "prop-types";

const LoginView = (props) => (
  <div className="login">
    <LoginForm history={props.history} />
  </div>
);

LoginView.propTypes = {
  history: PropTypes.object
}
export default LoginView;
