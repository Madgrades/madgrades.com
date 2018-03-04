import * as actionTypes from "../actionTypes";

const requestInstructor = (id) => {
  return {
    type: actionTypes.REQUEST_INSTRUCTOR,
    id
  }
};

const receiveInstructor = (id, data) => {
  return {
    type: actionTypes.RECEIVE_INSTRUCTOR,
    id,
    data
  }
};

export const fetchInstructor = (id) => async (dispatch, getState, api) => {
  dispatch(requestInstructor(id));
  let response = await api.getInstructor(id);
  dispatch(receiveInstructor(id, response));
};


const requestInstructorSearch = (query, page) => {
  return {
    type: actionTypes.REQUEST_INSTRUCTOR_SEARCH,
    query,
    page
  }
};

const receiveInstructorSearch = (query, page, data) => {
  return {
    type: actionTypes.RECEIVE_INSTRUCTOR_SEARCH,
    query,
    page,
    data
  }
};

export const fetchInstructorSearch = (query, page) => async (dispatch, getState, api) => {
  const state = getState();
  let instructorSearchData = state.instructors.searches[query];

  // don't fetch again
  if (instructorSearchData)
    return;

  // request action
  dispatch(requestInstructorSearch(query, page));

  // perform request
  instructorSearchData = await api.searchInstructors(query, page);

  // receive action
  dispatch(receiveInstructorSearch(query, page, instructorSearchData));
};