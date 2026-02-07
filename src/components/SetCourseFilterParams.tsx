import React, { Component } from "react";
import { useAppDispatch } from "../store/hooks";
import { setCourseFilterParams } from "../store/slices/appSlice";
import { fetchCourseSearch } from "../store/slices/coursesSlice";
import _ from "lodash";
import { CourseFilterParams } from "../types/api";

interface SetCourseFilterParamsProps {
  params: CourseFilterParams;
}

interface SetCourseFilterParamsClassProps extends SetCourseFilterParamsProps {
  dispatch: ReturnType<typeof useAppDispatch>;
}

class SetCourseFilterParamsClass extends Component<SetCourseFilterParamsClassProps> {
  setCourseFilterParams = (): void => {
    const { params, dispatch } = this.props;
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
  };

  componentDidMount = (): void => {
    this.setCourseFilterParams();
  };

  componentDidUpdate = (prevProps: SetCourseFilterParamsClassProps): void => {
    if (!_.isEqual(prevProps.params, this.props.params)) {
      this.setCourseFilterParams();
    }
  };

  render = (): null => null;
}

const SetCourseFilterParams: React.FC<SetCourseFilterParamsProps> = ({ params }) => {
  const dispatch = useAppDispatch();

  return <SetCourseFilterParamsClass params={params} dispatch={dispatch} />;
};

export default SetCourseFilterParams;
