import React from "react";
import {
  Container,
  Divider,
  Dropdown,
  Form,
  Grid,
  Header,
  Input
} from "semantic-ui-react";
import {parse} from 'qs';
import EntitySelect from "../components/EntitySelect";

const extractParams = (location) => {
  const params = parse(location.search.substr(1));

  let query = params.query || null;
  let page = parseInt(params.page || '1');
  let subject = null;
  if (params.subject && Array.isArray(params.subject)) {
    subject = params.subject.map(s => parseInt(s));
  }
  let instructor = null;
  if (Array.isArray(params.instructor)) {
    instructor = params.instructor.map(i => parseInt(i));
  }
  let order = (params.order || '').toLowerCase();
  if (!['asc', 'desc'].includes(order)) {
    order = null;
  }
  let sort = (params.sort || '').toLowerCase();
  if (!['number', 'relevance', 'trending_all', 'trending_recent'].includes(sort)) {
    sort = null;
  }

  return {
    query,
    page,
    subject,
    instructor,
    sort,
    order
  }
};

const subjects = [
  { key: '600', text: 'MATH', value: '600' },
  { key: '266', text: 'COMP SCI', value: '266' },
];

const instructors = [
  { key: '2512312', text: 'Bob Joe', value: '2412323' }
];

const sort = [
  { key: 'relevance', text: 'Best match', value: 'relevance' },
  { key: 'trending_recent', text: 'Trending', value: 'trending_recent' },
  { key: 'trending_all', text: 'Trending (All Time)', value: 'trending_all' },
  { key: 'number', text: 'Number', value: 'number' }
];

const search = (input) => {
  console.log(input);
};

const Courses = ({ location }) => (
    <Container className="Courses">
      <Grid columns={16}>
        <Grid.Column computer={4} mobile={16} tablet={6}>
          <Form>
            <Form.Field>
              <label>Search</label>
              <Input placeholder="Search..."/>
            </Form.Field>
            <Form.Field>
              <label>Subjects</label>
              <EntitySelect entityType='subject'/>
            </Form.Field>
            <Form.Field>
              <label>Instructors</label>
              <EntitySelect entityType='instructor'/>
            </Form.Field>
            <Form.Button>Search</Form.Button>
          </Form>
        </Grid.Column>
        <Grid.Column computer={12} mobile={16} tablet={10}>
          <Grid verticalAlign='middle'>
            <Grid.Column width={6}>
              <Header as='h2'>
                <Header.Content>
                  0 courses
                </Header.Content>
              </Header>
            </Grid.Column>
              <Grid.Column width={10}>
              <Header as='h4' floated='right'>
                Sort by: <Dropdown inline direction='left' header='Sort options' options={sort} defaultValue={sort[0].value} />
              </Header>
            </Grid.Column>
          </Grid>
          <Divider/>
          <p>
            Course search not completed.
          </p>
        </Grid.Column>
      </Grid>
    </Container>
);
export default Courses;