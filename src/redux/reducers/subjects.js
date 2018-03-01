import * as actionTypes from "../actionTypes";

const initialState = {
  data: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_SUBJECT: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.code]: {
            isFetching: true
          }
        }
      }
    }
    case actionTypes.RECEIVE_SUBJECT: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.code]: {
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