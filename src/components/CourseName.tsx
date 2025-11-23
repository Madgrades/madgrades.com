import { useEffect } from 'react';
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

function CourseName({
  uuid,
  data,
  actions,
  name,
  subjects,
  number,
  fallback,
  asSubjectAndNumber,
}: Props) {
  useEffect(() => {
    if (!data) {
      actions.fetchCourse(uuid);
    }
  }, [uuid, data, actions]);

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
    return <span>{name ?? fallback}</span>;
  }
}

function mapStateToProps(state: RootState, ownProps: OwnProps): StateProps {
  const { uuid, data } = ownProps;

  let courseData = data;

  if (!data) {
    const { courses } = state;
    courseData = courses.data[uuid];
  }

  return {
    name: courseData?.name,
    subjects: courseData?.subjects,
    number: courseData?.number,
  };
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
export default connector(CourseName);
