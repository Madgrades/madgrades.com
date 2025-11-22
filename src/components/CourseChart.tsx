import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { RootState } from '../types';
import GradeDistributionChart from '../containers/charts/GradeDistributionChart';
import { Dimmer, Loader } from 'semantic-ui-react';
import Div from '../containers/Div';

interface OwnProps {
  uuid: string;
  termCode?: number;
  instructorId?: number;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

function CourseChart({ course, uuid, data, termCode, instructorId, actions }: Props) {
  useEffect(() => {
    actions.fetchCourseGrades(uuid);
  }, [actions, uuid]);

  let chart, primary, label, secondary, secondaryLabel, isLoaded;

  let title = course && course.name;
  title += ': Cumulative';

  if (data && data.cumulative) {
    isLoaded = true;

    primary = data.cumulative;
    label = `Cumulative - ${utils.grades.gpa(data.cumulative, true)} GPA`;

    const termName = termCode && utils.termCodes.toName(termCode);

    if (termCode && !instructorId) {
      const offering = data.courseOfferings.filter((o: any) => o.termCode === termCode)[0];

      if (offering) {
        secondary = offering.cumulative;
        secondaryLabel = `${termName}`;
        title += ` vs. ${termName}`;
      } else {
        console.error(`Invalid course/term combination: ${uuid}/${termCode}`);
      }
    } else if (instructorId && !termCode) {
      const instructor = data.instructors.filter((i: any) => i.id === instructorId)[0];

      if (instructor) {
        secondary = instructor.cumulative;
        secondaryLabel = instructor.name;
        title += ` vs. ${instructor.name}`;
      } else {
        console.error(`Invalid course/instructor combination: ${uuid}/${instructorId}`);
      }
    } else if (instructorId && termCode) {
      const instructor = data.instructors.filter((i: any) => i.id === instructorId)[0];

      if (instructor) {
        const offering = instructor.terms.filter((o: any) => o.termCode === termCode)[0];

        if (offering) {
          secondary = offering;
          secondaryLabel = `${instructor.name} (${termName})`;
          title += ` vs. ${instructor.name} (${termName})`;
        } else {
          console.error(
            `Invalid course/instructor/term combination: ${uuid}/${instructorId}/${termCode}`
          );
        }
      }
    } else {
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
        secondaryLabel={secondaryLabel}
      />
    );
  } else {
    chart = <GradeDistributionChart title="Cumulative Grade Distribution" />;
  }

  return (
    <Dimmer.Dimmable as={Div}>
      <Dimmer active={!isLoaded} inverted>
        <Loader active={!isLoaded} inverted>
          Loading Data
        </Loader>
      </Dimmer>
      {chart}
    </Dimmer.Dimmable>
  );
}

function mapStateToProps(state: RootState, ownProps: { uuid: string }) {
  const course = state.courses.data[ownProps.uuid];
  const data = state.grades.courses.data[ownProps.uuid];

  return {
    course,
    data,
  };
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
export default connector(CourseChart);
