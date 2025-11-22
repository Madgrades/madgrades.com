import * as actionTypes from '../actionTypes';
import { InstructorsState, Instructor, ReduxAction } from '../../types';

interface InstructorsAction extends ReduxAction {
  id?: number;
  data?: Instructor | { totalCount: number; results: Instructor[] };
  query?: string;
  page?: number;
}

const initialState: InstructorsState = {
  data: {},
  search: {
    pages: {}
  }
};

export default function reducer(state = initialState, action: InstructorsAction): InstructorsState {
  switch (action.type) {
    case actionTypes.REQUEST_INSTRUCTOR: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.id]: {
            isFetching: true,
            id: parseInt(action.id, 10)
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
            ...action.data,
          }
        }
      }
    }
    case actionTypes.REQUEST_INSTRUCTOR_SEARCH: {
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
    case actionTypes.RECEIVE_INSTRUCTOR_SEARCH: {
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