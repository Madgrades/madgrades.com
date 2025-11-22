import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { RootState } from '../types';
import { GpaChart } from '../containers/charts/GpaChart';

interface OwnProps {
  uuid: string;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

function CourseGpaChart({ uuid, actions, data }: Props) {
  useEffect(() => {
    actions.fetchCourseGrades(uuid);
  }, [uuid, actions]);

  if (!data || data.isFetching) return <GpaChart gradeDistributions={[]} />;

  const gradeDistributions = data.courseOfferings
    .map((o: any) => {
      return {
        ...o.cumulative,
        termCode: o.termCode,
      };
    })
    .sort((a: any, b: any) => a.termCode - b.termCode);

  return <GpaChart gradeDistributions={gradeDistributions} />;
}

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  const data = state.grades.courses.data[ownProps.uuid];

  return {
    data,
  };
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
export default connector(CourseGpaChart);
