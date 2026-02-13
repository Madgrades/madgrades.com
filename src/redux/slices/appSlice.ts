import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Term, CourseFilterParams, MadgradesApi } from '../../types/api';

interface AppState {
  searchQuery: string;
  courseFilterParams: CourseFilterParams;
  terms: Term[] | undefined;
}

const initialState: AppState = {
  searchQuery: '',
  courseFilterParams: {
    subjects: undefined,
    instructors: undefined,
    sort: undefined,
    order: undefined,
  },
  terms: undefined,
};

// Async thunk for fetching terms
export const fetchTerms = createAsyncThunk<
  Term[],
  void,
  { extra: MadgradesApi }
>('app/fetchTerms', async (_, { getState, extra: api }) => {
  const state = getState() as { app: AppState };
  
  // Don't fetch if we already have terms
  if (state.app.terms) {
    return state.app.terms;
  }
  
  return await api.getTerms();
});

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
    builder.addCase(fetchTerms.fulfilled, (state, action) => {
      state.terms = action.payload;
    });
  },
});

export const { setSearchQuery, setCourseFilterParams } = appSlice.actions;
export default appSlice.reducer;
