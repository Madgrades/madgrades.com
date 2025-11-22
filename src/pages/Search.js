import React from "react";
import { Button, Container, Divider, Header, Message } from "semantic-ui-react";
import { parse } from "qs";
import SetCourseFilterParams from "../components/SetCourseFilterParams";
import CourseFilterForm from "../components/CourseFilterForm";
import CourseSearchResults from "../components/CourseSearchResults";
import SearchResultCount from "../components/SearchResultCount";
import CourseSortForm from "../components/CourseSortForm";
import { Row, Col } from "../components/Grid";
import AdSlot from "../containers/AdSlot";
import { useLocation } from "react-router-dom";

const extractParams = (location) => {
  const params = parse(location.search.substr(1));

  let query = params.query || null;
  let page = parseInt(params.page || "1", 10);
  let subjects = undefined;
  if (params.subjects && Array.isArray(params.subjects)) {
    subjects = params.subjects;
  }
  let instructors = undefined;
  if (Array.isArray(params.instructors)) {
    instructors = params.instructors.map((i) => parseInt(i, 10));
  }
  let order = (params.order || "").toLowerCase();
  if (!["asc", "desc"].includes(order)) {
    order = undefined;
  }
  let sort = (params.sort || "").toLowerCase();
  if (
    ![
      "number",
      "relevance",
      "trending_all",
      "trending_recent",
      "trending_gpa_recent",
      "trending_gpa",
    ].includes(sort)
  ) {
    sort = undefined;
  }
  let compareWith = params.compareWith || undefined;

  return {
    query,
    page,
    subjects,
    instructors,
    sort,
    order,
    compareWith,
  };
};

const Courses = () => {
  document.title = "Search UW Madison Courses - Madgrades";
  const location = useLocation();
  const params = extractParams(location);
  const isComparing = !!params.compareWith;

  return (
    <Container className="Search">
      <SetCourseFilterParams params={params} />
      {isComparing && (
        <Message info>
          <Message.Header>Comparison Mode</Message.Header>
          <p>Select a course to compare with the previously selected course.</p>
          <Message.Content>
            <Button
              onClick={() => {
                const params = new URLSearchParams(location.search);
                params.delete("compareWith");
                window.location.search = params.toString();
              }}
            >
              Leave Comparison Mode
            </Button>
          </Message.Content>
        </Message>
      )}
      <Row>
        <Col xs={12} md={4} lg={3} style={{ marginBottom: "20px" }}>
          <CourseFilterForm />
          <br style={{ clear: "both" }} />
          <Divider />
          <center>
            <AdSlot
              slot={process.env.REACT_APP_ADSENSE_SIDEBAR_SLOT}
              adWidth={"250px"}
              adHeight={"250px"}
            />
          </center>
        </Col>
        <Col xs={12} md={8} lg={9}>
          <Row middle>
            <Col xs>
              <Header as="h2">
                <Header.Content>
                  <SearchResultCount /> courses
                </Header.Content>
              </Header>
            </Col>
            <Col auto style={{ textAlign: "right" }}>
              <Header as="h4">
                Sort by: <CourseSortForm />
              </Header>
            </Col>
          </Row>
          <Divider />
          <CourseSearchResults />
        </Col>
      </Row>
    </Container>
  );
};
export default Courses;
