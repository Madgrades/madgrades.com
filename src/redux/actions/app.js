import * as actionTypes from "../actionTypes";

export const setCourseFilterParams = (params) => {
  return {
    type: actionTypes.SET_COURSE_FILTER_PARAMS,
    params
  }
};