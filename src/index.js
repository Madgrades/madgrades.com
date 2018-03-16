import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'normalize.css'
import {applyMiddleware, combineReducers, createStore} from 'redux'
import {Provider} from 'react-redux'
import reducers from './redux/reducers'
import thunk from 'redux-thunk';
import utils from "./utils";
import 'semantic-ui-css/semantic.min.css';
import './styles/index.css'
import 'react-flexbox-grid/dist/react-flexbox-grid.css';
// import logger from 'redux-logger'
import initReactFastclick from 'react-fastclick';
import 'babel-polyfill';

const api = utils.api.create(
    process.env.REACT_APP_MADGRADES_API,
    process.env.REACT_APP_MADGRADES_API_TOKEN
);

const store = createStore(
    combineReducers(reducers),
    applyMiddleware(
        thunk.withExtraArgument(api),
        // logger
    )
);

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
);

initReactFastclick();
registerServiceWorker();
