import React, { Component } from "react";
import { connect } from "react-redux";
import utils from "../utils";
import PropTypes from "prop-types";
import { GpaChart } from "../containers/charts/GpaChart";

class CourseGpaChart extends Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
  };

  fetchCourseGrades = () => {
    this.props.actions.fetchCourseGrades(this.props.uuid);
  };

  componentDidMount = this.fetchCourseGrades;

  componentDidUpdate = (prevProps) => {
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

function mapStateToProps(state, ownProps) {
  const data = state.grades.courses.data[ownProps.uuid];

  return {
    data,
  };
}

export default connect(
  mapStateToProps,
  utils.mapDispatchToProps
)(CourseGpaChart);
