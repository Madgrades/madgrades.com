import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { isEqual } from 'lodash';
import type { RootState } from '../index';

// Define types
interface Course {
  uuid: string;
  name: string;
  number: number;
  credits: number;
  // Add other course properties as needed
  [key: string]: any;
}

interface CourseData {
  isFetching: boolean;
  data?: Course;
}

interface SearchParams {
  query?: string;
  subjects?: string | string[];
  instructors?: string | string[];
  sort?: string;
  order?: 'asc' | 'desc';
}

interface SearchResult {
  results: Course[];
  total: number;
  page: number;
  perPage: number;
}

interface CoursesState {
  data: Record<string, CourseData>;
  search: {
    params: SearchParams;
    isFetching: boolean;
    pages: Record<number, SearchResult>;
  };
}

// Initial state
const initialState: CoursesState = {
  data: {},
  search: {
    params: {},
    isFetching: false,
    pages: {},
  },
};

// Async thunks
export const fetchCourse = createAsyncThunk<
  Course,
  string,
  { state: RootState; extra: any }
>('courses/fetchCourse', async (uuid, { getState, extra: api }) => {
  const state = getState();
  const courseData = state.courses.data[uuid];

  // Don't fetch if already loaded or loading
  if (courseData?.data || courseData?.isFetching) {
    return courseData.data as Course;
  }

  const data = await api.getCourse(uuid);
  return data;
});

export const fetchCourseSearch = createAsyncThunk<
  { data: SearchResult; params: SearchParams; page: number },
  { params: SearchParams; page: number },
  { state: RootState; extra: any }
>(
  'courses/fetchCourseSearch',
  async ({ params, page }, { getState, extra: api }) => {
    const state = getState();
    const searchData = state.courses.search;

    // If params are the same, don't fetch again
    if (isEqual(searchData.params, params) && searchData.pages[page]) {
      return { data: searchData.pages[page] as SearchResult, params, page };
    }

    const data = await api.filterCourses(params, page);
    return { data, params, page };
  }
);

// Slice
const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchCourse
      .addCase(fetchCourse.pending, (state, action) => {
        const uuid = action.meta.arg;
        state.data[uuid] = {
          isFetching: true,
        };
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        const uuid = action.meta.arg;
        state.data[uuid] = {
          isFetching: false,
          data: action.payload,
        };
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        const uuid = action.meta.arg;
        if (state.data[uuid]) {
          state.data[uuid].isFetching = false;
        }
      })
      // fetchCourseSearch
      .addCase(fetchCourseSearch.pending, (state, action) => {
        state.search.isFetching = true;
        state.search.params = action.meta.arg.params;
      })
      .addCase(fetchCourseSearch.fulfilled, (state, action) => {
        state.search.isFetching = false;
        state.search.params = action.payload.params;
        state.search.pages[action.payload.page] = action.payload.data;
      })
      .addCase(fetchCourseSearch.rejected, (state) => {
        state.search.isFetching = false;
      });
  },
});

// Export selectors
export const selectCourse = (uuid: string) => (state: RootState) =>
  state.courses.data[uuid];
export const selectCourseSearch = (state: RootState) => state.courses.search;
export const selectCourseSearchPage = (page: number) => (state: RootState) =>
  state.courses.search.pages[page];

// Export reducer
export default coursesSlice.reducer;
