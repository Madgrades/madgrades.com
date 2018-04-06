import React, {Component} from "react";
import {Router} from "react-router-dom";
import SiteHeader from "./containers/SiteHeader";
import SiteFooter from "./containers/SiteFooter";
import {createBrowserHistory} from "history";
import Routes from "./Routes";
import Cookies from 'universal-cookie';

const history = createBrowserHistory();

const setGaDevDimension = () => {
  if (window.ga) {
    const cookies = new Cookies();
    // toggled via accessing page /toggle_dev
    if (cookies.get('user_is_dev') === 'true') {
      // tell google analytics we are a developer
      window.ga('set', 'dimension1', 'true');
    }
  }
};

// google analytics
history.listen(location => {
  if (window.ga) {
    setGaDevDimension();
    window.ga('set', 'page', location.pathname + location.search);
    window.ga('send', 'pageview');
  }
});

setGaDevDimension();

class App extends Component {
  render = () => {
    return (
        <Router history={history}>
          <div className="App">
            <SiteHeader/>
            <div className="app-content">
              <Routes/>
            </div>
            <SiteFooter/>
          </div>
        </Router>
    );
  }
}

export default App;
