import React, {Component} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import {Container} from "semantic-ui-react";
import SiteHeader from "./containers/SiteHeader";
import Course from "./pages/Course";
import SiteFooter from "./containers/SiteFooter";
import Search from "./pages/Search";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Instructors from "./pages/Instructors";

class App extends Component {
  render = () => {
    return (
        <BrowserRouter>
          <div className="App">
            <SiteHeader/>
            <div className="app-content">
              <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/search/*" component={Search}/>
                <Route path="/courses/:uuid" component={Course}/>
                <Route path="/courses" component={Courses}/>
                <Route path="/instructors" component={Instructors}/>
                <Route path="/about" component={About}/>
                <Route component={NotFound}/>
              </Switch>
            </div>
            <SiteFooter/>
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
