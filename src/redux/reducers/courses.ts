import * as actionTypes from '../actionTypes';
import { CoursesState, Course, CourseFilterParams, ReduxAction } from '../../types';

interface CoursesAction extends ReduxAction {
  uuid?: string;
  data?: Course | { totalCount: number; results: Course[] };
  params?: CourseFilterParams;
  page?: number;
}

const initialState: CoursesState = {
  data: {},
  search: {
    pages: {}
  },
  grades: {}
};

export default function reducer(state = initialState, action: CoursesAction): CoursesState {
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
        search: {
          params: action.params,
          isFetching: true
        }
      }
    }
    case actionTypes.RECEIVE_COURSE_SEARCH: {
      return {
        ...state,
        search: {
          params: action.params,
          isFetching: false,
          pages: {
            [action.page]: {
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