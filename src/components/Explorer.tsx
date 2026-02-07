import React, { Component } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  Dimmer,
  Header,
  Icon,
  Loader,
  Pagination,
  PaginationProps,
  Popup,
  Table,
} from "semantic-ui-react";
import _ from "lodash";
import CourseName from "./CourseName";
import { Link } from "react-router-dom";
import { stringify } from "qs";
import { Row, Col } from "../components/Grid";
import utils from "../utils";
import {
  fetchExploreCourses,
  fetchExploreInstructors,
  fetchExploreSubjects,
} from "../store/slices/exploreSlice";
import {
  ExploreCourseEntry,
  ExploreInstructorEntry,
  ExploreSubjectEntry,
  ExploreCoursesResponse,
  ExploreInstructorsResponse,
  ExploreSubjectsResponse,
} from "../types/api";

type EntityType = "instructor" | "course" | "subject";
type ExploreEntry = ExploreCourseEntry | ExploreInstructorEntry | ExploreSubjectEntry;
type ExploreResponse = ExploreCoursesResponse | ExploreInstructorsResponse | ExploreSubjectsResponse;

interface ExplorerProps {
  entityType: EntityType;
  sort?: string;
  order?: string;
  onSortOrderChange?: (sort: string, order: string) => void;
  onPageChange?: (page: number) => void;
  page?: number;
  minCountAvg?: number;
  minGpaTotal?: number;
  filterParams?: Record<string, string>;
}

interface ExplorerClassProps extends ExplorerProps {
  data?: {
    isFetching: boolean;
    data?: ExploreResponse;
  };
  dispatch: ReturnType<typeof useAppDispatch>;
}

class ExplorerClass extends Component<ExplorerClassProps> {
  static defaultProps = {
    sort: "gpa_total",
    order: "desc",
    onSortOrderChange: (_sort: string, _order: string): void => {},
    onPageChange: (_page: number): void => {},
    page: 1,
    minCountAvg: 0,
    minGpaTotal: 0,
    filterParams: {},
  };

  componentDidMount = (): void => {
    this.fetchData();
  };

  componentDidUpdate = (prevProps: ExplorerClassProps): void => {
    const {
      entityType,
      page,
      sort,
      order,
      minCountAvg,
      minGpaTotal,
      filterParams,
    } = this.props;
    const propsChanged =
      prevProps.entityType !== entityType ||
      prevProps.page !== page ||
      prevProps.sort !== sort ||
      prevProps.order !== order ||
      prevProps.minCountAvg !== minCountAvg ||
      prevProps.minGpaTotal !== minGpaTotal ||
      !_.isEqual(prevProps.filterParams, filterParams);

    if (propsChanged) {
      this.fetchData();
    }
  };

