import { Component } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCourse } from "../store/slices/coursesSlice";
import SubjectNameList from "../containers/SubjectNameList";
import { Course, Subject } from "../types/api";

interface CourseNameProps {
  uuid: string;
  fallback?: string;
  data?: Course;
  asSubjectAndNumber?: boolean;
}

interface CourseNameClassProps extends CourseNameProps {
  name?: string;
  subjects?: Subject[];
  number?: number;
  dispatch: ReturnType<typeof useAppDispatch>;
}

class CourseNameClass extends Component<CourseNameClassProps> {
  fetchCourseIfNeeded = (): void => {
    const { dispatch, uuid, data } = this.props;

    if (!data) {
      dispatch(fetchCourse(uuid));
    }
  };

  componentDidMount = (): void => {
    this.fetchCourseIfNeeded();
  };

  componentDidUpdate = (prevProps: CourseNameClassProps): void => {
    if (prevProps.uuid !== this.props.uuid) {
      this.fetchCourseIfNeeded();
    }
  };

  render = (): JSX.Element => {
    const { name, subjects, number, fallback, asSubjectAndNumber } = this.props;

    if (asSubjectAndNumber) {
      if (subjects) {
        return (
          <span>
            <SubjectNameList subjects={subjects} /> {number}
          </span>
        );
      } else {
        return (
          <span>
            {fallback} {number}
          </span>
        );
      }
    } else {
      return <span>{name || fallback}</span>;
    }
  };
}

const CourseName: React.FC<CourseNameProps> = ({ uuid, data, ...props }) => {
  const dispatch = useAppDispatch();
  const courseData = useAppSelector(state => 
    !data ? state.courses.data[uuid]?.data : undefined
  );

  const finalData = data || courseData;

  return (
    <CourseNameClass
      {...props}
      uuid={uuid}
      data={finalData}
      name={finalData?.name}
      subjects={finalData?.subjects}
      number={finalData?.number}
      dispatch={dispatch}
    />
  );
};

export default CourseName;
