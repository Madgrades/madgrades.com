import * as actionTypes from "../actionTypes";

export const setSearchQuery = (query) => {
  return {
    type: actionTypes.SET_SEARCH_QUERY,
    query
  }
};