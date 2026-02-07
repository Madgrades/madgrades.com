import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Define types
interface Subject {
  code: string;
  name: string;
  // Add other subject properties as needed
  [key: string]: any;
}

interface SubjectData {
  isFetching: boolean;
  code: string;
  data?: Subject;
}

interface SearchResult {
  results: Subject[];
  total: number;
  page: number;
  perPage: number;
}

interface SearchPageData {
  isFetching: boolean;
  data?: SearchResult;
}

interface SubjectsState {
  data: Record<string, SubjectData>;
  searches: Record<string, Record<number, SearchPageData>>;
}

// Initial state
const initialState: SubjectsState = {
  data: {},
  searches: {},
};

// Async thunks
export const fetchSubject = createAsyncThunk<
  Subject,
  string,
  { state: RootState; extra: any }
>('subjects/fetchSubject', async (code, { getState, extra: api }) => {
  const state = getState();
  const subjectData = state.subjects.data[code];

  // Don't fetch if already loaded
  if (subjectData?.data) {
    return subjectData.data;
  }

  const data = await api.getSubject(code);
  return data;
});

export const fetchSubjectSearch = createAsyncThunk<
  { query: string; page: number; data: SearchResult },
  { query: string; page: number },
  { state: RootState; extra: any }
>(
  'subjects/fetchSubjectSearch',
  async ({ query, page }, { getState, extra: api, dispatch }) => {
    const state = getState();
    const subjectSearchData = state.subjects.searches[query]?.[page];

    // Don't fetch if already loaded
    if (subjectSearchData?.data) {
      return { query, page, data: subjectSearchData.data };
    }

    const data = await api.searchSubjects(query, page);

    // Populate individual subject data
    if (data.results) {
      data.results.forEach((subject: Subject) => {
        dispatch(
          subjectsSlice.actions.receiveSubject({
            code: subject.code,
            data: subject,
          })
        );
      });
    }

    return { query, page, data };
  }
);

// Slice
const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    receiveSubject: (state, action) => {
      const { code, data } = action.payload;
      state.data[code] = {
        isFetching: false,
        code,
        data,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSubject
      .addCase(fetchSubject.pending, (state, action) => {
        const code = action.meta.arg;
        state.data[code] = {
          isFetching: true,
          code,
        };
      })
      .addCase(fetchSubject.fulfilled, (state, action) => {
        const code = action.meta.arg;
        state.data[code] = {
          isFetching: false,
          code,
          data: action.payload,
        };
      })
      .addCase(fetchSubject.rejected, (state, action) => {
        const code = action.meta.arg;
        if (state.data[code]) {
          state.data[code].isFetching = false;
        }
      })
      // fetchSubjectSearch
      .addCase(fetchSubjectSearch.pending, (state, action) => {
        const { query, page } = action.meta.arg;
        if (!state.searches[query]) {
          state.searches[query] = {};
        }
        state.searches[query][page] = {
          isFetching: true,
        };
      })
      .addCase(fetchSubjectSearch.fulfilled, (state, action) => {
        const { query, page, data } = action.payload;
        if (!state.searches[query]) {
          state.searches[query] = {};
        }
        state.searches[query][page] = {
          isFetching: false,
          data,
        };
      })
      .addCase(fetchSubjectSearch.rejected, (state, action) => {
        const { query, page } = action.meta.arg;
        if (state.searches[query]?.[page]) {
          state.searches[query][page].isFetching = false;
        }
      });
  },
});

// Export selectors
export const selectSubject = (code: string) => (state: RootState) =>
  state.subjects.data[code];
export const selectSubjectSearch =
  (query: string, page: number) => (state: RootState) =>
    state.subjects.searches[query]?.[page];

// Export reducer
export default subjectsSlice.reducer;
