import { useState, useEffect } from 'react';
import { Container, Dropdown, Header, Form } from 'semantic-ui-react';
import { Row, Col } from '../components/Grid';
import Explorer from '../components/Explorer';
import EntitySelect from '../components/EntitySelect';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import utils from '../utils';
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
    const queryParams = new URLSearchParams(location.search);
    const newEntityType = entity ?? 'course';
    const minAvg = newEntityType === 'subject' ? 1 : 25;
    const minTotal = newEntityType === 'course' ? 1500 : 500;

    const subjectsParam = queryParams.getAll('subjects');
    const instructorsParam = queryParams.getAll('instructors');

    const filteredParams: ExploreParams = {
      page: parseInt(queryParams.get('page') ?? '1', 10),
      sort: queryParams.get('sort') ?? undefined,
      order: queryParams.get('order') ?? undefined,
      subjects: subjectsParam.length > 0 ? subjectsParam : undefined,
      instructors:
        instructorsParam.length > 0 ? instructorsParam.map(s => parseInt(s, 10)) : undefined,
    };

    // Only apply minimums if no filters are active
    if (subjectsParam.length === 0 && instructorsParam.length === 0) {
      filteredParams.minCountAvg = minAvg;
      filteredParams.minGpaTotal = minTotal;
    }

    if (!_.isEqual(filteredParams, params) || newEntityType !== entityType) {
      setParams(filteredParams);
      setEntityType(newEntityType);
    }
  }, [location, entity, entityType, params]);

  const onEntityChange = (_event: React.SyntheticEvent, data: { value: string }) => {
    navigate(`/explore/${data.value}`);
  };

  const updateParams = (newParams: ExploreParams) => {
    const { pathname } = location;
    setParams(newParams);
    navigate(`${pathname}?${utils.buildQueryString(newParams)}`);
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

  const onSubjectChange = (value: string[] | number[]) => {
    const newParams = {
      ...params,
      subjects: value as string[],
    };
    updateParams(newParams);
  };

  const onInstructorChange = (value: string[] | number[]) => {
    const newParams = {
      ...params,
      instructors: value as number[],
    };
    updateParams(newParams);
  };

  const { page, sort, order, minCountAvg, minGpaTotal, subjects, instructors } = params;

  const filterParams: Partial<ExploreParams> = {};

  if (entityType !== 'subject' && subjects) {
    filterParams.subjects = subjects;
  }

  if (entityType !== 'subject' && instructors) {
    filterParams.instructors = instructors;
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
          entityType={entityType as 'course' | 'instructor' | 'subject'}
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
