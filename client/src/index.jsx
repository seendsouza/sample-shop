import React from "react";
import { hydrate, render } from "react-dom";
import "./css/index.css";
import App from "./App";

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootElement
  );
} else {
  render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootElement
  );
}

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
