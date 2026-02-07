import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCourse } from "../store/slices/coursesSlice";
import { Course } from "../types/api";

interface CourseDataProps {
  uuid: string;
  onDataLoad: (data: Course) => void;
}

const CourseData: React.FC<CourseDataProps> = ({ uuid, onDataLoad }) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(state => state.courses.data[uuid]);

  useEffect(() => {
    dispatch(fetchCourse(uuid));
  }, [dispatch, uuid]);

  useEffect(() => {
    if (data?.data && !data.isFetching) {
      onDataLoad(data.data);
    }
  }, [data, onDataLoad]);

  return null;
};

export default CourseData;
