import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isEqual } from 'lodash';
import type { Course, Instructor, Subject, ExploreParams, PagedResponse, MadgradesApi } from '../../types/api';

interface ExploreState {
  courses: {
    params?: ExploreParams;
    isFetching?: boolean;
    data?: PagedResponse<Course>;
  };
  instructors: {
    params?: ExploreParams;
    isFetching?: boolean;
    data?: PagedResponse<Instructor>;
  };
  subjects: {
    params?: ExploreParams;
    isFetching?: boolean;
    data?: PagedResponse<Subject>;
  };
}

const initialState: ExploreState = {
  courses: {},
  instructors: {},
  subjects: {},
};

// Async thunk for exploring courses
export const fetchExploreCourses = createAsyncThunk<
  { params: ExploreParams; data: PagedResponse<Course> },
  ExploreParams,
  { state: { explore: ExploreState }; extra: MadgradesApi }
>('explore/fetchExploreCourses', async (params, { getState, extra: api }) => {
  const state = getState();

  // Don't fetch if params are the same
  if (isEqual(state.explore.courses.params, params) && state.explore.courses.data) {
    return { params, data: state.explore.courses.data };
  }

  const data = await api.exploreCourses(params);
  return { params, data };
});

// Async thunk for exploring instructors
export const fetchExploreInstructors = createAsyncThunk<
  { params: ExploreParams; data: PagedResponse<Instructor> },
  ExploreParams,
  { state: { explore: ExploreState }; extra: MadgradesApi }
>('explore/fetchExploreInstructors', async (params, { getState, extra: api }) => {
  const state = getState();

  // Don't fetch if params are the same
  if (isEqual(state.explore.instructors.params, params) && state.explore.instructors.data) {
    return { params, data: state.explore.instructors.data };
  }

  const data = await api.exploreInstructors(params);
  return { params, data };
});

// Async thunk for exploring subjects
export const fetchExploreSubjects = createAsyncThunk<
  { params: ExploreParams; data: PagedResponse<Subject> },
  ExploreParams,
  { state: { explore: ExploreState }; extra: MadgradesApi }
>('explore/fetchExploreSubjects', async (params, { getState, extra: api }) => {
  const state = getState();

  // Don't fetch if params are the same
  if (isEqual(state.explore.subjects.params, params) && state.explore.subjects.data) {
    return { params, data: state.explore.subjects.data };
  }

  const data = await api.exploreSubjects(params);
  return { params, data };
});

const exploreSlice = createSlice({
  name: 'explore',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExploreCourses.pending, (state, action) => {
        state.courses.params = action.meta.arg;
        state.courses.isFetching = true;
      })
      .addCase(fetchExploreCourses.fulfilled, (state, action) => {
        const { params, data } = action.payload;
        state.courses.params = params;
        state.courses.isFetching = false;
        state.courses.data = data;
      })
      .addCase(fetchExploreInstructors.pending, (state, action) => {
        state.instructors.params = action.meta.arg;
        state.instructors.isFetching = true;
      })
      .addCase(fetchExploreInstructors.fulfilled, (state, action) => {
        const { params, data } = action.payload;
        state.instructors.params = params;
        state.instructors.isFetching = false;
        state.instructors.data = data;
      })
      .addCase(fetchExploreSubjects.pending, (state, action) => {
        state.subjects.params = action.meta.arg;
        state.subjects.isFetching = true;
      })
      .addCase(fetchExploreSubjects.fulfilled, (state, action) => {
        const { params, data } = action.payload;
        state.subjects.params = params;
        state.subjects.isFetching = false;
        state.subjects.data = data;
      });
  },
});

export default exploreSlice.reducer;
