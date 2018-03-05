import React from "react";
import {Header, Segment} from "semantic-ui-react";
import SubjectName from "../components/SubjectName";
import CourseName from "../components/CourseName";
import {Link} from "react-router-dom";

const InstructorSearchResultItem = ({ result }) => (
    <Segment color='blue'>
      <Header>
        <Header.Content as={Link} to={`/instructors/${result.id}`}>
          {result.name}
        </Header.Content>
      </Header>
    </Segment>
);
export default InstructorSearchResultItem;