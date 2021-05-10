import React, { Component, Suspense, lazy } from "react";
import history from "../history-helper";
import { Router, Switch, Route } from "react-router-dom";
import withAuth from "./withauth";

import NavBar from "./navbar";

const HomeView = lazy(() => import("@views/home"));
const ShoppingCartView = lazy(() => import("@views/shoppingcart"));
const InventoryView = lazy(() => import("@views/inventory"));
const LoginView = lazy(() => import("@views/login"));
const SignupView = lazy(() => import("@views/signup"));
const SuccessView = lazy(() => import("@views/success"));

class Routes extends Component {
  render() {
    return (
      <Router history={history}>
        <NavBar />
        <div style={{ minHeight: "75vh" }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              {/*Protected Routes*/}
              <Route component={withAuth(InventoryView)} path="/inventory" />
              {/*Unprotected Routes*/}
              <Route component={ShoppingCartView} path="/shopping-cart" />
              <Route component={SuccessView} path="/success" />
              <Route component={LoginView} path="/login" />
              <Route component={SignupView} path="/signup" />
              <Route component={HomeView} path="/" />
            </Switch>
          </Suspense>
        </div>
      </Router>
    );
  }
}

export default Routes;
