import React, {Component} from "react";
import CourseSearchResults from "../components/CourseSearchResults";
import "../styles/pages/Home.css";

const Home = () => (
    <div className="Home">
      <div className="course-search-results">
        <CourseSearchResults/>
      </div>
    </div>
);
export default Home;