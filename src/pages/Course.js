import React from "react";
import "../styles/pages/Home.css";
import CourseChart from "../components/CourseChart";
import CourseName from "../components/CourseName";

const Course = ({ match }) => (
    <div className="Course">
      <h1><CourseName uuid={match.params.uuid}/></h1>
      <CourseChart uuid={match.params.uuid}/>
      {/*<TermSelect termCodes={[1082]} includeCumulative={true}/>*/}
    </div>
);
export default Course;