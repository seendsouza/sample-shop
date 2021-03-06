import React, { Component } from "react";
import { Redirect } from "react-router-dom";
export default function withAuth(ComponentToProtect) {
  return class extends Component {
    state = {
      loading: true,
      redirect: false,
    };
    componentDidMount() {
      fetch("/api/users/token")
        .then((res) => {
          if (res.status === 200) {
            this.setState({ loading: false });
          } else {
            const error = new Error(res.status + res.statusText);
            throw error;
          }
        })
        .catch((err) => {
          console.error(err);
          this.setState({ loading: false, redirect: true });
        });
    }
    render() {
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        return <Redirect to="/login" />;
      }
      return <ComponentToProtect {...this.props} />;
    }
  };
}
