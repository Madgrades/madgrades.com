import React from "react";
import {Container, Divider, Dropdown, Grid, Header} from "semantic-ui-react";
import {parse} from 'qs';
import SetCourseFilterParams from "../components/SetCourseFilterParams";
import CourseFilterForm from "../components/CourseFilterForm";
import CourseSearchResultItem from "../containers/CourseSearchResultItem";
import CourseSearchResults from "../components/CourseSearchResults";
import AdvancedSearchResultCount from "../components/AdvancedSearchResultCount";
import CourseSortForm from "../components/CourseSortForm";

const extractParams = (location) => {
  const params = parse(location.search.substr(1));

  let query = params.query || null;
  let page = parseInt(params.page || '1');
  let subjects = undefined;
  if (params.subjects && Array.isArray(params.subjects)) {
    subjects = params.subjects.map(s => s);
  }
  let instructors = undefined;
  if (Array.isArray(params.instructors)) {
    instructors = params.instructors.map(i => parseInt(i));
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
    <Container className="Courses">
      <SetCourseFilterParams params={extractParams(location)}/>

      <Grid columns={16}>
        <Grid.Column computer={4} mobile={16} tablet={6}>
          <CourseFilterForm/>
        </Grid.Column>
        <Grid.Column computer={12} mobile={16} tablet={10}>
          <Grid verticalAlign='middle'>
            <Grid.Column width={6}>
              <Header as='h2'>
                <Header.Content>
                  <AdvancedSearchResultCount/> courses
                </Header.Content>
              </Header>
            </Grid.Column>
              <Grid.Column width={10}>
              <Header as='h4' floated='right'>
                Sort by:
                {' '}
                <CourseSortForm/>
              </Header>
            </Grid.Column>
          </Grid>
          <Divider/>
          <CourseSearchResults isAdvanced/>
        </Grid.Column>
      </Grid>
    </Container>
);
export default Courses;