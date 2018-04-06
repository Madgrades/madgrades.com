import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import utils from '../utils';
import GradeDistributionChart from '../containers/charts/GradeDistributionChart';
import {Dimmer, Loader} from 'semantic-ui-react';
import Div from '../containers/Div';

class CourseChart extends Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    termCode: PropTypes.number,
    instructorId: PropTypes.number
  };

  componentWillMount = () => {
    const { actions, uuid } = this.props;

    actions.fetchCourseGrades(uuid);
  };

  render = () => {
    const { course, uuid, data, termCode, instructorId } = this.props;

    let chart, primary, label, secondary, secondaryLabel, isLoaded;

    let title = course && course.name;
    title += ': Cumulative';

    if (data && data.cumulative) {
      isLoaded = true;

      primary = data.cumulative;
      label = `Cumulative - ${utils.grades.gpa(data.cumulative, true)} GPA`;

      let termName = termCode && utils.termCodes.toName(termCode);

      if (termCode && !instructorId) {
        let offering = data.courseOfferings.filter(o => o.termCode === termCode)[0];

        if (offering) {
          secondary = offering.cumulative;
          secondaryLabel = `${termName}`;
          title += ` vs. ${termName}`;
        }
        else {
          console.error(`Invalid course/term combination: ${uuid}/${termCode}`);
        }
      }
      else if (instructorId && !termCode) {
        let instructor = data.instructors.filter(i => i.id === instructorId)[0];

        if (instructor) {
          secondary = instructor.cumulative;
          secondaryLabel = instructor.name;
          title += ` vs. ${instructor.name}`;
        }
        else {
          console.error(`Invalid course/instructor combination: ${uuid}/${instructorId}`);
        }
      }
      else if (instructorId && termCode) {
        let instructor = data.instructors.filter(i => i.id === instructorId)[0];

        if (instructor) {
          let offering = instructor.terms.filter(o => o.termCode === termCode)[0];

          if (offering) {
            secondary = offering;
            secondaryLabel = `${instructor.name} (${termName})`;
            title += ` vs. ${instructor.name} (${termName})`;
          }
          else {
            console.error(`Invalid course/instructor/term combination: ${uuid}/${instructorId}/${termCode}`);
          }
        }
      }
      else {
        // no secondary
      }

      if (secondary) {
        secondaryLabel += ' - ' + utils.grades.gpa(secondary, true) + ' GPA';
      }
    }


    if (isLoaded) {
      chart = (
          <GradeDistributionChart
              title={title}
              primary={primary}
              primaryLabel={label}
              secondary={secondary}
              secondaryLabel={secondaryLabel}/>
      )
    }
    else {
      chart = (
          <GradeDistributionChart
              title='Cumulative Grade Distribution'/>
      )
    }

    return (
        <Dimmer.Dimmable as={Div}>
          <Dimmer active={!isLoaded} inverted>
            <Loader active={!isLoaded} inverted>Loading Data</Loader>
          </Dimmer>
          {chart}
        </Dimmer.Dimmable>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const course = state.courses.data[ownProps.uuid];
  const data = state.grades.courses.data[ownProps.uuid];

  return {
    course,
    data
  }
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(CourseChart)
