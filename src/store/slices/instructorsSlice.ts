import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Define types
interface Instructor {
  id: number;
  name: string;
  // Add other instructor properties as needed
  [key: string]: any;
}

interface InstructorData {
  isFetching: boolean;
  id: number;
  data?: Instructor;
}

interface SearchResult {
  results: Instructor[];
  total: number;
  page: number;
  perPage: number;
}

interface SearchPageData {
  isFetching: boolean;
  data?: SearchResult;
}

interface InstructorsState {
  data: Record<string, InstructorData>;
  searches: Record<string, Record<number, SearchPageData>>;
}

// Initial state
const initialState: InstructorsState = {
  data: {},
  searches: {},
};

// Async thunks
export const fetchInstructor = createAsyncThunk<
  Instructor,
  number,
  { state: RootState; extra: any }
>('instructors/fetchInstructor', async (id, { extra: api }) => {
  const response = await api.getInstructor(id);
  return response;
});

export const fetchInstructorSearch = createAsyncThunk<
  { query: string; page: number; data: SearchResult },
  { query: string; page: number },
  { state: RootState; extra: any }
>(
  'instructors/fetchInstructorSearch',
  async ({ query, page }, { getState, extra: api, dispatch }) => {
    const state = getState();
    const instructorSearchData = state.instructors.searches[query]?.[page];

    // Don't fetch if already loaded
    if (instructorSearchData?.data) {
      return { query, page, data: instructorSearchData.data };
    }

    const data = await api.searchInstructors(query, page);

    // Populate individual instructor data
    if (data.results) {
      data.results.forEach((instructor: Instructor) => {
        dispatch(
          instructorsSlice.actions.receiveInstructor({
            id: instructor.id,
            data: instructor,
          })
        );
      });
    }

    return { query, page, data };
  }
);

// Slice
const instructorsSlice = createSlice({
  name: 'instructors',
  initialState,
  reducers: {
    receiveInstructor: (state, action) => {
      const { id, data } = action.payload;
      state.data[id.toString()] = {
        isFetching: false,
        id: Number(id),
        data,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchInstructor
      .addCase(fetchInstructor.pending, (state, action) => {
        const id = action.meta.arg;
        state.data[id.toString()] = {
          isFetching: true,
          id: Number(id),
        };
      })
      .addCase(fetchInstructor.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.data[id.toString()] = {
          isFetching: false,
          id: Number(id),
          data: action.payload,
        };
      })
      .addCase(fetchInstructor.rejected, (state, action) => {
        const id = action.meta.arg;
        const instructorData = state.data[id.toString()];
        if (instructorData) {
          instructorData.isFetching = false;
        }
      })
      // fetchInstructorSearch
      .addCase(fetchInstructorSearch.pending, (state, action) => {
        const { query, page } = action.meta.arg;
        if (!state.searches[query]) {
          state.searches[query] = {};
        }
        state.searches[query][page] = {
          isFetching: true,
        };
      })
      .addCase(fetchInstructorSearch.fulfilled, (state, action) => {
        const { query, page, data } = action.payload;
        if (!state.searches[query]) {
          state.searches[query] = {};
        }
        state.searches[query][page] = {
          isFetching: false,
          data,
        };
      })
      .addCase(fetchInstructorSearch.rejected, (state, action) => {
        const { query, page } = action.meta.arg;
        if (state.searches[query]?.[page]) {
          state.searches[query][page].isFetching = false;
        }
      });
  },
});

// Export selectors
export const selectInstructor = (id: number) => (state: RootState) =>
  state.instructors.data[id.toString()];
export const selectInstructorSearch =
  (query: string, page: number) => (state: RootState) =>
    state.instructors.searches[query]?.[page];

// Export reducer
export default instructorsSlice.reducer;
