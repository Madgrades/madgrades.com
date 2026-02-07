import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCourseGrades } from "../store/slices/gradesSlice";
import { GpaChart } from "../containers/charts/GpaChart";

interface CourseGpaChartProps {
  uuid: string;
}

const CourseGpaChart: React.FC<CourseGpaChartProps> = ({ uuid }) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(state => state.grades.courses.data[uuid]);

  useEffect(() => {
    dispatch(fetchCourseGrades(uuid));
  }, [dispatch, uuid]);

  if (!data || data.isFetching) return <GpaChart gradeDistributions={[]} />;

  const gradeDistributions = data.courseOfferings!
    .map((o) => {
      return {
        ...o.cumulative,
        termCode: o.termCode,
      };
    })
    .sort((a, b) => a.termCode - b.termCode);

  return <GpaChart gradeDistributions={gradeDistributions} />;
};

export default CourseGpaChart;
