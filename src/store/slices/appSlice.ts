import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type { Term, CourseFilterParams } from '../../types/api';

// Define types
interface AppState {
  searchQuery: string;
  courseFilterParams: CourseFilterParams;
  terms: Term[] | undefined;
  termsLoading: boolean;
  termsError: string | null;
}

// Initial state
const initialState: AppState = {
  searchQuery: '',
  courseFilterParams: {
    subjects: undefined,
    instructors: undefined,
    sort: undefined,
    order: undefined,
  },
  terms: undefined,
  termsLoading: false,
  termsError: null,
};

// Define the API type from thunk extra argument
interface ThunkAPI {
  getTerms: () => Promise<Term[]>;
}

// Async thunks
export const fetchTerms = createAsyncThunk<
  Term[],
  void,
  { state: RootState; extra: ThunkAPI }
>('app/fetchTerms', async (_, { getState, extra: api }) => {
  const state = getState();
  
  // Don't fetch if already loaded
  if (state.app.terms) {
    return state.app.terms;
  }
  
  const termsData = await api.getTerms();
  return termsData;
});

// Slice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload || '';
    },
    setCourseFilterParams: (state, action: PayloadAction<Partial<CourseFilterParams>>) => {
      state.courseFilterParams = {
        ...state.courseFilterParams,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTerms.pending, (state) => {
        state.termsLoading = true;
        state.termsError = null;
      })
      .addCase(fetchTerms.fulfilled, (state, action) => {
        state.termsLoading = false;
        state.terms = action.payload;
      })
      .addCase(fetchTerms.rejected, (state, action) => {
        state.termsLoading = false;
        state.termsError = action.error.message || 'Failed to fetch terms';
      });
  },
});

// Export actions
export const { setSearchQuery, setCourseFilterParams } = appSlice.actions;

// Export selectors
export const selectSearchQuery = (state: RootState) => state.app.searchQuery;
export const selectCourseFilterParams = (state: RootState) => state.app.courseFilterParams;
export const selectTerms = (state: RootState) => state.app.terms;
export const selectTermsLoading = (state: RootState) => state.app.termsLoading;

// Export reducer
export default appSlice.reducer;
