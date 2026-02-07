import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type { Subject, SubjectSearchResponse } from '../../types/api';
import type { ApiClient } from '../../types/apiClient';

// Define types
interface SubjectData {
  isFetching: boolean;
  code: string;
  data?: Subject;
}

interface SearchPageData {
  isFetching: boolean;
  data?: SubjectSearchResponse;
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
  { state: RootState; extra: ApiClient }
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
  { query: string; page: number; data: SubjectSearchResponse },
  { query: string; page: number },
  { state: RootState; extra: ApiClient }
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
    data.results.forEach((subject) => {
      dispatch(
        subjectsSlice.actions.receiveSubject({
          code: subject.code,
          data: subject,
        })
      );
    });

    return { query, page, data };
  }
);

// Slice
const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    receiveSubject: (state, action: PayloadAction<{ code: string; data: Subject }>) => {
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
