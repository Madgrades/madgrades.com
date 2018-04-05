import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import PropTypes from "prop-types"
import {Header, Icon, Pagination, Table} from "semantic-ui-react";
import _ from "lodash";
import CourseName from "./CourseName";
import {Link} from "react-router-dom";
import {stringify} from "qs";

class Explorer extends Component {
  static propTypes = {
    entityType: PropTypes.oneOf(['instructor', 'course', 'subject']).isRequired,
    sort: PropTypes.oneOf(['gpa_total', 'count_avg', 'gpa']),
    order: PropTypes.oneOf(['asc', 'desc']),
    onSortOrderChange: PropTypes.func,
    onPageChange: PropTypes.func,
    page: PropTypes.number,
    minCountAvg: PropTypes.number,
    minGpaTotal: PropTypes.number
  };

  static defaultProps = {
    sort: 'gpa_total',
    order: 'desc',
    onSortOrderChange: (sort, order) => {},
    onPageChange: (page) => {},
    page: 1,
    minCountAvg: 0,
    minGpaTotal: 0
  };

  componentWillMount = () => {
    const { entityType, actions, page, sort, order, minCountAvg, minGpaTotal } = this.props;

    const params = {
      page,
      sort,
      order,
      min_count_avg: minCountAvg,
      min_gpa_total: minGpaTotal,
      per_page: 15
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
    }
  };

  componentDidUpdate = this.componentWillMount;

  onPageChange = (event, data) => {
    const { activePage } = data;
    this.props.onPageChange(activePage);
  };

  onSortChange = (newSort) => () => {
    const { sort, order, onSortOrderChange } = this.props;

    let newOrder;

    if (sort !== newSort) {
      newOrder = 'asc';
    }
    else {
      newOrder = order === 'asc' ? 'desc' : 'asc';
    }

    onSortOrderChange(newSort, newOrder);
  };

  entryKey = (entry) => {
    const { entityType } = this.props;

    switch (entityType) {
      case 'course':
        return entry.course.uuid;
      case 'instructor':
        return entry.instructor.id;
      case 'subject':
        return entry.subject.code;
      default:
        return null;
    }
  };

  renderEntryName = (entry) => {
    const { entityType } = this.props;
    let link;

    switch (entityType) {
      case 'course':
        const { course } = entry;
        return (
            <Header as='h4'>
              <Header.Content>
                <Link to={`/courses/${course.uuid}`}>
                  <CourseName uuid={course.uuid} data={course}/>
                </Link>
              </Header.Content>
              <Header.Subheader>
                <CourseName asSubjectAndNumber={true} uuid={course.uuid} data={course}/>
              </Header.Subheader>
            </Header>
        );
      case 'instructor':
        const { instructor } = entry;
        link = '/search?' + stringify({instructors: [instructor.id]});
        return (
            <Header as='h4'>
              <Header.Content>
                <Link to={link}>
                  {instructor.name}
                </Link>
              </Header.Content>
            </Header>
        );
      case 'subject':
        const { subject } = entry;
        link = '/search?' + stringify({subjects: [subject.code]});
        return (
            <Header as='h4'>
              <Header.Content>
                <Link to={link}>
                  {subject.name}
                </Link>
              </Header.Content>
            </Header>
        );
    }
  };

  renderEntries = (results) => {
    if (!results)
      return null;

    return results.map(entry => {
      return (
          <Table.Row key={this.entryKey(entry)}>
            <Table.Cell>
              {this.renderEntryName(entry)}
            </Table.Cell>
            <Table.Cell>
              {utils.numberWithCommas(parseFloat(entry.countAvg.toFixed(1)))}
            </Table.Cell>
            <Table.Cell>
              {utils.numberWithCommas(entry.gpaTotal)}
            </Table.Cell>
            <Table.Cell>
              {entry.gpa.toFixed(3)}
            </Table.Cell>
          </Table.Row>
      )
    });
  };

  render = () => {
    const { data, entityType, sort, order, page } = this.props;
    const entityName = _.upperFirst(entityType) + 's';

    let orderFull = (order === 'asc') ? 'ascending' : 'descending';

    let activePage = page;
    let totalPages = 1;
    let results;

    if (data && !data.isFetching) {
      totalPages = data.totalPages;
      results = data.results;
    }

    return (
        <Table celled sortable fixed unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {entityName}
              </Table.HeaderCell>
              <Table.HeaderCell
                  onClick={this.onSortChange('count_avg')}
                  sorted={sort === 'count_avg' ? orderFull : null}>
                Avg # Grades
              </Table.HeaderCell>
              <Table.HeaderCell
                  onClick={this.onSortChange('gpa_total')}
                  sorted={sort === 'gpa_total' ? orderFull : null}>
                Total # Grades
              </Table.HeaderCell>
              <Table.HeaderCell
                  onClick={this.onSortChange('gpa')}
                  sorted={sort === 'gpa' ? orderFull : null}>
                Avg GPA
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.renderEntries(results)}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='4'>
                <Pagination
                    floated='right'
                    onPageChange={this.onPageChange}
                    activePage={activePage}
                    ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                    firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                    lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                    prevItem={{ content: <Icon name='angle left' />, icon: true }}
                    nextItem={{ content: <Icon name='angle right' />, icon: true }}
                    totalPages={totalPages}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
    )
  }
}

function mapStateToProps(state, ownProps) {
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
  }

  return {
    data
  };
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(Explorer)
