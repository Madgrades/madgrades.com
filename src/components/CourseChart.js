import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types"
import utils from "../utils";
import GradeDistributionChart from "../containers/charts/GradeDistributionChart";

class CourseChart extends Component {
  static propTypes = {
    uuid: PropTypes.number.isRequired
  };

  componentWillMount = () => {
    const { actions, uuid } = this.props;

    actions.fetchCourseGrades(uuid);
  };

  render = () => {
    const { data } = this.props;

    if (!data || !data.cumulative)
      return null;

    return (
        <div style={{width: "500px", maxWidth: "100%", height: "300px"}}>
          <GradeDistributionChart
              title={`Cumulative Grade Distribution - (${utils.math.round(data.cumulative.gpa, 2)} GPA)`}
              gradeDistribution={data.cumulative}/>
        </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const courseGrades = state.grades.courses.data;

  return {
    data: courseGrades[ownProps.uuid]
  }
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(CourseChart)
