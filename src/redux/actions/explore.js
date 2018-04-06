import * as actionTypes from '../actionTypes';
import _ from 'lodash';

const requestExploreCourses = (params) => {
  return {
    type: actionTypes.REQUEST_EXPLORE_COURSES,
    params
  }
};

const receiveExploreCourses = (params, data) => {
  return {
    type: actionTypes.RECEIVE_EXPLORE_COURSES,
    params,
    data
  }
};

export const fetchExploreCourses = (params) => async (dispatch, getState, api) => {
  const state = getState();

  // don't fetch again
  if (_.isEqual(state.explore.courses.params, params))
    return;

  // request action
  dispatch(requestExploreCourses(params));

  // perform request
  const courseData = await api.exploreCourses(params);

  // receive action
  dispatch(receiveExploreCourses(params, courseData));
};


const requestExploreInstructors = (params) => {
  return {
    type: actionTypes.REQUEST_EXPLORE_INSTRUCTORS,
    params
  }
};

const receiveExploreInstructors = (params, data) => {
  return {
    type: actionTypes.RECEIVE_EXPLORE_INSTRUCTORS,
    params,
    data
  }
};

export const fetchExploreInstructors = (params) => async (dispatch, getState, api) => {
  const state = getState();

  // don't fetch again
  if (_.isEqual(state.explore.instructors.params, params))
    return;

  // request action
  dispatch(requestExploreInstructors(params));

  // perform request
  const courseData = await api.exploreInstructors(params);

  // receive action
  dispatch(receiveExploreInstructors(params, courseData));
};

const requestExploreSubjects = (params) => {
  return {
    type: actionTypes.REQUEST_EXPLORE_SUBJECTS,
    params
  }
};

const receiveExploreSubjects = (params, data) => {
  return {
    type: actionTypes.RECEIVE_EXPLORE_SUBJECTS,
    params,
    data
  }
};

export const fetchExploreSubjects = (params) => async (dispatch, getState, api) => {
  const state = getState();

  // don't fetch again
  if (_.isEqual(state.explore.subjects.params, params))
    return;

  // request action
  dispatch(requestExploreSubjects(params));

  // perform request
  const courseData = await api.exploreSubjects(params);

  // receive action
  dispatch(receiveExploreSubjects(params, courseData));
};