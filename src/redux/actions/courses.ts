import * as actionTypes from '../actionTypes';
import * as _ from 'lodash';
import { Dispatch } from 'redux';
import { Course, CourseFilterParams, RootState } from '../../types';
import { Api } from '../../utils/api';

const requestCourse = (uuid: string) => {
  return {
    type: actionTypes.REQUEST_COURSE,
    uuid,
  };
};

const receiveCourse = (uuid: string, data: Course) => {
  return {
    type: actionTypes.RECEIVE_COURSE,
    uuid,
    data,
  };
};

export const fetchCourse =
  (uuid: string) =>
  async (dispatch: Dispatch, getState: () => RootState, api: Api): Promise<void> => {
    const state = getState();
    const courseData = state.courses.data[uuid];

    // don't fetch again - check if data exists by checking a property
    if (courseData.uuid) {
      return;
    }

    // request action
    dispatch(requestCourse(uuid));

    // perform request
    const newCourseData: Course = await api.getCourse(uuid);

    // receive action
    dispatch(receiveCourse(uuid, newCourseData));
  };

const requestCourseSearch = (params: CourseFilterParams, page: number) => {
  return {
    type: actionTypes.REQUEST_COURSE_SEARCH,
    params,
    page,
  };
};

interface CourseSearchResult {
  totalCount: number;
  results: string[];
}

const receiveCourseSearch = (
  params: CourseFilterParams,
  page: number,
  data: CourseSearchResult
) => {
  return {
    type: actionTypes.RECEIVE_COURSE_SEARCH,
    params,
    page,
    data,
  };
};

export const fetchCourseSearch =
  (params: CourseFilterParams, page: number) =>
  async (dispatch: Dispatch, getState: () => RootState, api: Api): Promise<void> => {
    const state = getState();
    const searchData = state.courses.search;

    // if params are the same, we don't need to fetch
    if (_.isEqual(searchData.params, params)) {
      return;
    }

    // request action
    dispatch(requestCourseSearch(params, page));

    // perform request
    const newSearchData: CourseSearchResult = await api.filterCourses(params, page);

    // receive action
    dispatch(receiveCourseSearch(params, page, newSearchData));
  };
