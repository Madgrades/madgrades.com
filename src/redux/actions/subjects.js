import * as actionTypes from "../actionTypes";

const requestSubject = (code) => {
  return {
    type: actionTypes.REQUEST_SUBJECT,
    code
  }
};

const receiveSubject = (code, data) => {
  return {
    type: actionTypes.RECEIVE_SUBJECT,
    code,
    data
  }
};

export const fetchSubject = (code) => async (dispatch, getState, api) => {
  const state = getState();
  let subjectData = state.subjects.data[code];

  // don't fetch again
  if (subjectData)
    return;

  // request action
  dispatch(requestSubject(code));

  // perform request
  subjectData = await api.getSubject(code);

  // receive action
  dispatch(receiveSubject(code, subjectData));
};


const requestSubjectSearch = (query, page) => {
  return {
    type: actionTypes.REQUEST_SUBJECT_SEARCH,
    query,
    page
  }
};

const receiveSubjectSearch = (query, page, data) => {
  return {
    type: actionTypes.RECEIVE_SUBJECT_SEARCH,
    query,
    page,
    data
  }
};

export const fetchSubjectSearch = (query, page) => async (dispatch, getState, api) => {
  const state = getState();
  let subjectSearchData = state.courses.searches[query];

  // don't fetch again
  if (subjectSearchData)
    return;

  // request action
  dispatch(requestSubjectSearch(query, page));

  // perform request
  subjectSearchData = await api.searchSubjects(query, page);

  // receive action
  dispatch(receiveSubjectSearch(query, page, subjectSearchData));
};