import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import actions from "../redux/actions/index"
import GradeDistributionChart from "../containers/charts/GradeDistributionChart";
import Select from "react-select";
import * as termCodes from "../util/termCodes";
import * as gradeDistributions from "../util/gradeDistributions";
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

    const cumulative = {
      value: 0,
      label: 'Cumulative',
      data: gradesData.cumulative,
      clearableValue: false
    };
    const courseOfferings = gradesData.courseOfferings.map(offering => {
      return {
        value: offering.termCode,
        label: termCodes.toName(offering.termCode),
        data: offering.cumulative
      }
    });
    return [cumulative].concat(courseOfferings);
  };

  onChangeTerm = (nextOption) => {
    const { selectedTerms } = this.state;

    this.setState({
      selectedTerm: nextOption
    })

    // let allOptions = this.termOptions();
    // let fromCumulative = selectedTerms.filter(option => option.value === 0).length > 0;
    // let toCumulative = nextOption.filter(option => option.value === 0).length > 0;
    //
    // let nextSelected = nextOption;
    //
    // if (!fromCumulative && toCumulative) {
    //   nextSelected = [allOptions[0]];
    // } else if (fromCumulative && toCumulative) {
    //   nextSelected = nextSelected.filter(option => option.value !== 0);
    // }
    //
    // this.setState({
    //   selectedTerms: nextSelected.sort((a, b) => b.value - a.value)
    // });
  };

  render = () => {
    const { uuid, courseData, gradesData } = this.props;
    const { selectedTerms } = this.state;

    if (!courseData || !gradesData)
      return null;

    const termOptions = this.termOptions();

    if (!selectedTerm || selectedTerm.length === 0) {
      this.setState({
        selectedTerm: termOptions[0]
      });
      return null;
    }

    // let gradeDistribution = gradeDistributions.combineAll(selectedTerms.map(option => option.data));

    let gradeDistribution = selectedTerm.data;

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
                title={termCodes.}
                gradeDistribution={gradeDistribution}
            />
          </div>
          <Select
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
