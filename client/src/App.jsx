import React, { Component } from "react";

import BootstrapProvider from "@bootstrap-styled/provider";
import { makeTheme } from "bootstrap-styled";
import Color from "@bootstrap-styled/color";

import { Provider } from "react-redux";
import store from "./store";
import Routes from "./components/routes";

const v = { "$link-color": "#000" };
const theme = makeTheme({
  "$font-family-base": "Noto Sans, Sans-Serif",
  "$body-color": "#131415",
  "$btn-primary-bg": "#131415",
  "$btn-border-radius": ".35rem",
  "$brand-danger": "#002A22",
  "$badge-color": "#2ed167",
  "$badge-pill-border-radius": ".5rem",
  "$alert-border-radius": ".35rem",
  "$alert-success-text": "#EA638C",
  "$alert-success-bg": "#03012C",
  "$link-color": v["$link-color"],
  "$navbar-light-hover-color": Color(v["$link-color"]).lighten(0.35).toString(),
  "$border-width": "2px",
  "$border-color": "#000",
  "$text-secondary": "#fff",
  $primary: "#fff",
  $secondary: "#131415",
  "$btn-secondary-color": "#000",
  "$btn-secondary-bg": "#f5f5f5",
  "$btn-secondary-border": "#000",
  "$btn-disabled-opacity": "20%",
});
class App extends Component {
  render() {
    return (
      <div
        className="App"
        style={{ flex: 1, height: "100%", margin: "0px !important" }}
      >
        <Provider store={store}>
          <BootstrapProvider theme={theme}>
            <Routes />
          </BootstrapProvider>
        </Provider>
      </div>
    );
  }
}

export default App;
