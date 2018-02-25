import React, {Component} from "react";
import CourseData from "../components/CourseData";

const Course = (props) => (
    <div>
      <h2>{props.match.params.id}</h2>
      <CourseData uuid={props.match.params.id}/>
      <button>Test</button>
    </div>
);
export default Course;