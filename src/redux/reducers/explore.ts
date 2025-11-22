import * as actionTypes from '../actionTypes';

const initialState = {
  courses: {

  },
  instructors: {

  },
  subjects: {

  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_EXPLORE_COURSES:
      return {
        ...state,
        courses: {
          params: action.params,
          isFetching: true
        }
      };
    case actionTypes.RECEIVE_EXPLORE_COURSES:
      return {
        ...state,
        courses: {
          params: action.params,
          isFetching: false,
          data: action.data
        }
      };
    case actionTypes.REQUEST_EXPLORE_INSTRUCTORS:
      return {
        ...state,
        instructors: {
          params: action.params,
          isFetching: true
        }
      };
    case actionTypes.RECEIVE_EXPLORE_INSTRUCTORS:
      return {
        ...state,
        instructors: {
          params: action.params,
          isFetching: false,
          data: action.data
        }
      };
    case actionTypes.REQUEST_EXPLORE_SUBJECTS:
      return {
        ...state,
        subjects: {
          params: action.params,
          isFetching: true
        }
      };
    case actionTypes.RECEIVE_EXPLORE_SUBJECTS:
      return {
        ...state,
        subjects: {
          params: action.params,
          isFetching: false,
          data: action.data
        }
      };
    default: {
      return state
    }
  }
}