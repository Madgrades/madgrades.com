import React, {Component} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Course from "./pages/Course";

class App extends Component {
  render = () => {
    return (
      <div className="app">
        <BrowserRouter>
          <div>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/courses/:id" component={Course}/>
              <Route component={NotFound}/>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
