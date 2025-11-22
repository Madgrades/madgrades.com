import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import SubjectNameList from '../containers/SubjectNameList';
import { RootState, Course, Subject } from '../types';

interface OwnProps {
  uuid: string;
  fallback?: string;
  data?: Course;
  asSubjectAndNumber?: boolean;
}

interface StateProps {
  name?: string;
  subjects?: Subject[];
  number?: string;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & StateProps & PropsFromRedux;

class CourseName extends Component<Props> {
  fetchCourseIfNeeded = () => {
    const { actions, uuid, data } = this.props;

    if (!data) {
      actions.fetchCourse(uuid);
    }
  };

  componentDidMount = this.fetchCourseIfNeeded;

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.uuid !== this.props.uuid) {
      this.fetchCourseIfNeeded();
    }
  };

  render = () => {
    const { name, subjects, number, fallback, asSubjectAndNumber } = this.props;

    if (asSubjectAndNumber) {
      if (subjects) {
        return (
          <span>
            <SubjectNameList subjects={subjects} /> {number}
          </span>
        );
      } else {
        return (
          <span>
            {fallback} {number}
          </span>
        );
      }
    } else {
      return <span>{name || fallback}</span>;
    }
  };
}

function mapStateToProps(state: RootState, ownProps: OwnProps): StateProps {
  const { uuid, data } = ownProps;

  let courseData = data;

  if (!data) {
    const { courses } = state;
    courseData = courses.data[uuid];
  }

  return {
    name: courseData && courseData.name,
    subjects: courseData && courseData.subjects,
    number: courseData && courseData.number,
  };
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
export default connector(CourseName);
