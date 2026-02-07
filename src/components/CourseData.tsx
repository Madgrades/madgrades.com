import { Component } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCourse } from "../store/slices/coursesSlice";
import { Course } from "../types/api";

interface CourseDataProps {
  uuid: string;
  onDataLoad: (data: Course) => void;
}

interface CourseDataClassProps extends CourseDataProps {
  data?: { isFetching: boolean; data?: Course };
  dispatch: ReturnType<typeof useAppDispatch>;
}

class CourseDataClass extends Component<CourseDataClassProps> {
  fetchData = (): void => {
    const { dispatch, uuid } = this.props;
    dispatch(fetchCourse(uuid));
  };

  componentDidMount = (): void => {
    this.fetchData();
    this.notifyIfDataReady();
  };

  componentDidUpdate = (prevProps: CourseDataClassProps): void => {
    if (prevProps.uuid !== this.props.uuid) {
      this.fetchData();
    }

    if (prevProps.data !== this.props.data) {
      this.notifyIfDataReady();
    }
  };

  notifyIfDataReady = (): void => {
    const { data, onDataLoad } = this.props;
    if (data?.data && !data.isFetching) {
      onDataLoad(data.data);
    }
  };

  render = (): null => null;
}

const CourseData: React.FC<CourseDataProps> = ({ uuid, onDataLoad }) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(state => state.courses.data[uuid]);

  return <CourseDataClass uuid={uuid} onDataLoad={onDataLoad} data={data} dispatch={dispatch} />;
};

export default CourseData;
