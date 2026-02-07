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
  const courseData = useAppSelector(state => 
    !data ? state.courses.data[uuid]?.data : undefined
  );

  const finalData = data || courseData;

  useEffect(() => {
    if (!finalData) {
      dispatch(fetchCourse(uuid));
    }
  }, [dispatch, uuid, finalData]);

  const name = finalData?.name;
  const subjects = finalData?.subjects;
  const number = finalData?.number;

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
