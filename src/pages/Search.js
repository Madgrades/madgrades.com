import React from "react";
import {Container, Divider, Grid, Header} from "semantic-ui-react";
import {parse} from 'qs';
import SetCourseFilterParams from "../components/SetCourseFilterParams";
import CourseFilterForm from "../components/CourseFilterForm";
import CourseSearchResults from "../components/CourseSearchResults";
import SearchResultCount from "../components/SearchResultCount";
import CourseSortForm from "../components/CourseSortForm";
import {Col, Row} from "react-flexbox-grid";

const extractParams = (location) => {
  const params = parse(location.search.substr(1));

  let query = params.query || null;
  let page = parseInt(params.page || '1', 10);
  let subjects = undefined;
  if (params.subjects && Array.isArray(params.subjects)) {
    subjects = params.subjects.map(s => s);
  }
  let instructors = undefined;
  if (Array.isArray(params.instructors)) {
    instructors = params.instructors.map(i => parseInt(i, 10));
  }
  let order = (params.order || '').toLowerCase();
  if (!['asc', 'desc'].includes(order)) {
    order = undefined;
  }
  let sort = (params.sort || '').toLowerCase();
  if (!['number', 'relevance', 'trending_all', 'trending_recent', 'trending_gpa_recent', 'trending_gpa'].includes(sort)) {
    sort = undefined;
  }

  return {
    query,
    page,
    subjects,
    instructors,
    sort,
    order
  }
};

const Courses = ({ location }) => (
    <Container className="Search">
      <SetCourseFilterParams params={extractParams(location)}/>
      <Row columns={16}>
        <Col xs={12} md={4} lg={3} style={{marginBottom: "20px"}}>
          <CourseFilterForm/>
        </Col>
        <Col xs={12} md={8} lg={9}>
          <Row middle>
            <Col xs>
              <Header as='h2'>
                <Header.Content>
                  <SearchResultCount/> courses
                </Header.Content>
              </Header>
            </Col>
            <Col xs>
              <Header as='h4' floated='right'>
                Sort by:
                {' '}
                <CourseSortForm/>
              </Header>
            </Col>
          </Row>
          <Divider/>
          <CourseSearchResults/>
        </Col>
      </Row>
    </Container>
);
export default Courses;