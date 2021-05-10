import React, { Component } from "react";
import {
  Button,
  Form,
  H2,
  Row,
  Col,
  Input,
  Container,
} from "@bootstrap-styled/v4";
import PropTypes from "prop-types";

class LoginForm extends Component {
  state = {
    email: "",
    password: "",
  };
  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };
  onSubmit = (event) => {
    event.preventDefault();
    fetch("/api/users", {
      method: "PUT",
      body: JSON.stringify(this.state),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          this.props.history.push("/inventory");
        } else {
          const error = new Error(res.status + res.statusText);
          throw error;
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error logging in please try again");
      });
  };
  render() {
    return (
      <Container fluid className="bg-primary min-vh-100">
        <Row className="my-auto">
          <Col xs={12} sm={6} className="col-sm-offset-3 mx-auto">
            <H2 className="my-3">Log in to your account</H2>
            <Form onSubmit={this.onSubmit}>
              <Input
                name="email"
                placeholder="E-mail address"
                onChange={this.handleInputChange}
                required
                className="my-3"
              />
              <Input
                name="password"
                placeholder="Password"
                type="password"
                onChange={this.handleInputChange}
                required
                className="my-3"
              />
              <Button size="lg" color="secondary">
                Login
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

LoginForm.propTypes = {
  history: PropTypes.object
}


export default LoginForm;
