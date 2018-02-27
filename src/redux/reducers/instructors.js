import * as actionTypes from "../actionTypes";

const initialState = {
  data: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_INSTRUCTOR: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.id]: {
            isFetching: true
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
            ...action.data
          }
        }
      }
    }
    default: {
      return state
    }
  }
}