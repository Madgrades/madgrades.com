import Home from "./pages/Home";
import Course from "./pages/Course";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import About from "./pages/About";
import {Route, Switch} from "react-router";
import React from "react";

export default () => (
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route path="/courses/:uuid" component={Course}/>
      <Route path="/search" component={Search}/>
      <Route path="/about" component={About}/>
      <Route component={NotFound}/>
    </Switch>
);