import React from "react";
import CourseChart from "../components/CourseChart";
import CourseName from "../components/CourseName";
import {Container} from "semantic-ui-react";

const Course = ({ match }) => (
    <Container className="Course">
      <p></p>
      <h1><CourseName uuid={match.params.uuid}/></h1>
      <CourseChart uuid={match.params.uuid}/>
      {/*<TermSelect termCodes={[1082]} includeCumulative={true}/>*/}
    </Container>
);
export default Course;