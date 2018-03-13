import React from "react";
import {Header, Segment} from "semantic-ui-react";
import CourseName from "../components/CourseName";
import {Link} from "react-router-dom";
import SubjectNameList from "./SubjectNameList";

const CourseSearchResultItem = ({ result }) => (
    <Segment color='blue'>
      <Header>
        <Header.Content as={Link} to={`/courses/${result.uuid}`}>
          <CourseName
              data={result}
              uuid={result.uuid}
              fallback={"(Unknown Name)"}/>
          <Header.Subheader>
            <SubjectNameList
              subjectCodes={result.subjects.map(s => s.code)}/> {result.number}
          </Header.Subheader>
        </Header.Content>
      </Header>
    </Segment>
);
export default CourseSearchResultItem;