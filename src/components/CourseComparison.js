import React, { Component } from "react";
import { Container, Grid, Segment, Header, Button } from "semantic-ui-react";
import PropTypes from "prop-types";
import CourseName from "./CourseName";
import CourseChartViewer from "./CourseChartViewer";
import CourseGpaChart from "./CourseGpaChart";
import { parse, stringify } from "qs";

class CourseComparison extends Component {
  static propTypes = {
    course1Uuid: PropTypes.string.isRequired,
    course2Uuid: PropTypes.string.isRequired,
    onRemoveComparison: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    navigate: PropTypes.func.isRequired,
  };

  handleCourse1Change = (params) => {
    const { course1Uuid, course2Uuid, location, navigate } = this.props;
    const currentParams = parse(location.search.substr(1));

    const newParams = {
      instructorId: params.instructorId || "0",
      termCode: params.termCode || "0",
      course2InstructorId: currentParams.course2InstructorId || "0",
      course2TermCode: currentParams.course2TermCode || "0",
      compareWith: course2Uuid,
    };
    navigate(`/courses/${course1Uuid}?${stringify(newParams)}`);
  };

  handleCourse2Change = (params) => {
    const { course1Uuid, course2Uuid, location, navigate } = this.props;
    const currentParams = parse(location.search.substr(1));

    const newParams = {
      instructorId: currentParams.instructorId || "0",
      termCode: currentParams.termCode || "0",
      course2InstructorId: params.instructorId || "0",
      course2TermCode: params.termCode || "0",
      compareWith: course2Uuid,
    };
    navigate(`/courses/${course1Uuid}?${stringify(newParams)}`);
  };

  handleReplaceCourse1 = () => {
    const { course2Uuid, navigate } = this.props;
    // Navigate to search with course2 as the comparison target
    navigate(`/search?compareWith=${course2Uuid}&replacing=1`);
  };

  handleReplaceCourse2 = () => {
    const { course1Uuid, navigate } = this.props;
    // Navigate to search with course1 as the comparison target
    navigate(`/search?compareWith=${course1Uuid}&replacing=2`);
  };

  render() {
    const { course1Uuid, course2Uuid, onRemoveComparison, location } =
      this.props;
    const params = parse(location.search.substr(1));

    const course1InstructorId = parseInt(params.instructorId || "0", 10);
    const course1TermCode = parseInt(params.termCode || "0", 10);
    const course2InstructorId = parseInt(params.course2InstructorId || "0", 10);
    const course2TermCode = parseInt(params.course2TermCode || "0", 10);

    return (
      <Container fluid style={{ padding: "20px 40px" }}>
        <div style={{ display: "flex", gap: "1em", marginBottom: "2em" }}>
          <Button secondary onClick={onRemoveComparison}>
            Remove Comparison
          </Button>
        </div>
        <Grid columns={2} divided relaxed>
          <Grid.Row>
            <Grid.Column>
              <Segment basic>
                <Header size="huge" style={{ marginBottom: "1em" }}>
                  <Header.Content>
                    <CourseName
                      uuid={course1Uuid}
                      fallback={"(Unknown Name)"}
                    />
                    <Header.Subheader style={{ marginTop: "0.5em" }}>
                      <CourseName
                        uuid={course1Uuid}
                        asSubjectAndNumber={true}
                      />
                    </Header.Subheader>
                  </Header.Content>
                </Header>
                <Button
                  secondary
                  icon="exchange"
                  content="Replace Course"
                  onClick={this.handleReplaceCourse1}
                  style={{ marginBottom: "1em" }}
                />
                <div className="chart-container" style={{ minHeight: "400px" }}>
                  <CourseChartViewer
                    uuid={course1Uuid}
                    instructorId={course1InstructorId}
                    termCode={course1TermCode}
                    onChange={this.handleCourse1Change}
                  />
                </div>
                <div
                  className="chart-container"
                  style={{ marginTop: "1em", minHeight: "300px" }}
                >
                  <CourseGpaChart uuid={course1Uuid} />
                </div>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment basic>
                <Header size="huge" style={{ marginBottom: "1em" }}>
                  <Header.Content>
                    <CourseName
                      uuid={course2Uuid}
                      fallback={"(Unknown Name)"}
                    />
                    <Header.Subheader style={{ marginTop: "0.5em" }}>
                      <CourseName
                        uuid={course2Uuid}
                        asSubjectAndNumber={true}
                      />
                    </Header.Subheader>
                  </Header.Content>
                </Header>
                <Button
                  secondary
                  icon="exchange"
                  content="Replace Course"
                  onClick={this.handleReplaceCourse2}
                  style={{ marginBottom: "1em" }}
                />
                <div className="chart-container" style={{ minHeight: "400px" }}>
                  <CourseChartViewer
                    uuid={course2Uuid}
                    instructorId={course2InstructorId}
                    termCode={course2TermCode}
                    onChange={this.handleCourse2Change}
                  />
                </div>
                <div
                  className="chart-container"
                  style={{ marginTop: "1em", minHeight: "300px" }}
                >
                  <CourseGpaChart uuid={course2Uuid} />
                </div>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default CourseComparison;
