import React, {Component} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import {Container} from "semantic-ui-react";
import "./styles/App.css";
import SiteHeader from "./containers/SiteHeader";
import Course from "./pages/Course";

class App extends Component {
  render = () => {
    return (
        <BrowserRouter>
          <Container className="app">
            <SiteHeader/>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/courses/:uuid" component={Course}/>
              <Route component={NotFound}/>
            </Switch>
          </Container>
        </BrowserRouter>
    );
  }
}

export default App;
