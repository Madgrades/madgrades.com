import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isEqual } from 'lodash';
import type { RootState } from '../index';

// Define types
interface ExploreParams {
  [key: string]: any;
}

interface ExploreData {
  params: ExploreParams;
  isFetching: boolean;
  data?: any;
}

interface ExploreState {
  courses: ExploreData;
  instructors: ExploreData;
  subjects: ExploreData;
}

// Initial state
const initialState: ExploreState = {
  courses: {
    params: {},
    isFetching: false,
  },
  instructors: {
    params: {},
    isFetching: false,
  },
  subjects: {
    params: {},
    isFetching: false,
  },
};

// Async thunks
export const fetchExploreCourses = createAsyncThunk<
  { params: ExploreParams; data: any },
  ExploreParams,
  { state: RootState; extra: any }
>('explore/fetchExploreCourses', async (params, { getState, extra: api }) => {
  const state = getState();

  // Don't fetch if params are the same
  if (isEqual(state.explore.courses.params, params) && state.explore.courses.data) {
    return { params, data: state.explore.courses.data };
  }

  const data = await api.exploreCourses(params);
  return { params, data };
});

export const fetchExploreInstructors = createAsyncThunk<
  { params: ExploreParams; data: any },
  ExploreParams,
  { state: RootState; extra: any }
>('explore/fetchExploreInstructors', async (params, { getState, extra: api }) => {
  const state = getState();

  // Don't fetch if params are the same
  if (isEqual(state.explore.instructors.params, params) && state.explore.instructors.data) {
    return { params, data: state.explore.instructors.data };
  }

  const data = await api.exploreInstructors(params);
  return { params, data };
});

export const fetchExploreSubjects = createAsyncThunk<
  { params: ExploreParams; data: any },
  ExploreParams,
  { state: RootState; extra: any }
>('explore/fetchExploreSubjects', async (params, { getState, extra: api }) => {
  const state = getState();

  // Don't fetch if params are the same
  if (isEqual(state.explore.subjects.params, params) && state.explore.subjects.data) {
    return { params, data: state.explore.subjects.data };
  }

  const data = await api.exploreSubjects(params);
  return { params, data };
});

// Slice
const exploreSlice = createSlice({
  name: 'explore',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchExploreCourses
      .addCase(fetchExploreCourses.pending, (state, action) => {
        state.courses.isFetching = true;
        state.courses.params = action.meta.arg;
      })
      .addCase(fetchExploreCourses.fulfilled, (state, action) => {
        state.courses.isFetching = false;
        state.courses.params = action.payload.params;
        state.courses.data = action.payload.data;
      })
      .addCase(fetchExploreCourses.rejected, (state) => {
        state.courses.isFetching = false;
      })
      // fetchExploreInstructors
      .addCase(fetchExploreInstructors.pending, (state, action) => {
        state.instructors.isFetching = true;
        state.instructors.params = action.meta.arg;
      })
      .addCase(fetchExploreInstructors.fulfilled, (state, action) => {
        state.instructors.isFetching = false;
        state.instructors.params = action.payload.params;
        state.instructors.data = action.payload.data;
      })
      .addCase(fetchExploreInstructors.rejected, (state) => {
        state.instructors.isFetching = false;
      })
      // fetchExploreSubjects
      .addCase(fetchExploreSubjects.pending, (state, action) => {
        state.subjects.isFetching = true;
        state.subjects.params = action.meta.arg;
      })
      .addCase(fetchExploreSubjects.fulfilled, (state, action) => {
        state.subjects.isFetching = false;
        state.subjects.params = action.payload.params;
        state.subjects.data = action.payload.data;
      })
      .addCase(fetchExploreSubjects.rejected, (state) => {
        state.subjects.isFetching = false;
      });
  },
});

// Export selectors
export const selectExploreCourses = (state: RootState) => state.explore.courses;
export const selectExploreInstructors = (state: RootState) => state.explore.instructors;
export const selectExploreSubjects = (state: RootState) => state.explore.subjects;

// Export reducer
export default exploreSlice.reducer;
