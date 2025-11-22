import { useState, useEffect } from 'react';
import { Container, Dropdown, Header, Form } from 'semantic-ui-react';
import { Row, Col } from '../components/Grid';
import Explorer from '../components/Explorer';
import EntitySelect from '../components/EntitySelect';
import { parse, stringify } from 'qs';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import _ from 'lodash';

const entityOptions = [
  {
    key: 'course',
    text: 'Courses',
    value: 'course',
  },
  {
    key: 'instructor',
    text: 'Instructors',
    value: 'instructor',
  },
  {
    key: 'subject',
    text: 'Subjects',
    value: 'subject',
  },
];

interface ExploreParams {
  page: number;
  sort?: string;
  order?: string;
  subjects?: string[];
  instructors?: number[];
  minCountAvg?: number;
  minGpaTotal?: number;
}

function Explore() {
  const location = useLocation();
  const navigate = useNavigate();
  const { entity } = useParams<{ entity?: string }>();

  const [entityType, setEntityType] = useState('course');
  const [params, setParams] = useState<ExploreParams>({
    page: 1,
  });

  useEffect(() => {
    document.title = 'Explore UW Madison Courses - Madgrades';
  }, []);

  useEffect(() => {
    const queryParams = parse(location.search.substr(1));
    const newEntityType = entity || 'course';
    const minAvg = newEntityType === 'subject' ? 1 : 25;
    const minTotal = newEntityType === 'course' ? 1500 : 500;

    const pageParam = queryParams.page;
    const filteredParams: ExploreParams = {
      page: parseInt(typeof pageParam === 'string' ? pageParam : '1', 10),
      sort: typeof queryParams.sort === 'string' ? queryParams.sort : undefined,
      order: typeof queryParams.order === 'string' ? queryParams.order : undefined,
      subjects: Array.isArray(queryParams.subjects) ? queryParams.subjects as string[] : undefined,
      instructors:
        Array.isArray(queryParams.instructors) 
          ? (queryParams.instructors as string[]).map((s: string) => parseInt(s, 10))
          : undefined,
    };

    if (!queryParams.instructors) {
      filteredParams.minCountAvg = minAvg;
      filteredParams.minGpaTotal = minTotal;
    }

    if (!_.isEqual(filteredParams, params) || newEntityType !== entityType) {
      setParams(filteredParams);
      setEntityType(newEntityType);
    }
  }, [location, entity]);

  const onEntityChange = (event: any, data: any) => {
    navigate('/explore/' + data.value);
  };

  const updateParams = (newParams: ExploreParams) => {
    const { pathname } = location;
    setParams(newParams);
    navigate(pathname + '?' + stringify(newParams));
  };

  const onPageChange = (page: number) => {
    const newParams = {
      ...params,
      page,
    };
    updateParams(newParams);
  };

  const onSortOrderChange = (sort: string, order: string) => {
    const newParams = {
      ...params,
      sort,
      order,
      page: 1,
    };
    updateParams(newParams);
  };

  const onSubjectChange = (value: any) => {
    const newParams = {
      ...params,
      subjects: value,
    };
    updateParams(newParams);
  };

  const onInstructorChange = (value: any) => {
    const newParams = {
      ...params,
      instructors: value,
    };
    updateParams(newParams);
  };

  const { page, sort, order, minCountAvg, minGpaTotal, subjects, instructors } = params;

  const filterParams: any = {};

  if (entityType !== 'subject' && subjects) {
    filterParams.subjects = subjects.join(',');
  }

  if (entityType !== 'subject' && instructors) {
    filterParams.instructors = instructors.join(',');
  }

  return (
    <div className="Explore">
      <Container>
        <Header as="h1">
          <Header.Content>
            Explore:{' '}
            <Dropdown inline options={entityOptions} onChange={onEntityChange} value={entityType} />
          </Header.Content>
          <Header.Subheader>Find GPA stats on courses, instructors, subjects.*</Header.Subheader>
        </Header>

        <Row>
          {entityType !== 'subject' && (
            <Col xs={12} md={6}>
              <p />
              <Form>
                <Form.Field>
                  <label>Filter subjects</label>
                  <EntitySelect entityType="subject" value={subjects} onChange={onSubjectChange} />
                </Form.Field>
              </Form>
            </Col>
          )}

          {entityType !== 'subject' && (
            <Col xs={12} md={6}>
              <p />
              <Form>
                <Form.Field>
                  <label>Filter instructors</label>
                  <EntitySelect
                    entityType="instructor"
                    value={instructors}
                    onChange={onInstructorChange}
                  />
                </Form.Field>
              </Form>
            </Col>
          )}
        </Row>

        <Explorer
          entityType={entityType as any}
          page={page}
          sort={sort}
          order={order}
          minCountAvg={minCountAvg}
          minGpaTotal={minGpaTotal}
          onPageChange={onPageChange}
          onSortOrderChange={onSortOrderChange}
          filterParams={filterParams}
        />
        <p>* Some entries are omitted due to small class sizes.</p>
      </Container>
    </div>
  );
}

export default Explore;
