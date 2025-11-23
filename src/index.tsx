import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'normalize.css';
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './redux/reducers';
import { withExtraArgument } from 'redux-thunk';
import utils from './utils';
import 'semantic-ui-css/semantic.min.css';
import './styles/index.css';
import initReactFastclick from 'react-fastclick';
const api = utils.api.create(
  import.meta.env.VITE_MADGRADES_API || 'https://api.madgrades.com/',
  import.meta.env.VITE_MADGRADES_API_TOKEN
);

const store = createStore(
  combineReducers(reducers),
  applyMiddleware(
    withExtraArgument(api)
    // logger
  )
);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

initReactFastclick();
