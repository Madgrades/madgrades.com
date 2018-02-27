import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import actions from "../redux/actions/index";
import GradeDistributionChart from "../containers/charts/GradeDistributionChart";
import Select from "react-select";
import utils from "../utils";
import {GpaChart} from "../containers/charts/GpaChart";

class CourseData extends Component {
  state = {
    selectedTerm: undefined
  };

  componentWillMount = () => {
    const { uuid } = this.props;
    this.props.actions.fetchCourse(uuid);
    this.props.actions.fetchCourseGrades(uuid);
  };

  termOptions = () => {
    const { gradesData } = this.props;

    return gradesData.courseOfferings.map(offering => {
      return {
        value: offering.termCode,
        label: utils.termCodes.toName(offering.termCode),
        data: offering.cumulative
      }
    });
  };

  onChangeTerm = (term) => {
    this.setState({
      selectedTerm: term
    })
  };

  render = () => {
    const { courseData, gradesData } = this.props;
    const { selectedTerm } = this.state;

    if (!gradesData)
      return null;

    const termOptions = this.termOptions();

    let chart = {
      label: undefined,
      data: undefined
    };

    if (selectedTerm) {
      chart.label = selectedTerm.label;
      chart.data = selectedTerm.data;
    }
    else {
      chart.label = "Cumulative";
      chart.data = gradesData.cumulative;
    }

    let allTerms = gradesData.courseOfferings.map(offering => {
      return {
        ...offering.cumulative,
        termCode: offering.termCode
      }
    }).sort((a, b) => a.termCode - b.termCode);

    return (
        <div>
          <div>{courseData.names}</div>
          <div style={{width: "600px", height: "250px"}}>
            <GradeDistributionChart
                title={courseData.names[0] + " - " + chart.label}
                gradeDistribution={chart.data}
            />
          </div>
          <Select
              placeholder="Filter by term"
              searchable={false}
              value={selectedTerm}
              onChange={this.onChangeTerm}
              options={termOptions}
              closeOnSelect={true}
          />
          <div style={{width: "600px", height: "250px"}}>
            <GpaChart
                gradeDistributions={allTerms}
            />
          </div>
        </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const courseData = state.courses.data[ownProps.uuid];
  const gradesData = state.grades.courses.data[ownProps.uuid];

  return {
    courseData: courseData && courseData.response,
    gradesData: gradesData && gradesData.response
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseData)
