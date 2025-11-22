import * as actionTypes from '../actionTypes';
import { Dispatch } from 'redux';
import { Instructor } from '../../types';

const requestInstructor = (id: number) => {
  return {
    type: actionTypes.REQUEST_INSTRUCTOR,
    id,
  };
};

const receiveInstructor = (id: string, data: Instructor) => {
  return {
    type: actionTypes.RECEIVE_INSTRUCTOR,
    id,
    data,
  };
};

export const fetchInstructor =
  (id: number) =>
  async (dispatch: Dispatch, getState: () => any, api: any): Promise<void> => {
    dispatch(requestInstructor(id));
    const response: Instructor = await api.getInstructor(id);
    dispatch(receiveInstructor(id.toString(), response));
  };

const requestInstructorSearch = (query: string, page: number) => {
  return {
    type: actionTypes.REQUEST_INSTRUCTOR_SEARCH,
    query,
    page,
  };
};

interface InstructorSearchResult {
  totalCount: number;
  results: Instructor[];
}

const receiveInstructorSearch = (query: string, page: number, data: InstructorSearchResult) => {
  return {
    type: actionTypes.RECEIVE_INSTRUCTOR_SEARCH,
    query,
    page,
    data,
  };
};

export const fetchInstructorSearch =
  (query: string, page: number) =>
  async (dispatch: Dispatch, getState: () => any, api: any): Promise<void> => {
    const state = getState();
    const instructorSearchData = state.instructors.searches[query];

    // don't fetch again
    if (instructorSearchData) return;

    // request action
    dispatch(requestInstructorSearch(query, page));

    // perform request
    const newInstructorSearchData: InstructorSearchResult = await api.searchInstructors(query, page);

    // receive action
    dispatch(receiveInstructorSearch(query, page, newInstructorSearchData));

    const { results } = newInstructorSearchData;

    results.forEach((instructor) => {
      dispatch(receiveInstructor(instructor.id.toString(), instructor));
    });
  };