import * as actionTypes from '../actionTypes';
import { CourseFilterParams, Term } from '../../types';
import { Dispatch } from 'redux';

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

export const fetchTerms = () => async (dispatch: Dispatch, getState: any, api: any) => {
  const state = getState();
  const termsData = state.terms;

  // don't fetch again
  if (termsData) return;

  // perform request
  const terms = await api.getTerms();

  // receive action
  dispatch(receiveTerms(terms));
};