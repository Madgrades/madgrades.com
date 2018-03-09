import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import utils from "../utils";
import GradeDistributionChart from "../containers/charts/GradeDistributionChart";
import {Dimmer, Loader} from "semantic-ui-react";
import Div from "../containers/Div";
import {GpaChart} from "../containers/charts/GpaChart";

class CourseChart extends Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    termCode: PropTypes.number
  };

  componentWillMount = () => {
    const { actions, uuid } = this.props;

    actions.fetchCourseGrades(uuid);
  };

  render = () => {
    const { data, termCode } = this.props;

    let chart;
    let gradeDistribution;
    
    if (data && data.cumulative) {
      if (termCode) {
        let termData = data.courseOfferings.filter(offering => offering.termCode === termCode);

        if (termData) {
          gradeDistribution = termData[0].cumulative;
        }
      }
      else {
        gradeDistribution = data.cumulative;
      }
    }

    let isLoaded = gradeDistribution !== undefined;

    if (isLoaded) {
      chart = (
          <GradeDistributionChart
              title={`Cumulative Grade Distribution - (${utils.round(utils.grades.gpa(gradeDistribution), 2)} GPA)`}
              gradeDistribution={gradeDistribution}/>
      )
    }
    else {
      chart = (
          <GradeDistributionChart
              title="Cumulative Grade Distribution"
              gradeDistribution={utils.grades.zero()}/>
      )
    }

    return (
        <Dimmer.Dimmable as={Div}>
          <Dimmer active={!isLoaded} inverted>
            <Loader active={!isLoaded} inverted>Loading Data</Loader>
          </Dimmer>
          <div style={{height: "400px"}}>
            {chart}
          </div>
        </Dimmer.Dimmable>
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
