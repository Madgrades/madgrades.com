import { Component, useEffect } from "react";
import { BrowserRouter, useLocation, Location } from "react-router-dom";
import SiteHeader from "./containers/SiteHeader";
import SiteFooter from "./containers/SiteFooter";
import Routes from "./Routes";

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params: Record<string, string>) => void;
    ga?: (command: string, field: string, value?: string) => void;
  }
}

const updateGa = (location: Location): void => {
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

function AnalyticsTracker(): null {
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => updateGa(location), 500);
  }, [location]);

  return null;
}

class App extends Component {
  render = (): JSX.Element => {
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

export default App;
