import * as actionTypes from "../actionTypes";

const initialState = {
  searchQuery: ""
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.query || ""
      };
    default: {
      return state
    }
  }
}