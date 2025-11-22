import * as actionTypes from '../actionTypes';
import { GradesState, ReduxAction } from '../../types';

interface GradesAction extends ReduxAction {
  uuid?: string;
  id?: number;
  data?: unknown;
}

const initialState: GradesState = {
  courses: {
    data: {}
  },
  instructors: {
    data: {}
  }
};

export default function reducer(state = initialState, action: GradesAction): GradesState {
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