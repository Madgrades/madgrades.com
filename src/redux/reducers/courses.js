import * as actionTypes from "../actionTypes";

const initialState = {
  data: {}
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
            response: action.data
          }
        }
      }
    }
    default: {
      return state
    }
  }
}