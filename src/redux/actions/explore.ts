import * as actionTypes from '../actionTypes';
import _ from 'lodash';
import { Dispatch } from 'redux';

interface ExploreParams {
  sort?: string;
  order?: string;
  minCountAvg?: number;
  minGpaTotal?: number;
  [key: string]: any;
}

const requestExploreCourses = (params: ExploreParams) => {
  return {
    type: actionTypes.REQUEST_EXPLORE_COURSES,
    params,
  };
};

const receiveExploreCourses = (params: ExploreParams, data: any) => {
  return {
    type: actionTypes.RECEIVE_EXPLORE_COURSES,
    params,
    data,
  };
};

export const fetchExploreCourses =
  (params: ExploreParams) =>
  async (dispatch: Dispatch, getState: () => any, api: any): Promise<void> => {
    const state = getState();

    // don't fetch again
    if (_.isEqual(state.explore.courses.params, params)) return;

    // request action
    dispatch(requestExploreCourses(params));

    // perform request
    const courseData = await api.exploreCourses(params);

    // receive action
    dispatch(receiveExploreCourses(params, courseData));
  };

const requestExploreInstructors = (params: ExploreParams) => {
  return {
    type: actionTypes.REQUEST_EXPLORE_INSTRUCTORS,
    params,
  };
};

const receiveExploreInstructors = (params: ExploreParams, data: any) => {
  return {
    type: actionTypes.RECEIVE_EXPLORE_INSTRUCTORS,
    params,
    data,
  };
};

export const fetchExploreInstructors =
  (params: ExploreParams) =>
  async (dispatch: Dispatch, getState: () => any, api: any): Promise<void> => {
    const state = getState();

    // don't fetch again
    if (_.isEqual(state.explore.instructors.params, params)) return;

    // request action
    dispatch(requestExploreInstructors(params));

    // perform request
    const instructorData = await api.exploreInstructors(params);

    // receive action
    dispatch(receiveExploreInstructors(params, instructorData));
  };

const requestExploreSubjects = (params: ExploreParams) => {
  return {
    type: actionTypes.REQUEST_EXPLORE_SUBJECTS,
    params,
  };
};

const receiveExploreSubjects = (params: ExploreParams, data: any) => {
  return {
    type: actionTypes.RECEIVE_EXPLORE_SUBJECTS,
    params,
    data,
  };
};

export const fetchExploreSubjects =
  (params: ExploreParams) =>
  async (dispatch: Dispatch, getState: () => any, api: any): Promise<void> => {
    const state = getState();

    // don't fetch again
    if (_.isEqual(state.explore.subjects.params, params)) return;

    // request action
    dispatch(requestExploreSubjects(params));

    // perform request
    const subjectData = await api.exploreSubjects(params);

    // receive action
    dispatch(receiveExploreSubjects(params, subjectData));
  };