import * as actionTypes from "../actionTypes";

const initialState = {
  data: {},
  searches: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_INSTRUCTOR: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.id]: {
            isFetching: true,
            id: parseInt(action.id, 10)
          }
        }
      }
    }
    case actionTypes.RECEIVE_INSTRUCTOR: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.id]: {
            isFetching: false,
            ...action.data,
          }
        }
      }
    }
    case actionTypes.REQUEST_INSTRUCTOR_SEARCH: {
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
    case actionTypes.RECEIVE_INSTRUCTOR_SEARCH: {
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