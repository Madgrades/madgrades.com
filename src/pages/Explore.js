import React, { Component } from "react";
import { Container, Dropdown, Grid, Header, Form } from "semantic-ui-react";
import { Row, Col } from "../components/Grid";
import Explorer from "../components/Explorer";
import EntitySelect from "../components/EntitySelect";
import { parse, stringify } from "qs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import _ from "lodash";

const entityOptions = [
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

class Explore extends Component {
  constructor(props) {
    super(props);

    // Initialize state with values from URL
    const { location, match } = this.props;
    const { entity } = match.params;
    const params = parse(location.search.substr(1));

    const entityType = entity || "course";
    let minAvg = entityType === "subject" ? 1 : 25;
    let minTotal = entityType === "course" ? 1500 : 500;

    let filteredParams = {
      page: parseInt(params.page || 1, 10),
      sort: params.sort,
      order: params.order,
      subjects: params.subjects,
      instructors:
        params.instructors && params.instructors.map((s) => parseInt(s, 10)),
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

  setStateFromQueryString = (forcedQueryParams) => {
    const { location, match } = this.props;
    const { entity } = match.params;
    const params = forcedQueryParams || parse(location.search.substr(1));

    const entityType = entity || "course";
    let minAvg = entityType === "subject" ? 1 : 25;
    let minTotal = entityType === "course" ? 1500 : 500;

    let filteredParams = {
      page: parseInt(params.page || 1, 10),
      sort: params.sort,
      order: params.order,
      subjects: params.subjects,
      instructors:
        params.instructors && params.instructors.map((s) => parseInt(s, 10)),
    };

    if (!params.instructors) {
      filteredParams.minCountAvg = minAvg;
      filteredParams.minGpaTotal = minTotal;
    }

    // if we dont have new data, ignore state update
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

  componentDidMount = () => {
    document.title = "Explore UW Madison Courses - Madgrades";
  };

  componentDidUpdate = (prevProps) => {
    if (
      prevProps.location !== this.props.location ||
      prevProps.match !== this.props.match
    ) {
      this.setStateFromQueryString();
    }
  };

  onEntityChange = (event, data) => {
    const { navigate } = this.props;

    // go to the entity page
    navigate("/explore/" + data.value);

    // on entity change, update params to nothing
    this.setStateFromQueryString({});
  };

  updateParams = (params) => {
    const { navigate } = this.props;
    const { pathname } = this.props.location;

    this.setState({
      params,
    });

    navigate(pathname + "?" + stringify(params));
  };

  onPageChange = (page) => {
    const params = {
      ...this.state.params,
      page,
    };

    this.updateParams(params);
  };

  onSortOrderChange = (sort, order) => {
    const params = {
      ...this.state.params,
      sort,
      order,
      page: 1,
    };

    this.updateParams(params);
  };

  onSubjectChange = (value) => {
    const params = {
      ...this.state.params,
      subjects: value,
    };

    this.updateParams(params);
  };

  onInstructorChange = (value) => {
    const params = {
      ...this.state.params,
      instructors: value,
    };

    this.updateParams(params);
  };

  render = () => {
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

    const filterParams = {};

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

// HOC to inject router hooks as props
function withRouter(Component) {
  return function ComponentWithRouter(props) {
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
