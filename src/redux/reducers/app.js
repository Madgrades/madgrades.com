import * as actionTypes from "../actionTypes";

const initialState = {
  theme: localStorage.getItem("madgrades-theme") || "light",
  searchQuery: "",
  courseFilterParams: {
    subjects: undefined,
    instructors: undefined,
    sort: undefined,
    order: undefined,
  },
  terms: undefined,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_THEME:
      return {
        ...state,
        theme: action.theme,
      };
    case actionTypes.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.query || "",
      };
    case actionTypes.SET_COURSE_FILTER_PARAMS:
      return {
        ...state,
        courseFilterParams: {
          ...state.courseFilterParams,
          ...action.params,
        },
      };
    case actionTypes.RECEIVE_TERMS:
      return {
        ...state,
        terms: action.terms,
      };
    default: {
      return state;
    }
  }
}
