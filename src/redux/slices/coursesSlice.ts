import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isEqual } from 'lodash';
import type { Course, CourseFilterParams, PagedResponse, MadgradesApi } from '../../types/api';

interface CourseData extends Course {
  isFetching?: boolean;
}

interface CoursesState {
  data: Record<string, CourseData>;
  search: {
    params: CourseFilterParams;
    isFetching?: boolean;
    pages: Record<number, PagedResponse<Course>>;
  };
}

const initialState: CoursesState = {
  data: {},
  search: {
    params: {},
    pages: {},
  },
};

// Async thunk for fetching a single course
export const fetchCourse = createAsyncThunk<
  { uuid: string; data: Course },
  string,
  { state: { courses: CoursesState }; extra: MadgradesApi }
>('courses/fetchCourse', async (uuid, { getState, extra: api }) => {
  const state = getState();
  const courseData = state.courses.data[uuid];

  // Don't fetch if we already have the course data
  if (courseData && !courseData.isFetching) {
    return { uuid, data: courseData };
  }

  const data = await api.getCourse(uuid);
  return { uuid, data };
});

// Async thunk for fetching course search results
export const fetchCourseSearch = createAsyncThunk<
  { params: CourseFilterParams; page: number; data: PagedResponse<Course> },
  { params: CourseFilterParams; page: number },
  { state: { courses: CoursesState }; extra: MadgradesApi }
>('courses/fetchCourseSearch', async ({ params, page }, { getState, extra: api }) => {
  const state = getState();
  const searchData = state.courses.search;

  // If params are the same, we don't need to fetch
  if (isEqual(searchData.params, params)) {
    // Return cached data if available
    const cachedPage = searchData.pages[page];
    if (cachedPage) {
      return { params, page, data: cachedPage };
    }
  }

  const data = await api.filterCourses(params, page);
  return { params, page, data };
});

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourse.pending, (state, action) => {
        const uuid = action.meta.arg;
        state.data[uuid] = {
          ...state.data[uuid],
          isFetching: true,
        } as CourseData;
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        const { uuid, data } = action.payload;
        state.data[uuid] = {
          ...data,
          isFetching: false,
        };
      })
      .addCase(fetchCourseSearch.pending, (state, action) => {
        const { params } = action.meta.arg;
        state.search.params = params;
        state.search.isFetching = true;
      })
      .addCase(fetchCourseSearch.fulfilled, (state, action) => {
        const { params, page, data } = action.payload;
        state.search.params = params;
        state.search.isFetching = false;
        state.search.pages[page] = data;
      });
  },
});

export default coursesSlice.reducer;
