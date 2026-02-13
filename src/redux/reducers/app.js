import * as actionTypes from "../actionTypes";

// Detect browser preference if no saved theme
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("madgrades-theme");
  if (savedTheme) {
    return savedTheme;
  }
  // Check browser preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return "dark";
  }
  return "light";
};

const initialState = {
  theme: getInitialTheme(),
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
