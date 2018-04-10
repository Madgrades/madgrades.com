import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import utils from '../utils';
import SubjectNameList from '../containers/SubjectNameList';

class CourseName extends Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    fallback: PropTypes.string,
    data: PropTypes.object,
    asSubjectAndNumber: PropTypes.bool,
  };

  componentWillMount = () => {
    const { actions, uuid, data } = this.props;

    if (!data) {
      actions.fetchCourse(uuid);
    }
  };

  componentDidUpdate = this.componentWillMount;

  render = () => {
    const { name, subjects, number, fallback, asSubjectAndNumber } = this.props;

    if (asSubjectAndNumber) {
      if (subjects) {
        return (
            <span>
              <SubjectNameList subjects={subjects}/> {number}
            </span>
        );
      }
      else {
        return <span>{fallback} {number}</span>
      }
    }
    else {
      return <span>{name || fallback}</span>;
    }
  }
}

function mapStateToProps(state, ownProps) {
  const { uuid, data } = ownProps;

  let courseData = data;

  if (!data) {
    const { courses } = state;
    courseData = courses.data[uuid];
  }

  return {
    name: courseData && courseData.name,
    subjects: courseData && courseData.subjects,
    number: courseData && courseData.number
  }
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(CourseName)
