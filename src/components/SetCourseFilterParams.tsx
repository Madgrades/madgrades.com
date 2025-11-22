import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { CourseFilterParams } from '../types';

interface OwnProps {
  params: CourseFilterParams;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

function SetCourseFilterParams({ params, actions }: Props) {
  useEffect(() => {
    const { page } = params;
    actions.setCourseFilterParams(params);
    actions.fetchCourseSearch(params, page);
  }, [params, actions]);

  return null;
}

const connector = connect(null, utils.mapDispatchToProps);
export default connector(SetCourseFilterParams);
