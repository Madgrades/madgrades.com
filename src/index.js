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
// import logger from 'redux-logger'
import initReactFastclick from 'react-fastclick';

const api = utils.api.create("https://api.madgrades.com/v1/", "fe85238d9504436eb7c1a59fdc8eb92a");
// const api = utils.api.create("http://localhost:3001/v1/", "none");

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
