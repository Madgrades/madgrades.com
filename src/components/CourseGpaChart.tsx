import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { RootState, CourseOffering } from '../types';
import { GpaChart } from '../containers/charts/GpaChart';

interface CourseGpaChartProps {
  uuid: string;
  data?: any;
  actions?: any;
}

class CourseGpaChart extends Component<CourseGpaChartProps> {

  fetchCourseGrades = () => {
    this.props.actions.fetchCourseGrades(this.props.uuid);
  };

  componentDidMount = this.fetchCourseGrades;

  componentDidUpdate = (prevProps: CourseGpaChartProps) => {
    if (prevProps.uuid !== this.props.uuid) {
      this.fetchCourseGrades();
    }
  };

  render = () => {
    const { data } = this.props;

    if (!data || data.isFetching) return <GpaChart gradeDistributions={[]} />;

    const gradeDistributions = data.courseOfferings
      .map((o) => {
        return {
          ...o.cumulative,
          termCode: o.termCode,
        };
      })
      .sort((a, b) => a.termCode - b.termCode);

    return <GpaChart gradeDistributions={gradeDistributions} />;
  };
}

function mapStateToProps(state: RootState, ownProps: { uuid: string }) {
  const data = state.grades.courses.data[ownProps.uuid];

  return {
    data,
  };
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
export default connector(CourseGpaChart);
