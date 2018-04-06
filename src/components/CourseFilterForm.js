import React, {Component} from 'react';
import {connect} from 'react-redux';
import utils from '../utils';
import {Button, Divider, Form, Input} from 'semantic-ui-react';
import EntitySelect from './EntitySelect';
import {withRouter} from 'react-router';
import {stringify} from 'qs';
import * as _ from 'lodash';

class CourseFilterForm extends Component {
  state = {
    subjects: [],
    instructors: [],
    query: undefined
  };

  componentWillReceiveProps = (nextProps) => {
    const { subjects, instructors, query } = nextProps.courseFilterParams;
    this.setState({
      subjects,
      instructors,
      query
    })
  };

  onSubjectChange = (subjects) => {
    this.setState({
      subjects
    })
  };

  onInstructorChange = (instructors) => {
    this.setState({
      instructors
    })
  };

  onQueryChange = (event, { value }) => {
    this.setState({
      query: value
    })
  };

  onClear = (event) => {
    event.preventDefault();
    this.setState({
      subjects: [],
      instructors: [],
      query: undefined
    })
  };

  onSubmit = () => {
    const allParams = {
      ...this.props.courseFilterParams,
      ...this.state,
      page: 1
    };

    let params = _.omitBy(allParams, _.isNil);
    this.props.history.push('/search?' + stringify(params));
  };

  render = () => {
    const { instructors, subjects, query } = this.state;

    return (
        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <label>Search</label>
            <Input
                placeholder='i.e. Math 222, Music in Performance'
                value={query || ''}
                onChange={this.onQueryChange}/>
          </Form.Field>
          <Divider horizontal content='Filter' className='divider-small'/>
          <Form.Field>
            <label>Subjects</label>
            <EntitySelect
                value={subjects || []}
                onChange={this.onSubjectChange}
                entityType='subject'/>
          </Form.Field>
          <Form.Field>
            <label>Instructors</label>
            <EntitySelect
                value={instructors || []}
                onChange={this.onInstructorChange}
                entityType='instructor'/>
          </Form.Field>
          <Form.Button positive floated='right'>Search</Form.Button>
          <Button onClick={this.onClear} floated='left'>Clear</Button>
        </Form>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    courseFilterParams: state.app.courseFilterParams
  };
}

export default connect(mapStateToProps, utils.mapDispatchToProps)(withRouter(CourseFilterForm))
