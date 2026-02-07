import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCourseGrades } from "../store/slices/gradesSlice";
import utils from "../utils";
import GradeDistributionChart from "../containers/charts/GradeDistributionChart";
import { Dimmer, Loader } from "semantic-ui-react";
import Div from "../containers/Div";
import { GradeDistribution } from "../types/api";

interface CourseChartProps {
  uuid: string;
  termCode?: number;
  instructorId?: number;
}

const CourseChart: React.FC<CourseChartProps> = ({ uuid, termCode, instructorId }) => {
  const dispatch = useAppDispatch();
  const course = useAppSelector(state => state.courses.data[uuid]);
  const data = useAppSelector(state => state.grades.courses.data[uuid]);

  useEffect(() => {
    dispatch(fetchCourseGrades(uuid));
  }, [dispatch, uuid]);

  let chart: React.ReactNode;
  let primary: GradeDistribution | undefined;
  let label: string | undefined;
  let secondary: GradeDistribution | undefined;
  let secondaryLabel: string | undefined;
  let isLoaded = false;

  let title = course?.data?.name || '';
  title += ": Cumulative";

  const cumulative = data?.courseOfferings ? utils.grades.combineAll(data.courseOfferings.map(o => o.cumulative)) : undefined;

  if (data && cumulative) {
    isLoaded = true;

    primary = cumulative;
    label = `Cumulative - ${utils.grades.gpa(cumulative, true)} GPA`;

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

export default CourseChart;
