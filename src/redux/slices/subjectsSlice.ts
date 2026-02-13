import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Subject, PagedResponse, MadgradesApi } from '../../types/api';

interface SubjectData extends Subject {
  isFetching?: boolean;
}

interface SubjectsState {
  data: Record<string, SubjectData>;
  searches: Record<string, Record<number, PagedResponse<Subject> & { isFetching?: boolean }>>;
}

const initialState: SubjectsState = {
  data: {},
  searches: {},
};

// Async thunk for fetching a single subject
export const fetchSubject = createAsyncThunk<
  { code: string; data: Subject },
  string,
  { state: { subjects: SubjectsState }; extra: MadgradesApi }
>('subjects/fetchSubject', async (code, { getState, extra: api }) => {
  const state = getState();
  const subjectData = state.subjects.data[code];

  // Don't fetch if we already have this subject
  if (subjectData && !subjectData.isFetching) {
    return { code, data: subjectData };
  }

  const data = await api.getSubject(code);
  return { code, data };
});

// Async thunk for fetching subject search results
export const fetchSubjectSearch = createAsyncThunk<
  { query: string; page: number; data: PagedResponse<Subject> },
  { query: string; page: number },
  { state: { subjects: SubjectsState }; extra: MadgradesApi }
>('subjects/fetchSubjectSearch', async ({ query, page }, { getState, extra: api, dispatch }) => {
  const state = getState();
  const subjectSearchData = state.subjects.searches[query];

  // Don't fetch if we already have this search
  if (subjectSearchData?.[page]) {
    return { query, page, data: subjectSearchData[page] };
  }

  const data = await api.searchSubjects(query, page);

  // Dispatch individual subject data to store
  data.results.forEach((subject) => {
    dispatch(receiveSubject({ code: subject.code, data: subject }));
  });

  return { query, page, data };
});

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    receiveSubject: (state, action: { payload: { code: string; data: Subject } }) => {
      const { code, data } = action.payload;
      state.data[code] = {
        ...data,
        isFetching: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubject.pending, (state, action) => {
        const code = action.meta.arg;
        state.data[code] = {
          ...state.data[code],
          code,
          isFetching: true,
        } as SubjectData;
      })
      .addCase(fetchSubject.fulfilled, (state, action) => {
        const { code, data } = action.payload;
        state.data[code] = {
          ...data,
          isFetching: false,
        };
      })
      .addCase(fetchSubjectSearch.pending, (state, action) => {
        const { query, page } = action.meta.arg;
        if (!state.searches[query]) {
          state.searches[query] = {};
        }
        state.searches[query][page] = {
          ...state.searches[query][page],
          isFetching: true,
        } as PagedResponse<Subject> & { isFetching?: boolean };
      })
      .addCase(fetchSubjectSearch.fulfilled, (state, action) => {
        const { query, page, data } = action.payload;
        if (!state.searches[query]) {
          state.searches[query] = {};
        }
        state.searches[query][page] = {
          ...data,
          isFetching: false,
        };
      });
  },
});

export const { receiveSubject } = subjectsSlice.actions;
export default subjectsSlice.reducer;
