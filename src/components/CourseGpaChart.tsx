import { Component } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCourseGrades } from "../store/slices/gradesSlice";
import { GpaChart } from "../containers/charts/GpaChart";
import { GradeDistribution } from "../types/api";

interface CourseGpaChartProps {
  uuid: string;
}

interface CourseGpaChartClassProps extends CourseGpaChartProps {
  data?: {
    isFetching: boolean;
    courseOfferings?: Array<{
      cumulative: GradeDistribution;
      termCode: number;
    }>;
  };
  dispatch: ReturnType<typeof useAppDispatch>;
}

class CourseGpaChartClass extends Component<CourseGpaChartClassProps> {
  fetchCourseGrades = (): void => {
    this.props.dispatch(fetchCourseGrades(this.props.uuid));
  };

  componentDidMount = (): void => {
    this.fetchCourseGrades();
  };

  componentDidUpdate = (prevProps: CourseGpaChartClassProps): void => {
    if (prevProps.uuid !== this.props.uuid) {
      this.fetchCourseGrades();
    }
  };

  render = (): JSX.Element => {
    const { data } = this.props;

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
}

const CourseGpaChart: React.FC<CourseGpaChartProps> = ({ uuid }) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(state => state.grades.courses.data[uuid]);

  return <CourseGpaChartClass uuid={uuid} data={data} dispatch={dispatch} />;
};

export default CourseGpaChart;
