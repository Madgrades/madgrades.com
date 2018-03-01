import * as actionTypes from "../actionTypes";

const initialState = {
  data: {},
  searches: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_COURSE: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.uuid]: {
            isFetching: true
          }
        }
      }
    }
    case actionTypes.RECEIVE_COURSE: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.uuid]: {
            isFetching: false,
            ...action.data
          }
        }
      }
    }
    case actionTypes.REQUEST_COURSE_SEARCH: {
      return {
        ...state,
        searches: {
          ...state.searches,
          [action.query]: {
            [action.page]: {
              isFetching: true
            }
          }
        }
      }
    }
    case actionTypes.RECEIVE_COURSE_SEARCH: {
      return {
        ...state,
        searches: {
          ...state.searches,
          [action.query]: {
            [action.page]: {
              isFetching: false,
              ...action.data
            }
          }
        }
      }
    }
    default: {
      return state
    }
  }
}