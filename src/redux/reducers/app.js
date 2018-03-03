import * as actionTypes from "../actionTypes";

const initialState = {
  courseSearchQuery: ""
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_COURSE_SEARCH_QUERY:
      return {
        ...state,
        courseSearchQuery: action.query || ""
      };
    default: {
      return state
    }
  }
}