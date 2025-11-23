import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { RootState, Course } from '../types';

interface OwnProps {
  uuid: string;
  onDataLoad: (data: Course) => void;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

function CourseData({ uuid, onDataLoad, actions, data }: Props) {
  useEffect(() => {
    actions.fetchCourse(uuid);
  }, [uuid, actions]);

  useEffect(() => {
    if (data && !data.isFetching) {
      onDataLoad(data);
    }
  }, [data, onDataLoad]);

  return null;
}

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  const { uuid } = ownProps;
  const { courses } = state;
  const data = courses.data[uuid];

  return {
    data,
  };
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
export default connector(CourseData);
