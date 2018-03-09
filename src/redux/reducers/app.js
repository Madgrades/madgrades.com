import * as actionTypes from "../actionTypes";

const initialState = {
  searchQuery: "",
  courseFilterParams: {
    subjects: undefined,
    instructors: undefined,
    sort: undefined,
    order: undefined
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.query || ""
      };
    case actionTypes.SET_COURSE_FILTER_PARAMS:
      return {
        ...state,
        courseFilterParams: {
          ...state.courseFilterParams,
          ...action.params
        }
      };
    default: {
      return state
    }
  }
}