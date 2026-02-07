import React from "react";
import { Header, Segment, Button } from "semantic-ui-react";
import CourseName from "../components/CourseName";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SubjectNameList from "./SubjectNameList";
import { Course } from "../types/api";

interface CourseSearchResultItemProps {
  result: Course;
}

const CourseSearchResultItem: React.FC<CourseSearchResultItemProps> = ({ result }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const compareWith = params.get("compareWith");

  const handleCompare = (): void => {
    navigate(`/courses/${compareWith}?compareWith=${result.uuid}`);
  };

  return (
    <Segment color="blue">
      <Header>
        <Header.Content as={Link} to={`/courses/${result.uuid}`}>
          <CourseName
            data={result}
            uuid={result.uuid}
            fallback={"(Unknown Name)"}
          />
          <Header.Subheader>
            <SubjectNameList subjects={result.subjects} /> {result.number}
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
