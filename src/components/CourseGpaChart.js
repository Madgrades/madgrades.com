import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import PropTypes from "prop-types"
import {GpaChart} from "../containers/charts/GpaChart";

class CourseGpaChart extends Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired
  };

  componentWillMount = () => {
    this.props.actions.fetchCourseGrades(this.props.uuid);
  };

  componentDidUpdate = this.componentDidMount;

  render = () => {
    const { data } = this.props;

    if (!data || data.isFetching)
      return <GpaChart gradeDistributions={[]}/>;

    const gradeDistributions = data.courseOfferings.map(o => {
      return {
        ...o.cumulative,
        termCode: o.termCode
      }
    }).sort((a, b) => a.termCode - b.termCode);

    return (
        <div style={{height: "300px"}}>
          <GpaChart gradeDistributions={gradeDistributions}/>
        </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const data = state.grades.courses.data[ownProps.uuid];

  return {
    data
  };
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(CourseGpaChart)
