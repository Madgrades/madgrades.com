import * as actionTypes from '../actionTypes';
import { SubjectsState, Subject, ReduxAction } from '../../types';

interface SubjectsAction extends ReduxAction {
  code?: string;
  data?: Subject | { totalCount: number; results: Subject[] };
  query?: string;
  page?: number;
}

const initialState: SubjectsState = {
  data: {},
  search: {
    pages: {}
  }
};

export default function reducer(state = initialState, action: SubjectsAction): SubjectsState {
  switch (action.type) {
    case actionTypes.REQUEST_SUBJECT: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.code]: {
            isFetching: true,
            code: action.code
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
    case actionTypes.REQUEST_SUBJECT_SEARCH: {
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
    case actionTypes.RECEIVE_SUBJECT_SEARCH: {
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