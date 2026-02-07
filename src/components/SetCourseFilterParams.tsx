import React, { useEffect, useRef } from "react";
import { useAppDispatch } from "../store/hooks";
import { setCourseFilterParams } from "../store/slices/appSlice";
import { CourseFilterParams } from "../types/api";
import * as _ from "lodash";

interface SetCourseFilterParamsProps {
  params: CourseFilterParams;
}

const SetCourseFilterParams: React.FC<SetCourseFilterParamsProps> = ({ params }) => {
  const dispatch = useAppDispatch();
  const prevParamsRef = useRef<CourseFilterParams | null>(null);

  useEffect(() => {
    // Normalize the params
    const normalizedParams: CourseFilterParams = {
      ...params,
      subjects: Array.isArray(params.subjects) 
        ? params.subjects 
        : (params.subjects ? [params.subjects] : undefined),
      instructors: Array.isArray(params.instructors) 
        ? params.instructors.map(i => typeof i === 'number' ? i : parseInt(String(i), 10))
        : (params.instructors ? [typeof params.instructors === 'number' ? params.instructors : parseInt(String(params.instructors), 10)] : undefined)
    };
    
    // Only dispatch if params actually changed
    if (!_.isEqual(normalizedParams, prevParamsRef.current)) {
      dispatch(setCourseFilterParams(normalizedParams));
      prevParamsRef.current = normalizedParams;
    }
  }, [dispatch, params]);

  return null;
};

export default SetCourseFilterParams;
