import React, { useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { setCourseFilterParams } from "../store/slices/appSlice";
import { fetchCourseSearch } from "../store/slices/coursesSlice";
import { CourseFilterParams } from "../types/api";

interface SetCourseFilterParamsProps {
  params: CourseFilterParams;
}

const SetCourseFilterParams: React.FC<SetCourseFilterParamsProps> = ({ params }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const { page } = params;
    
    const normalizedParams: CourseFilterParams = {
      ...params,
      subjects: Array.isArray(params.subjects) ? params.subjects : (params.subjects ? [params.subjects] : undefined),
      instructors: Array.isArray(params.instructors) 
        ? params.instructors.map(i => typeof i === 'number' ? i : parseInt(String(i), 10))
        : (params.instructors ? [typeof params.instructors === 'number' ? params.instructors : parseInt(String(params.instructors), 10)] : undefined)
    };
    
    dispatch(setCourseFilterParams(normalizedParams));
    dispatch(fetchCourseSearch({ params: normalizedParams, page: page || 1 }));
  }, [dispatch, params]);

  return null;
};

export default SetCourseFilterParams;
