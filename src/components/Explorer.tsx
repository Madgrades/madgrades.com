import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { RootState, ExploreParams, CourseExploreEntry, InstructorExploreEntry, SubjectExploreEntry, PaginationData } from '../types';
import { Dimmer, Header, Icon, Loader, Pagination, Popup, Table } from 'semantic-ui-react';
import _ from 'lodash';
import CourseName from './CourseName';
import { Link } from 'react-router-dom';
import { stringify } from 'qs';
import { Row, Col } from '../components/Grid';

type EntityType = 'instructor' | 'course' | 'subject';
type ExploreEntry = CourseExploreEntry | InstructorExploreEntry | SubjectExploreEntry;

interface OwnProps {
  entityType: EntityType;
  sort?: string;
  order?: string;
  onSortOrderChange?: (sort: string, order: string) => void;
  onPageChange?: (page: number) => void;
  page?: number;
  minCountAvg?: number;
  minGpaTotal?: number;
  filterParams?: Partial<ExploreParams>;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

function Explorer({
  entityType,
  sort = 'gpa_total',
  order = 'desc',
  onSortOrderChange = () => {},
  onPageChange = () => {},
  page = 1,
  minCountAvg = 0,
  minGpaTotal = 0,
  filterParams = {},
  data,
  actions,
}: Props) {
  useEffect(() => {
    const params = {
      page,
      sort,
      order,
      min_count_avg: minCountAvg,
      min_gpa_total: minGpaTotal,
      per_page: 15,
      ...filterParams,
    };

    switch (entityType) {
      case 'course':
        actions.fetchExploreCourses(params);
        break;
      case 'instructor':
        actions.fetchExploreInstructors(params);
        break;
      case 'subject':
        actions.fetchExploreSubjects(params);
        break;
      default:
        break;
    }
  }, [entityType, page, sort, order, minCountAvg, minGpaTotal, filterParams, actions]);

  const handlePageChange = (_event: React.MouseEvent, data: PaginationData) => {
    const { activePage } = data;
    onPageChange(activePage);
  };

  const handleSortChange = (newSort: string) => () => {
    let newOrder;

    if (sort !== newSort) {
      newOrder = 'asc';
    } else {
      newOrder = order === 'asc' ? 'desc' : 'asc';
    }

    onSortOrderChange(newSort, newOrder);
  };

  const entryKey = (entry: ExploreEntry): string | number | null => {
    if ('course' in entry) {
      return entry.course.uuid;
    } else if ('instructor' in entry) {
      return entry.instructor.id;
    } else if ('subject' in entry) {
      return entry.subject.code;
    }
    return null;
  };

  const renderEntryName = (entry: ExploreEntry) => {
    let link;

    if ('course' in entry) {
      const { course } = entry;
      return (
        <Header as="h4">
          <Header.Content>
            <Link to={`/courses/${course.uuid}`}>
              <CourseName uuid={course.uuid} data={course} />
            </Link>
          </Header.Content>
          <Header.Subheader>
            <CourseName asSubjectAndNumber={true} uuid={course.uuid} data={course} />
          </Header.Subheader>
        </Header>
      );
    } else if ('instructor' in entry) {
      const { instructor } = entry;
      link = '/search?' + stringify({ instructors: [instructor.id] });
      return (
        <Header as="h4">
          <Header.Content>
            <Link to={link}>{instructor.name}</Link>
          </Header.Content>
        </Header>
      );
    } else if ('subject' in entry) {
      const { subject } = entry;
      link = '/search?' + stringify({ subjects: [subject.code] });
      return (
        <Header as="h4">
          <Header.Content>
            <Link to={link}>{subject.name}</Link>
          </Header.Content>
        </Header>
      );
    }
    return null;
  };

  const renderEntries = (results: ExploreEntry[]) => {
    if (!results) return null;

    return results.map((entry) => {
      return (
        <Table.Row key={entryKey(entry)}>
          <Table.Cell>{renderEntryName(entry)}</Table.Cell>
          <Table.Cell>
            <strong className="mobile only">Avg. # Grades: </strong>
            {entry.count_average != null 
              ? utils.numberWithCommas(parseFloat(entry.count_average.toFixed(1)))
              : 'N/A'}
          </Table.Cell>
          <Table.Cell>
            <strong className="mobile only">Total # Grades: </strong>
            {entry.count_total != null ? utils.numberWithCommas(entry.count_total) : 'N/A'}
          </Table.Cell>
          <Table.Cell>
            <strong className="mobile only">Avg. GPA: </strong>
            {entry.gpa_average != null ? entry.gpa_average.toFixed(3) : 'N/A'}
          </Table.Cell>
        </Table.Row>
      );
    });
  };

  const entityName = _.upperFirst(entityType) + 's';
  const orderFull = order === 'asc' ? 'ascending' : 'descending';

  const activePage = page;
  let totalPages = 1;
  let results;
  let entries: any = [
    <Table.Row key={1}>
      <Dimmer.Dimmable as={Table.Cell} colSpan={4} style={{ height: '100px' }}>
        <Dimmer active={true} inverted>
          <Loader active={true} inverted />
        </Dimmer>
      </Dimmer.Dimmable>
    </Table.Row>,
  ];

  if (data && !data.isFetching) {
    totalPages = data.totalPages;
    results = data.results;
    entries = renderEntries(results);
  }

  return (
    <Table celled sortable fixed>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{entityName}</Table.HeaderCell>
          <Table.HeaderCell
            onClick={handleSortChange('count_avg')}
            sorted={sort === 'count_avg' ? orderFull : undefined}
          >
            Avg. # Grades{' '}
            <Popup trigger={<Icon color="grey" name="question circle" />}>
              <Popup.Content>
                The average number of students per grade distribution entry. This is often
                equivalent to the average number of students per course section.
              </Popup.Content>
            </Popup>
          </Table.HeaderCell>
          <Table.HeaderCell
            onClick={handleSortChange('gpa_total')}
            sorted={sort === 'gpa_total' ? orderFull : undefined}
          >
            Total # Grades{' '}
            <Popup trigger={<Icon color="grey" name="question circle" />}>
              <Popup.Content>The total number of students with grades reported.</Popup.Content>
            </Popup>
          </Table.HeaderCell>
          <Table.HeaderCell
            onClick={handleSortChange('gpa')}
            sorted={sort === 'gpa' ? orderFull : undefined}
          >
            Avg. GPA{' '}
            <Popup trigger={<Icon color="grey" name="question circle" />}>
              <Popup.Content>The average GPA given to students.</Popup.Content>
            </Popup>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>{entries}</Table.Body>

      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan={4}>
            <Row center>
              <Col xs={12}>
                <Pagination
                  onPageChange={handlePageChange}
                  activePage={activePage}
                  ellipsisItem={{
                    content: <Icon name="ellipsis horizontal" />,
                    icon: true,
                  }}
                  firstItem={null}
                  lastItem={null}
                  prevItem={{
                    content: <Icon name="angle left" />,
                    icon: true,
                  }}
                  nextItem={{
                    content: <Icon name="angle right" />,
                    icon: true,
                  }}
                  totalPages={totalPages}
                  size="mini"
                  siblingRange={1}
                />
              </Col>
            </Row>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
}

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  const { entityType } = ownProps;

  let data;

  switch (entityType) {
    case 'instructor':
      data = state.explore.instructors.data;
      break;
    case 'course':
      data = state.explore.courses.data;
      break;
    case 'subject':
      data = state.explore.subjects.data;
      break;
    default:
      break;
  }

  return {
    data,
  };
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
export default connector(Explorer);
