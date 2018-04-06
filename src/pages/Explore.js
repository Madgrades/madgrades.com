import React, {Component} from "react";
import {Container, Dropdown, Header} from "semantic-ui-react";
import Explorer from "../components/Explorer";
import {parse, stringify} from "qs";
import {withRouter} from "react-router";
import _ from "lodash";

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

class Explore extends Component {
  state = {
    params: {

    },
    entityType: undefined
  };

  setStateFromQueryString = (forcedQueryParams) => {
    const { location } = this.props;
    const { entity } = this.props.match.params;
    const params = forcedQueryParams || parse(location.search.substr(1));

    const entityType = entity || 'course';
    let minAvg = entityType === 'subject' ? 1 : 25;
    let minTotal = entityType === 'course' ? 1500 : 500;

    let filteredParams = {
      page: parseInt(params.page || 1, 10),
      sort: params.sort,
      order: params.order,
      minCountAvg: minAvg,
      minGpaTotal: minTotal,
    };

    // if we dont have new data, ignore state update
    if (_.isEqual(filteredParams, this.state.params) && entityType === this.state.entityType)
      return;

    this.setState({
      params: filteredParams,
      entityType
    });
  };

  componentWillMount = this.setStateFromQueryString;

  componentDidMount = () => {
    document.title = "Explore UW Madison Courses - Madgrades"
  };

  componentDidUpdate = () => this.setStateFromQueryString();

  onEntityChange = (event, data) => {
    const { history } = this.props;

    // go to the entity page
    history.push('/explore/' + data.value);

    // on entity change, update params to nothing
    this.setStateFromQueryString({});
  };

  onPageChange = (page) => {
    const { history } = this.props;
    const { pathname } = this.props.location;

    let params = {
      ...this.state.params,
      page
    };

    this.setState({
      params
    });

    history.push(pathname + '?' + stringify(params));
  };

  onSortOrderChange = (sort, order) => {
    const { history } = this.props;
    const { pathname } = this.props.location;

    let params = {
      ...this.state.params,
      sort,
      order,
      page: 1
    };

    this.setState({
      params
    });

    history.push(pathname + '?' + stringify(params));
  };

  render = () => {
    const { page, sort, order, minCountAvg, minGpaTotal } = this.state.params;

    const { entityType } = this.state;

    return (
        <div className="Explore">
          <Container>
            <Header as='h1'>
              <Header.Content>
                Explore: {' '}
                <Dropdown
                    inline
                    options={entityOptions}
                    onChange={this.onEntityChange}
                    value={entityType}/>
              </Header.Content>
              <Header.Subheader>
                Find GPA stats on courses, instructors, subjects.*
              </Header.Subheader>
            </Header>
            <Explorer
                entityType={entityType}
                page={page}
                sort={sort}
                order={order}
                minCountAvg={minCountAvg}
                minGpaTotal={minGpaTotal}
                onPageChange={this.onPageChange}
                onSortOrderChange={this.onSortOrderChange}
            />
            <p>
              * Some entries are omitted due to small class sizes.
            </p>
          </Container>

        </div>
    )
  }
}
export default withRouter(Explore);