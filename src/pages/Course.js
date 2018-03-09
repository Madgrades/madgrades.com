import React from "react";
import CourseChart from "../components/CourseChart";
import CourseName from "../components/CourseName";
import {Container, Dropdown, Grid} from "semantic-ui-react";
import TermSelect from "../containers/TermSelect";

const options = [
  { key: 1, text: 'JAMES SKRENTNY', description: '3.5 GPA', value: 1 },
  { key: 2, text: 'Two', value: 2 },
  { key: 3, text: 'Three', value: 3 },
];

const Course = ({ match }) => (
    <Container className="Course">
      <p></p>
      <h1><CourseName uuid={match.params.uuid}/></h1>
      <Grid>
        <Grid.Column width={4} mobile={16} tablet={6} computer={4}>
          <Dropdown placeholder='Select instructor...' fluid selection search options={options}/>
          <TermSelect termCodes={[1082]} includeCumulative={true}/>
        </Grid.Column>
        <Grid.Column width={12} mobile={16} tablet={10} computer={12}>
          <CourseChart uuid={match.params.uuid} instructorId={4434130}/>
        </Grid.Column>
      </Grid>
    </Container>
);
export default Course;