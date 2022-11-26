import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import SiteHeader from './containers/SiteHeader';
import SiteFooter from './containers/SiteFooter';
import { createBrowserHistory } from 'history';
import Routes from './Routes';

const history = createBrowserHistory();

const updateGa = (location) => {
  if (window.ga) {
    if (!location)
      location = window.location;
    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search + location.hash,
      page_search: location.search,
      page_hash: location.hash,
    });
  }
};

// google analytics
history.listen(location => {
  setTimeout(() => updateGa(location), 500);
});

// send page view on page load
setTimeout(() => updateGa(), 500);

class App extends Component {
  render = () => {
    return (
      <Router history={history}>
        <div className='App'>
          <SiteHeader />
          <div className='app-content'>
            <Routes />
          </div>
          <SiteFooter />
        </div>
      </Router>
    );
  }
}

export default App;
