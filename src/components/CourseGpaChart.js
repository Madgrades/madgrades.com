import React, { Component } from "react";
import { connect } from "react-redux";
import utils from "../utils";
import PropTypes from "prop-types";
import GpaChart from "../containers/charts/GpaChart";

class CourseGpaChart extends Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    instructorId: PropTypes.number,
    termCode: PropTypes.number,
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
    const { data, instructorId = 0, termCode = 0 } = this.props;

    if (!data || data.isFetching) return <GpaChart gradeDistributions={[]} />;

    // primary: course cumulative per-term (legacy behavior)
    const gradeDistributions = data.courseOfferings
      .map((o) => ({ ...o.cumulative, termCode: o.termCode }))
      .sort((a, b) => a.termCode - b.termCode);

    // if an instructor filter is provided, build a secondary series (single-term or multi-term)
    if (instructorId > 0) {
      const instructors = Array.isArray(data.instructors)
        ? data.instructors
        : [];
      const instructor = instructors.find((i) => i.id === instructorId);

      if (instructor) {
        let secondarySeries = [];

        if (termCode > 0) {
          // single-point comparison (instructor's data for the selected term)
          secondarySeries = (instructor.terms || []).filter(
            (t) => t.termCode === termCode,
          );
        } else {
          // full instructor time-series
          secondarySeries = instructor.terms || [];
        }

        const secondaryLabel = instructor.name || `Instructor ${instructorId}`;

        return (
          <GpaChart
            primary={gradeDistributions}
            secondary={secondarySeries}
            primaryLabel={`Course — cumulative`}
            secondaryLabel={secondaryLabel}
            title={`Average GPA — Course vs ${secondaryLabel}`}
          />
        );
      }
      // if instructorId provided but not found, fall back to course-only chart
    }

    // default single-series rendering
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
  utils.mapDispatchToProps,
)(CourseGpaChart);
