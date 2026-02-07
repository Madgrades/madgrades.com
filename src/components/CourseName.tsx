import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCourse } from "../store/slices/coursesSlice";
import SubjectNameList from "../containers/SubjectNameList";
import { Course } from "../types/api";

interface CourseNameProps {
  uuid: string;
  fallback?: string;
  data?: Course;
  asSubjectAndNumber?: boolean;
}

const CourseName: React.FC<CourseNameProps> = ({ uuid, data, fallback, asSubjectAndNumber }) => {
  const dispatch = useAppDispatch();
  const courseStateData = useAppSelector(state => 
    !data ? state.courses.data[uuid] : undefined
  );

  // Get the actual course data from nested structure
  const courseData = data || courseStateData?.data;

  useEffect(() => {
    if (!data && !courseStateData) {
      dispatch(fetchCourse(uuid));
    }
  }, [dispatch, uuid, data, courseStateData]);

  const name = courseData?.name;
  const subjects = courseData?.subjects;
  const number = courseData?.number;

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

export default CourseName;
