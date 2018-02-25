import * as actionTypes from "../actionTypes";

const requestInstructor = (id) => {
  return {
    type: actionTypes.REQUEST_INSTRUCTOR,
    id
  }
};

const receiveInstructor = (uuid, data) => {
  return {
    type: actionTypes.RECEIVE_INSTRUCTOR,
    id,
    data
  }
};

export const fetchCourse = (id) => async (dispatch, getState, api) => {
  dispatch(requestInstructor(id));
  let response = await api.getInstructor(id);
  dispatch(receiveInstructor(uuid, response));
};