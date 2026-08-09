import React from "react";
import { Header, Segment, Button } from "semantic-ui-react";
import CourseName from "../components/CourseName";
import { useLocation, useNavigate } from "react-router-dom";
import SubjectNameList from "./SubjectNameList";

const CourseSearchResultItem = ({ result }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const compareWith = params.get("compareWith");

  const handleCompare = (e) => {
    e.stopPropagation();
    navigate(`/courses/${compareWith}?compareWith=${result.uuid}`);
  };

  const handleClick = () => {
    navigate(`/courses/${result.uuid}`);
  };

  return (
    <Segment onClick={handleClick}>
      <Header>
        <Header.Content>
          <CourseName
            data={result}
            uuid={result.uuid}
            fallback={"(Unknown Name)"}
          />
          <Header.Subheader>
            <SubjectNameList subjects={result.subjects} courseNumber={result.number} />
          </Header.Subheader>
        </Header.Content>
      </Header>
      {compareWith && (
        <Button primary size="small" onClick={handleCompare}>
          Compare with this course
        </Button>
      )}
    </Segment>
  );
};

export default CourseSearchResultItem;
