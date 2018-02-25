import * as actionTypes from "../actionTypes";

const requestCourseGrades = (uuid) => {
  return {
    type: actionTypes.REQUEST_COURSE_GRADES,
    uuid
  }
};

const receiveCourseGrades = (uuid, data) => {
  return {
    type: actionTypes.RECEIVE_COURSE_GRADES,
    uuid,
    data
  }
};

export const fetchCourseGrades = (uuid) => async (dispatch, getState, api) => {
  const state = getState();
  let gradesData = state.grades.courses.data[uuid];

  // don't fetch again
  if (gradesData)
    return;

  // request action
  dispatch(requestCourseGrades(uuid));

  // perform request
  gradesData = await api.getCourseGrades(uuid);

  // receive action
  dispatch(receiveCourseGrades(uuid, gradesData));
};