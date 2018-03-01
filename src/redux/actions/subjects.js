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


const requestCourseSearch = (query, page) => {
  return {
    type: actionTypes.REQUEST_COURSE_SEARCH,
    query,
    page
  }
};

const receiveCourseSearch = (query, page, data) => {
  return {
    type: actionTypes.RECEIVE_COURSE_SEARCH,
    query,
    page,
    data
  }
};

export const fetchCourseSearch = (query, page) => async (dispatch, getState, api) => {
  const state = getState();
  let courseSearchData = state.courses.searches[query];

  // don't fetch again
  if (courseSearchData)
    return;

  // request action
  dispatch(requestCourseSearch(query, page));

  // perform request
  courseSearchData = await api.searchCourses(query, page);

  // receive action
  dispatch(receiveCourseSearch(query, page, courseSearchData));
};