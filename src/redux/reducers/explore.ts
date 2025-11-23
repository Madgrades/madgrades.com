import * as actionTypes from '../actionTypes';
import { ExploreState, ReduxAction } from '../../types';

interface ExploreAction extends ReduxAction {
  params?: unknown;
  data?: unknown;
}

const initialState: ExploreState = {
  courses: {},
  instructors: {},
  subjects: {},
};

export default function reducer(state = initialState, action: ExploreAction): ExploreState {
  switch (action.type) {
    case actionTypes.REQUEST_EXPLORE_COURSES:
      return {
        ...state,
        courses: {
          params: action.params,
          isFetching: true,
        },
      };
    case actionTypes.RECEIVE_EXPLORE_COURSES:
      return {
        ...state,
        courses: {
          params: action.params,
          isFetching: false,
          data: action.data as { results: unknown[]; total_count: number; total_pages: number },
        },
      };
    case actionTypes.REQUEST_EXPLORE_INSTRUCTORS:
      return {
        ...state,
        instructors: {
          params: action.params,
          isFetching: true,
        },
      };
    case actionTypes.RECEIVE_EXPLORE_INSTRUCTORS:
      return {
        ...state,
        instructors: {
          params: action.params,
          isFetching: false,
          data: action.data as { results: unknown[]; total_count: number; total_pages: number },
        },
      };
    case actionTypes.REQUEST_EXPLORE_SUBJECTS:
      return {
        ...state,
        subjects: {
          params: action.params,
          isFetching: true,
        },
      };
    case actionTypes.RECEIVE_EXPLORE_SUBJECTS:
      return {
        ...state,
        subjects: {
          params: action.params,
          isFetching: false,
          data: action.data as { results: unknown[]; total_count: number; total_pages: number },
        },
      };
    default: {
      return state;
    }
  }
}
