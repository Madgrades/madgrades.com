import React from "react";
import { Container, Divider, Header, Button } from "semantic-ui-react";
import CourseName from "../components/CourseName";
import CourseChartViewer from "../components/CourseChartViewer";
import CourseGpaChart from "../components/CourseGpaChart";
import CourseComparison from "../components/CourseComparison";
import { parse, stringify } from "qs";
import CourseData from "../components/CourseData";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Course as CourseType, Subject } from "../types/api";

interface CourseDataType extends CourseType {
  subjects: Subject[];
}

interface ChangeParams {
  instructorId?: number;
  termCode?: number;
}

const Course: React.FC = () => {
  document.title = " - Madgrades";

  const { uuid } = useParams<{ uuid: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const params = parse(location.search.substr(1));
  const { compareWith } = params;

  let instructorId = parseInt((params.instructorId as string) || "0", 10);
  let termCode = parseInt((params.termCode as string) || "0", 10);

  const onChange = (changeParams: ChangeParams): void => {
    navigate(`/courses/${uuid}?${stringify(changeParams)}`);
  };

  const onCourseDataLoad = (data: CourseDataType): void => {
    const { name, subjects, number } = data;

    const visibleName = name || "Unknown Name";
    const title = visibleName + " - Madgrades";

    let desc =
      subjects
        .map((s) => s.abbreviation)
        .slice(0, 3)
        .join(", ") +
      " " +
      number;
    desc +=
      " UW Madison course grade distribution and average GPA over time or by instructor.";

    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", desc);
    }
  };

  const handleCompare = (): void => {
    navigate(`/search?compareWith=${uuid}`);
  };

  const removeComparison = (): void => {
    navigate(`/courses/${uuid}`);
  };

  if (compareWith) {
    return (
      <CourseComparison
        course1Uuid={uuid!}
        course2Uuid={compareWith as string}
        onRemoveComparison={removeComparison}
        location={location}
        navigate={navigate}
      />
    );
  }

  return (
    <Container className="Course">
      <CourseData uuid={uuid!} onDataLoad={onCourseDataLoad} />
      <Header size="huge">
        <Header.Content style={{ maxWidth: "100%" }}>
          <CourseName uuid={uuid!} fallback={"(Unknown Name)"} />
          <Header.Subheader style={{ maxWidth: "100%" }}>
            <CourseName uuid={uuid!} asSubjectAndNumber={true} />
          </Header.Subheader>
        </Header.Content>
      </Header>
      <Button primary onClick={handleCompare} style={{ marginBottom: "1em" }}>
        Compare with Another Course
      </Button>
      <Divider />
      <CourseChartViewer
        instructorId={instructorId}
        termCode={termCode}
        onChange={onChange}
        uuid={uuid!}
      />
      <Divider />
      <CourseGpaChart uuid={uuid!} />
    </Container>
  );
};

export default Course;
