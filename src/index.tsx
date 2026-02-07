import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "normalize.css";
import { Provider } from "react-redux";
import { store } from "./store";
import "semantic-ui-css/semantic.min.css";
import "./styles/index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
