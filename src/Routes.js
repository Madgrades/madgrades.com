import Home from "./pages/Home";
import Course from "./pages/Course";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import About from "./pages/About";
import ToggleDev from "./pages/ToggleDev";
import Explore from "./pages/Explore";
import { Route, Routes } from "react-router-dom";
import React from "react";

export default () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/courses/:uuid" element={<Course />} />
    <Route path="/explore/:entity?" element={<Explore />} />
    <Route path="/explore" element={<Explore />} />
    <Route path="/search" element={<Search />} />
    <Route path="/about" element={<About />} />
    <Route path="/toggle_dev" element={<ToggleDev />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
