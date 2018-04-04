import React from "react";
import CourseName from "../components/CourseName";
import {Container, Divider, Header} from "semantic-ui-react";
import CourseChartViewer from "../components/CourseChartViewer";
import CourseGpaChart from "../components/CourseGpaChart";
import {parse, stringify} from "qs";
import InstructorChartViewer from "../components/InstructorChartViewer";

const Instructor = ({ match, location, history }) => {
  const { id } = match.params;

  const onChange = (params) => {
    history.push(`/instructors/${id}?${stringify(params)}`)
  };

  return (
      <Container className="Course">
        <Header size='huge'>
          <Header.Content style={{maxWidth: "100%"}}>
            Test
          </Header.Content>
        </Header>
        <Divider/>
        <InstructorChartViewer
          id={parseInt(id)}
        />
      </Container>
  )
};
export default Instructor;