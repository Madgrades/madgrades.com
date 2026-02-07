import ReactDOM from "react-dom/client";
import App from "./App";
import "normalize.css";
import { Provider } from "react-redux";
import { store } from "./store";
import "semantic-ui-css/semantic.min.css";
import "./styles/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
