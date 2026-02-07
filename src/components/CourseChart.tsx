import React, { Component } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCourseGrades } from "../store/slices/gradesSlice";
import utils from "../utils";
import GradeDistributionChart from "../containers/charts/GradeDistributionChart";
import { Dimmer, Loader } from "semantic-ui-react";
import Div from "../containers/Div";
import { Course, CourseGradesResponse, GradeDistribution } from "../types/api";

interface CourseChartProps {
  uuid: string;
  termCode?: number;
  instructorId?: number;
}

interface CourseChartClassProps extends CourseChartProps {
  course?: { data?: Course };
  data?: CourseGradesResponse & { isFetching: boolean; cumulative?: GradeDistribution };
  dispatch: ReturnType<typeof useAppDispatch>;
}

class CourseChartClass extends Component<CourseChartClassProps> {
  componentDidMount = (): void => {
    const { dispatch, uuid } = this.props;
    dispatch(fetchCourseGrades(uuid));
  };

  render = () => {
    const { course, uuid, data, termCode, instructorId } = this.props;

    let chart: JSX.Element;
    let primary: GradeDistribution | undefined;
    let label: string | undefined;
    let secondary: GradeDistribution | undefined;
    let secondaryLabel: string | undefined;
    let isLoaded = false;

    let title = course?.data?.name || '';
    title += ": Cumulative";

    if (data && data.cumulative) {
      isLoaded = true;

      primary = data.cumulative;
      label = `Cumulative - ${utils.grades.gpa(data.cumulative, true)} GPA`;

      const termName = termCode && utils.termCodes.toName(termCode);

      if (termCode && !instructorId) {
        const offering = data.courseOfferings?.filter(
          (o) => o.termCode === termCode
        )[0];

        if (offering) {
          secondary = offering.cumulative;
          secondaryLabel = `${termName}`;
          title += ` vs. ${termName}`;
        } else {
          console.error(`Invalid course/term combination: ${uuid}/${termCode}`);
        }
      } else if (instructorId && !termCode) {
        const instructor = data.instructors?.filter(
          (i) => i.id === instructorId
        )[0];

        if (instructor) {
          secondary = instructor.cumulative;
          secondaryLabel = instructor.name;
          title += ` vs. ${instructor.name}`;
        } else {
          console.error(
            `Invalid course/instructor combination: ${uuid}/${instructorId}`
          );
        }
      } else if (instructorId && termCode) {
        const instructor = data.instructors?.filter(
          (i) => i.id === instructorId
        )[0];

        if (instructor) {
          const offering = instructor.terms.filter(
            (o) => o.termCode === termCode
          )[0];

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
      }

      if (secondary) {
        secondaryLabel += " - " + utils.grades.gpa(secondary, true) + " GPA";
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
  };
}

const CourseChart: React.FC<CourseChartProps> = (props) => {
  const dispatch = useAppDispatch();
  const course = useAppSelector(state => state.courses.data[props.uuid]);
  const data = useAppSelector(state => state.grades.courses.data[props.uuid]);

  return <CourseChartClass {...props} course={course} data={data as CourseGradesResponse & { isFetching: boolean; cumulative?: GradeDistribution }} dispatch={dispatch} />;
};

export default CourseChart;
