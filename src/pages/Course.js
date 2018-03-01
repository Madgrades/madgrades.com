import React from "react";
import CourseSearchResults from "../components/CourseSearchResults";
import "../styles/pages/Home.css";
import CourseChart from "../components/CourseChart";
import TermSelect from "../containers/TermSelect";

const getUuid = (props) => {
  return props.match.params.uuid;
};

const Course = (props) => (
    <div className="Course">
      <CourseChart uuid={getUuid(props)}/>
      <TermSelect termCodes={[1082]} includeCumulative={true}/>
      {getUuid(props)}
    </div>
);
export default Course;