import React, {Component} from "react";
import {Router} from "react-router-dom";
import SiteHeader from "./containers/SiteHeader";
import SiteFooter from "./containers/SiteFooter";
import {createBrowserHistory} from "history";
import Routes from "./Routes";

const history = createBrowserHistory();

// google analytics
history.listen(location => {
  if (window.ga) {
    window.ga('set', 'page', location.pathname + location.search);
    window.ga('send', 'pageview');
  }
});

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
