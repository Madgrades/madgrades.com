import React, {Component} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import {Container} from "semantic-ui-react";
import "./styles/App.css";
import SiteHeader from "./containers/SiteHeader";
import Course from "./pages/Course";
import SiteFooter from "./containers/SiteFooter";
import Search from "./pages/Search";
import About from "./pages/About";

class App extends Component {
  render = () => {
    return (
        <BrowserRouter>
          <Container>
            <div className="App">
              <SiteHeader/>
              <div className="app-content">
                <Switch>
                  <Route exact path="/" component={Home}/>
                  <Route path="/search/:query?" component={Search}/>
                  <Route path="/courses/:uuid" component={Course}/>
                  <Route path="/about" component={About}/>
                  <Route component={NotFound}/>
                </Switch>
              </div>
              <SiteFooter/>
            </div>
          </Container>
        </BrowserRouter>
    );
  }
}

export default App;
