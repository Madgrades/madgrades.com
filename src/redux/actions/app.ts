import * as actionTypes from '../actionTypes';
import { CourseFilterParams, Term, RootState } from '../../types';
import { Dispatch } from 'redux';
import { Api } from '../../utils/api';

export const setCourseFilterParams = (params: CourseFilterParams) => {
  return {
    type: actionTypes.SET_COURSE_FILTER_PARAMS,
    params,
  };
};

const receiveTerms = (termsData: Term[]) => {
  return {
    type: actionTypes.RECEIVE_TERMS,
    terms: termsData,
  };
};

export const fetchTerms = () => async (dispatch: Dispatch, getState: () => RootState, api: Api) => {
  const state = getState();
  const termsData = state.app.terms;

  // don't fetch again
  if (termsData && termsData.length > 0) {return;}

  // perform request
  const terms = await api.getTerms();

  // receive action
  dispatch(receiveTerms(terms));
};