  fetchData = (): void => {
    const {
      entityType,
      dispatch,
      page,
      sort,
      order,
      minCountAvg,
      minGpaTotal,
      filterParams,
    } = this.props;

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
      case "course":
        dispatch(fetchExploreCourses(params));
        break;
      case "instructor":
        dispatch(fetchExploreInstructors(params));
        break;
      case "subject":
        dispatch(fetchExploreSubjects(params));
        break;
      default:
        break;
    }
  };

  onPageChange = (_event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
    const { activePage } = data;
    this.props.onPageChange!(activePage as number);
  };

  onSortChange = (newSort: string) => (): void => {
    const { sort, order, onSortOrderChange } = this.props;

    let newOrder: string;

    if (sort !== newSort) {
      newOrder = "asc";
    } else {
      newOrder = order === "asc" ? "desc" : "asc";
    }

    onSortOrderChange!(newSort, newOrder);
  };

  entryKey = (entry: ExploreEntry): string | number => {
    const { entityType } = this.props;

    switch (entityType) {
      case "course":
        return (entry as ExploreCourseEntry).course.uuid;
      case "instructor":
        return (entry as ExploreInstructorEntry).instructor.id;
      case "subject":
        return (entry as ExploreSubjectEntry).subject.code;
      default:
        return '';
    }
  };

  renderEntryName = (entry: ExploreEntry): JSX.Element | undefined => {
    const { entityType } = this.props;
    let link: string;

    switch (entityType) {
      case "course":
        const { course } = entry as ExploreCourseEntry;
        return (
          <Header as="h4">
            <Header.Content>
              <Link to={`/courses/${course.uuid}`}>
                <CourseName uuid={course.uuid} data={course} />
              </Link>
            </Header.Content>
            <Header.Subheader>
              <CourseName
                asSubjectAndNumber={true}
                uuid={course.uuid}
                data={course}
              />
            </Header.Subheader>
          </Header>
        );
      case "instructor":
        const { instructor } = entry as ExploreInstructorEntry;
        link = "/search?" + stringify({ instructors: [instructor.id] });
        return (
          <Header as="h4">
            <Header.Content>
              <Link to={link}>{instructor.name}</Link>
            </Header.Content>
          </Header>
        );
      case "subject":
        const { subject } = entry as ExploreSubjectEntry;
        link = "/search?" + stringify({ subjects: [subject.code] });
        return (
          <Header as="h4">
            <Header.Content>
              <Link to={link}>{subject.name}</Link>
            </Header.Content>
          </Header>
        );
      default:
        break;
    }
  };

  renderEntries = (results: ExploreEntry[]): JSX.Element[] | null => {
    if (!results) return null;

    return results.map((entry) => {
      return (
        <Table.Row key={this.entryKey(entry)}>
          <Table.Cell>{this.renderEntryName(entry)}</Table.Cell>
          <Table.Cell>
            <strong className="mobile only">Avg. # Grades: </strong>
            {utils.numberWithCommas(parseFloat(entry.countAvg.toFixed(1)))}
          </Table.Cell>
          <Table.Cell>
            <strong className="mobile only">Total # Grades: </strong>
            {utils.numberWithCommas(entry.gpaTotal)}
          </Table.Cell>
          <Table.Cell>
            <strong className="mobile only">Avg. GPA: </strong>
            {entry.gpa.toFixed(3)}
          </Table.Cell>
        </Table.Row>
      );
    });
  };

  render = (): JSX.Element => {
    const { data, entityType, sort, order, page } = this.props;
    const entityName = _.upperFirst(entityType) + "s";

    const orderFull = order === "asc" ? "ascending" : "descending";

    const activePage = page!;
    let totalPages = 1;
    let results: ExploreEntry[] | undefined;
    let entries: JSX.Element[] = [
      <Table.Row key={1}>
        <Dimmer.Dimmable
          as={Table.Cell}
          colSpan={4}
          style={{ height: "100px" }}
        >
          <Dimmer active={true} inverted>
            <Loader active={true} inverted />
          </Dimmer>
        </Dimmer.Dimmable>
      </Table.Row>,
    ];

    if (data?.data && !data.isFetching) {
      totalPages = data.data.totalPages;
      results = data.data.results as ExploreEntry[];
      entries = this.renderEntries(results) || [];
    }

    return (
      <Table celled sortable fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{entityName}</Table.HeaderCell>
            <Table.HeaderCell
              onClick={this.onSortChange("count_avg")}
              sorted={sort === "count_avg" ? orderFull as "ascending" | "descending" : undefined}
            >
              Avg. # Grades{" "}
              <Popup trigger={<Icon color="grey" name="question circle" />}>
                <Popup.Content>
                  The average number of students per grade distribution entry.
                  This is often equivalent to the average number of students per
                  course section.
                </Popup.Content>
              </Popup>
            </Table.HeaderCell>
            <Table.HeaderCell
              onClick={this.onSortChange("gpa_total")}
              sorted={sort === "gpa_total" ? orderFull as "ascending" | "descending" : undefined}
            >
              Total # Grades{" "}
              <Popup trigger={<Icon color="grey" name="question circle" />}>
                <Popup.Content>
                  The total number of students with grades reported.
                </Popup.Content>
              </Popup>
            </Table.HeaderCell>
            <Table.HeaderCell
              onClick={this.onSortChange("gpa")}
              sorted={sort === "gpa" ? orderFull as "ascending" | "descending" : undefined}
            >
              Avg. GPA{" "}
              <Popup trigger={<Icon color="grey" name="question circle" />}>
                <Popup.Content>
                  The average GPA given to students.
                </Popup.Content>
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
                    onPageChange={this.onPageChange}
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
  };
}

const Explorer: React.FC<ExplorerProps> = (props) => {
  const dispatch = useAppDispatch();
  const { entityType } = props;

  const coursesData = useAppSelector(state => state.explore.courses);
  const instructorsData = useAppSelector(state => state.explore.instructors);
  const subjectsData = useAppSelector(state => state.explore.subjects);

  let data;
  switch (entityType) {
    case "instructor":
      data = instructorsData;
      break;
    case "course":
      data = coursesData;
      break;
    case "subject":
      data = subjectsData;
      break;
    default:
      data = coursesData;
      break;
  }

  return <ExplorerClass {...props} data={data} dispatch={dispatch} />;
};

export default Explorer;
