import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import {Button, Form} from "semantic-ui-react";
import EntitySelect from "./EntitySelect";
import {withRouter} from "react-router";
import {stringify} from "qs";

class CourseFilterForm extends Component {
  state = {
    subjects: [],
    instructors: []
  };

  componentWillReceiveProps = (nextProps) => {
    const { subjects, instructors } = nextProps.courseFilterParams;
    this.setState({
      subjects,
      instructors
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

  onClear = () => {
    this.setState({
      subjects: [],
      instructors: []
    })
  };

  onSubmit = () => {
    const params = {
      ...this.props.courseFilterParams,
      ...this.state
    };

    this.props.history.push('/courses?' + stringify(params, { encode: false }));
  };

  render = () => {
    const { instructors, subjects } = this.state;

    return (
        <Form onSubmit={this.onSubmit}>
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
