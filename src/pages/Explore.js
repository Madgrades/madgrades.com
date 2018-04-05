import React, {Component} from "react";
import {Container, Dropdown, Header} from "semantic-ui-react";
import Explorer from "../components/Explorer";
import {parse, stringify} from "qs";

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

  setStateFromParams = (forcedParams) => {
    const { location } = this.props;
    const { entity } = this.props.match.params;
    const params = forcedParams || parse(location.search.substr(1));

    let filteredParams = {
      page: parseInt(params.page || 1),
      sort: params.sort,
      order: params.order,
      minCountAvg: parseInt(params.min_count_avg || 1),
      minGpaTotal: parseInt(params.min_gpa_total || 500)
    };

    this.setState({
      params: filteredParams,
      entityType: entity || 'course'
    });
  };

  componentWillMount = this.setStateFromParams;

  componentDidUpdate = () => {
    let { entity } = this.props.match.params;

    if (!entity)
      entity = 'course';

    if (this.state.entityType === entity)
      return;

    this.setState({
      entityType: entity
    })
  };

  onEntityChange = (event, data) => {
    const { history } = this.props;
    history.push('/explore/' + data.value);
    this.setStateFromParams({});
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
export default Explore;