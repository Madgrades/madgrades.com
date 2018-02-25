import * as actionTypes from "../actionTypes";

const initialState = {
  courses: {
    data: {}
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_COURSE_GRADES: {
      return {
        ...state,
        courses: {
          data: {
            ...state.courses.data,
            [action.uuid]: {
              isFetching: true
            }
          }
        }
      }
    }
    case actionTypes.RECEIVE_COURSE_GRADES: {
      return {
        ...state,
        courses: {
          data: {
            ...state.courses.data,
            [action.uuid]: {
              isFetching: false,
              response: action.data
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