import * as actionTypes from "../actionTypes";

const initialState = {
  courses: {
    data: {}
  },
  instructors: {
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
              ...action.data
            }
          }
        }
      }
    }
    case actionTypes.REQUEST_INSTRUCTOR_GRADES: {
      return {
        ...state,
        instructors: {
          data: {
            ...state.instructors.data,
            [action.id]: {
              isFetching: true
            }
          }
        }
      }
    }
    case actionTypes.RECEIVE_INSTRUCTOR_GRADES: {
      return {
        ...state,
        instructors: {
          data: {
            ...state.instructors.data,
            [action.id]: {
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