import { useEffect } from 'react';
import { BrowserRouter, useLocation, Location } from 'react-router-dom';
import SiteHeader from './containers/SiteHeader';
import SiteFooter from './containers/SiteFooter';
import Routes from './Routes';

declare global {
  interface Window {
    gtag?: (event: string, action: string, params: Record<string, string>) => void;
    ga?: (command: string, field: string, value?: string) => void;
  }
}

const updateGa = (location: Location | typeof window.location) => {
  const loc = location;
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: loc.pathname + loc.search + loc.hash,
      page_search: loc.search,
      page_hash: loc.hash,
    });
  }
  if (window.ga) {
    window.ga('set', 'page', loc.pathname + loc.search);
    window.ga('send', 'pageview');
  }
};

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => updateGa(location), 500);
  }, [location]);

  return null;
}

function App() {
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
}

export default App;
