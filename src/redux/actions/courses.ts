import * as actionTypes from '../actionTypes';
import * as _ from 'lodash';

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

const requestCourseSearch = (params, page) => {
  return {
    type: actionTypes.REQUEST_COURSE_SEARCH,
    params,
    page
  }
};

const receiveCourseSearch = (params, page, data) => {
  return {
    type: actionTypes.RECEIVE_COURSE_SEARCH,
    params,
    page,
    data
  }
};

export const fetchCourseSearch = (params, page) => async (dispatch, getState, api) => {
  const state = getState();
  let searchData = state.courses.search;

  // if params are the same, we don't need to fetch
  if (_.isEqual(searchData.params, params))
    return;

  // request action
  dispatch(requestCourseSearch(params, page));

  // perform request
  searchData = await api.filterCourses(params, page);

  // receive action
  dispatch(receiveCourseSearch(params, page, searchData));
};
