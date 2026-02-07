import React, { useEffect } from "react";
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
} from "../types/api";

export type EntityType = "instructor" | "course" | "subject";
type ExploreEntry = ExploreCourseEntry | ExploreInstructorEntry | ExploreSubjectEntry;

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

const Explorer: React.FC<ExplorerProps> = ({
  entityType,
  sort = "gpa_total",
  order = "desc",
  onSortOrderChange = (_sort: string, _order: string): void => {},
  onPageChange = (_page: number): void => {},
  page = 1,
  minCountAvg = 0,
  minGpaTotal = 0,
  filterParams = {},
}) => {
  const dispatch = useAppDispatch();
  
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
      case "course":
        dispatch(fetchExploreCourses(params));
        break;
      case "instructor":
        dispatch(fetchExploreInstructors(params));
        break;
      case "subject":
        dispatch(fetchExploreSubjects(params));
        break;
    }
  }, [dispatch, entityType, page, sort, order, minCountAvg, minGpaTotal, filterParams]);

  const handlePageChange = (_event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
    const { activePage } = data;
    onPageChange(activePage as number);
  };

  const handleSortChange = (newSort: string) => (): void => {
    let newOrder: string;

    if (sort !== newSort) {
      newOrder = "asc";
    } else {
      newOrder = order === "asc" ? "desc" : "asc";
    }

    onSortOrderChange(newSort, newOrder);
  };

  const entryKey = (entry: ExploreEntry): string | number => {
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

  const renderEntryName = (entry: ExploreEntry) => {
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
        return undefined;
    }
  };

  const renderEntries = (results: ExploreEntry[]) => {
    if (!results) return null;

    return results.map((entry) => {
      return (
        <Table.Row key={entryKey(entry)}>
          <Table.Cell>{renderEntryName(entry)}</Table.Cell>
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

  const entityName = _.upperFirst(entityType) + "s";
  const orderFull = order === "asc" ? "ascending" : "descending";

  const activePage = page;
  let totalPages = 1;
  let results: ExploreEntry[] | undefined;
  let entries: React.ReactNode[] = [
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
    entries = renderEntries(results) || [];
  }

  return (
    <Table celled sortable fixed>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{entityName}</Table.HeaderCell>
          <Table.HeaderCell
            onClick={handleSortChange("count_avg")}
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
            onClick={handleSortChange("gpa_total")}
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
            onClick={handleSortChange("gpa")}
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
};

export default Explorer;
