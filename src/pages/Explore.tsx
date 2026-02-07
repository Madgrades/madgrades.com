import React, { Component } from "react";
import { Container, Dropdown, Header, Form, DropdownProps } from "semantic-ui-react";
import { Row, Col } from "../components/Grid";
import Explorer from "../components/Explorer";
import EntitySelect from "../components/EntitySelect";
import { parse, stringify } from "qs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import _ from "lodash";

interface EntityOption {
  key: string;
  text: string;
  value: string;
}

const entityOptions: EntityOption[] = [
  {
    key: "course",
    text: "Courses",
    value: "course",
  },
  {
    key: "instructor",
    text: "Instructors",
    value: "instructor",
  },
  {
    key: "subject",
    text: "Subjects",
    value: "subject",
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

interface ExploreProps {
  location: { pathname: string; search: string };
  navigate: (path: string) => void;
  match: { params: { entity?: string } };
}

interface ExploreState {
  params: ExploreParams;
  entityType: string;
}

class Explore extends Component<ExploreProps, ExploreState> {
  constructor(props: ExploreProps) {
    super(props);

    const { location, match } = this.props;
    const { entity } = match.params;
    const params = parse(location.search.substr(1));

    const entityType = entity || "course";
    const minAvg = entityType === "subject" ? 1 : 25;
    const minTotal = entityType === "course" ? 1500 : 500;

    const filteredParams: ExploreParams = {
      page: parseInt((params.page as string) || "1", 10),
      sort: params.sort as string,
      order: params.order as string,
      subjects: params.subjects as string[],
      instructors:
        params.instructors && (params.instructors as string[]).map((s: string) => parseInt(s, 10)),
    };

    if (!params.instructors) {
      filteredParams.minCountAvg = minAvg;
      filteredParams.minGpaTotal = minTotal;
    }

    this.state = {
      params: filteredParams,
      entityType: entityType,
    };
  }

  setStateFromQueryString = (forcedQueryParams?: Record<string, string | string[]>): void => {
    const { location, match } = this.props;
    const { entity } = match.params;
    const params = forcedQueryParams || parse(location.search.substr(1));

    const entityType = entity || "course";
    const minAvg = entityType === "subject" ? 1 : 25;
    const minTotal = entityType === "course" ? 1500 : 500;

    const filteredParams: ExploreParams = {
      page: parseInt((params.page as string) || "1", 10),
      sort: params.sort as string,
      order: params.order as string,
      subjects: params.subjects as string[],
      instructors:
        params.instructors && (params.instructors as string[]).map((s: string) => parseInt(s, 10)),
    };

    if (!params.instructors) {
      filteredParams.minCountAvg = minAvg;
      filteredParams.minGpaTotal = minTotal;
    }

    if (
      _.isEqual(filteredParams, this.state.params) &&
      entityType === this.state.entityType
    )
      return;

    this.setState({
      params: filteredParams,
      entityType,
    });
  };

  componentDidMount = (): void => {
    document.title = "Explore UW Madison Courses - Madgrades";
  };

  componentDidUpdate = (prevProps: ExploreProps): void => {
    if (
      prevProps.location !== this.props.location ||
      prevProps.match !== this.props.match
    ) {
      this.setStateFromQueryString();
    }
  };

  onEntityChange = (_event: React.SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
    const { navigate } = this.props;

    navigate("/explore/" + data.value);

    this.setStateFromQueryString({});
  };

  updateParams = (params: ExploreParams): void => {
    const { navigate } = this.props;
    const { pathname } = this.props.location;

    this.setState({
      params,
    });

    navigate(pathname + "?" + stringify(params));
  };

  onPageChange = (page: number): void => {
    const params = {
      ...this.state.params,
      page,
    };

    this.updateParams(params);
  };

  onSortOrderChange = (sort: string, order: string): void => {
    const params = {
      ...this.state.params,
      sort,
      order,
      page: 1,
    };

    this.updateParams(params);
  };

  onSubjectChange = (value: string[]): void => {
    const params = {
      ...this.state.params,
      subjects: value,
    };

    this.updateParams(params);
  };

  onInstructorChange = (value: number[]): void => {
    const params = {
      ...this.state.params,
      instructors: value,
    };

    this.updateParams(params);
  };

  render = (): JSX.Element => {
    const {
      page,
      sort,
      order,
      minCountAvg,
      minGpaTotal,
      subjects,
      instructors,
    } = this.state.params;

    const { entityType } = this.state;

    const filterParams: Record<string, string> = {};

    if (entityType !== "subject" && subjects) {
      filterParams.subjects = subjects.join(",");
    }

    if (entityType !== "subject" && instructors) {
      filterParams.instructors = instructors.join(",");
    }

    return (
      <div className="Explore">
        <Container>
          <Header as="h1">
            <Header.Content>
              Explore:{" "}
              <Dropdown
                inline
                options={entityOptions}
                onChange={this.onEntityChange}
                value={entityType}
              />
            </Header.Content>
            <Header.Subheader>
              Find GPA stats on courses, instructors, subjects.*
            </Header.Subheader>
          </Header>

          <Row>
            {entityType !== "subject" && (
              <Col xs={12} md={6}>
                <p />
                <Form>
                  <Form.Field>
                    <label>Filter subjects</label>
                    <EntitySelect
                      entityType="subject"
                      value={subjects}
                      onChange={this.onSubjectChange}
                    />
                  </Form.Field>
                </Form>
              </Col>
            )}

            {entityType !== "subject" && (
              <Col xs={12} md={6}>
                <p />
                <Form>
                  <Form.Field>
                    <label>Filter instructors</label>
                    <EntitySelect
                      entityType="instructor"
                      value={instructors}
                      onChange={this.onInstructorChange}
                    />
                  </Form.Field>
                </Form>
              </Col>
            )}
          </Row>

          <Explorer
            entityType={entityType}
            page={page}
            sort={sort}
            order={order}
            minCountAvg={minCountAvg}
            minGpaTotal={minGpaTotal}
            onPageChange={this.onPageChange}
            onSortOrderChange={this.onSortOrderChange}
            filterParams={filterParams}
          />
          <p>* Some entries are omitted due to small class sizes.</p>
        </Container>
      </div>
    );
  };
}

function withRouter(Component: React.ComponentType<ExploreProps>) {
  return function ComponentWithRouter(props: Record<string, never>) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return (
      <Component
        {...props}
        location={location}
        navigate={navigate}
        match={{ params }}
      />
    );
  };
}

export default withRouter(Explore);
