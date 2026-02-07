import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "normalize.css";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { Provider } from "react-redux";
import reducers from "./redux/reducers";
import { thunk, withExtraArgument } from "redux-thunk";
import utils from "./utils";
import "semantic-ui-css/semantic.min.css";
import "./styles/index.css";
import logger from "redux-logger";
import initReactFastclick from "react-fastclick";
import "babel-polyfill";

const api = utils.api.create(
  process.env.REACT_APP_MADGRADES_API || "https://api.madgrades.com/",
  process.env.REACT_APP_MADGRADES_API_TOKEN,
);

const store = createStore(
  combineReducers(reducers),
  applyMiddleware(
    withExtraArgument(api),
    // logger
  ),
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);

initReactFastclick();
