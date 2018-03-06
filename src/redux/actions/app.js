import * as actionTypes from "../actionTypes";

export const setSearchQuery = (query) => {
  return {
    type: actionTypes.SET_SEARCH_QUERY,
    query
  }
};

export const setCourseFilterParams = (params) => {
  return {
    type: actionTypes.SET_COURSE_FILTER_PARAMS,
    params
  }
};