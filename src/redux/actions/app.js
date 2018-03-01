import * as actionTypes from "../actionTypes";

export const setCourseSearchQuery = (query) => {
  return {
    type: actionTypes.SET_COURSE_SEARCH_QUERY,
    query
  }
};