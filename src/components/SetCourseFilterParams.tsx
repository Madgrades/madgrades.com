import { Component, useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { setCourseFilterParams, fetchCourseSearch } from "../store/slices/appSlice";
import _ from "lodash";

interface CourseFilterParams {
  query?: string | null;
  page?: number;
  subjects?: string[];
  instructors?: number[];
  sort?: string;
  order?: 'asc' | 'desc';
  compareWith?: string;
}

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
    dispatch(setCourseFilterParams(params));
    dispatch(fetchCourseSearch({ params, page: page || 1 }));
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
