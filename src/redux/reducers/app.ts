import * as actionTypes from '../actionTypes';
import { AppState, CourseFilterParams, Term, ReduxAction } from '../../types';

interface AppAction extends ReduxAction {
  query?: string;
  params?: Partial<CourseFilterParams>;
  terms?: Term[];
}

const initialState: AppState = {
  searchQuery: '',
  courseFilterParams: {
    subjects: undefined,
    instructors: undefined,
    sort: undefined,
    order: undefined,
  },
  terms: [],
};

export default function reducer(state = initialState, action: AppAction): AppState {
  switch (action.type) {
    case actionTypes.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.query ?? '',
      };
    case actionTypes.SET_COURSE_FILTER_PARAMS:
      return {
        ...state,
        courseFilterParams: {
          ...state.courseFilterParams,
          ...action.params,
        },
      };
    case actionTypes.RECEIVE_TERMS:
      return {
        ...state,
        terms: action.terms,
      };
    default: {
      return state;
    }
  }
}
