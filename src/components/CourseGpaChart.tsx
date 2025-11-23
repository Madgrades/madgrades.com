import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { RootState, CourseOfferingData, CourseTermData } from '../types';
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

  if (!data.isFetching) {
    const gradeDistributions: CourseTermData[] = (data.courseOfferings ?? [])
      .map((o: CourseOfferingData) => {
        return {
          ...o.cumulative,
          termCode: o.termCode,
        } as CourseTermData;
      })
      .sort((a: CourseTermData, b: CourseTermData) => a.termCode - b.termCode);

    return <GpaChart gradeDistributions={gradeDistributions} />;
  }

  const gradeDistributions: CourseTermData[] = (data.courseOfferings ?? [])
    .map((o: CourseOfferingData) => {
      return {
        ...o.cumulative,
        termCode: o.termCode,
      } as CourseTermData;
    })
    .sort((a: CourseTermData, b: CourseTermData) => a.termCode - b.termCode);

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
