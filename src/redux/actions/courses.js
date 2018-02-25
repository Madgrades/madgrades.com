import * as actionTypes from "../actionTypes";

const requestCourse = (uuid) => {
  return {
    type: actionTypes.REQUEST_COURSE,
    uuid
  }
};

const receiveCourse = (uuid, data) => {
  return {
    type: actionTypes.RECEIVE_COURSE,
    uuid,
    data
  }
};

export const fetchCourse = (uuid) => async (dispatch, getState, api) => {
  const state = getState();
  let courseData = state.courses.data[uuid];

  // don't fetch again
  if (courseData)
    return;

  // request action
  dispatch(requestCourse(uuid));

  // perform request
  courseData = await api.getCourse(uuid);

  // receive action
  dispatch(receiveCourse(uuid, courseData));
};