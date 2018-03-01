import React, {Component} from "react";
import {Header, Segment} from "semantic-ui-react";
import SubjectName from "../components/SubjectName";
import CourseName from "../components/CourseName";

const renderSubjectNames = (subjectCodes) => subjectCodes.map((code, i, arr) => {
  let divider = i < arr.length - 1 && <span>/</span>;
  return (
      <span key={code}>
        <SubjectName
            code={code}
            abbreviate={true}
            fallback="(Unknown Subject)"/>
        {divider}
      </span>
  )
});

const CourseSearchResult = ({ result }) => (
    <Segment>
      <Header>
        <Header.Content>
          <CourseName
              data={result}
              uuid={result.uuid}
              fallback={"(Unknown Name)"}/>
          <Header.Subheader>
            {renderSubjectNames(result.subjects)}
          </Header.Subheader>
        </Header.Content>
      </Header>
    </Segment>
);
export default CourseSearchResult;