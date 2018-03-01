import React from "react";
import CourseSearchResults from "../components/CourseSearchResults";
import "../styles/pages/Home.css";
import CourseChart from "../components/CourseChart";
import TermSelect from "../containers/TermSelect";

const Course = ({ match }) => (
    <div className="Course">
      <CourseChart uuid={match.params.uuid}/>
      {/*<TermSelect termCodes={[1082]} includeCumulative={true}/>*/}
    </div>
);
export default Course;