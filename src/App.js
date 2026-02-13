import React, { Component, useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import SiteHeader from "./containers/SiteHeader";
import SiteFooter from "./containers/SiteFooter";
import Routes from "./Routes";

const updateGa = (location) => {
  if (!location) {
    location = window.location;
  }
  if (window.gtag) {
    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search + location.hash,
      page_search: location.search,
      page_hash: location.hash,
    });
  }
  if (window.ga) {
    window.ga("set", "page", location.pathname + location.search);
    window.ga("send", "pageview");
  }
};

// Component to track route changes
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => updateGa(location), 500);
  }, [location]);

  return null;
}

class App extends Component {
  componentDidMount() {
    // Set initial theme attribute
    document.documentElement.setAttribute("data-theme", this.props.theme);
  }

  componentDidUpdate(prevProps) {
    // Update theme attribute when theme changes
    if (prevProps.theme !== this.props.theme) {
      document.documentElement.setAttribute("data-theme", this.props.theme);
    }
  }

  render = () => {
    return (
      <BrowserRouter>
        <AnalyticsTracker />
        <div className="App">
          <SiteHeader />
          <div className="app-content">
            <Routes />
          </div>
          <SiteFooter />
        </div>
      </BrowserRouter>
    );
  };
}

const mapStateToProps = (state) => ({
  theme: state.app.theme,
});

export default connect(mapStateToProps)(App);
