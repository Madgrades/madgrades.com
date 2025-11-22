import * as actionTypes from '../actionTypes';
import { Dispatch } from 'redux';
import { Subject } from '../../types';

const requestSubject = (code: string) => {
  return {
    type: actionTypes.REQUEST_SUBJECT,
    code,
  };
};

const receiveSubject = (code: string, data: Subject) => {
  return {
    type: actionTypes.RECEIVE_SUBJECT,
    code,
    data,
  };
};

export const fetchSubject =
  (code: string) =>
  async (dispatch: Dispatch, getState: () => any, api: any): Promise<void> => {
    const state = getState();
    const subjectData: Subject | undefined = state.subjects.data[code];

    // don't fetch again
    if (subjectData) return;

    // request action
    dispatch(requestSubject(code));

    // perform request
    const newSubjectData: Subject = await api.getSubject(code);

    // receive action
    dispatch(receiveSubject(code, newSubjectData));
  };

const requestSubjectSearch = (query: string, page: number) => {
  return {
    type: actionTypes.REQUEST_SUBJECT_SEARCH,
    query,
    page,
  };
};

interface SubjectSearchResult {
  totalCount: number;
  results: Subject[];
}

const receiveSubjectSearch = (query: string, page: number, data: SubjectSearchResult) => {
  return {
    type: actionTypes.RECEIVE_SUBJECT_SEARCH,
    query,
    page,
    data,
  };
};

export const fetchSubjectSearch =
  (query: string, page: number) =>
  async (dispatch: Dispatch, getState: () => any, api: any): Promise<void> => {
    const state = getState();
    const subjectSearchData = state.subjects.searches[query];

    // don't fetch again
    if (subjectSearchData) return;

    // request action
    dispatch(requestSubjectSearch(query, page));

    // perform request
    const newSubjectSearchData: SubjectSearchResult = await api.searchSubjects(query, page);

    // receive action
    dispatch(receiveSubjectSearch(query, page, newSubjectSearchData));

    const { results } = newSubjectSearchData;

    results.forEach((subject) => {
      dispatch(receiveSubject(subject.code, subject));
    });
  };