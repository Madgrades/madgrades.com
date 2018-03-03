import React from "react";
import CourseSearchResults from "../components/CourseSearchResults";
import "../styles/pages/Home.css";
import SetCourseSearchQuery from "../components/SetCourseSearchQuery";

const Search = ({match}) => (
    <div className="Search">
      <h2>Search</h2>
      <SetCourseSearchQuery query={match.params.query}/>
      <CourseSearchResults/>
    </div>
);
export default Search;