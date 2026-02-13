import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Instructor, PagedResponse, MadgradesApi } from '../../types/api';

interface InstructorData extends Instructor {
  isFetching?: boolean;
}

interface InstructorsState {
  data: Record<string, InstructorData>;
  searches: Record<string, Record<number, PagedResponse<Instructor> & { isFetching?: boolean }>>;
}

const initialState: InstructorsState = {
  data: {},
  searches: {},
};

// Async thunk for fetching a single instructor
export const fetchInstructor = createAsyncThunk<
  { id: string; data: Instructor },
  number,
  { extra: MadgradesApi }
>('instructors/fetchInstructor', async (id, { extra: api }) => {
  const data = await api.getInstructor(id);
  return { id: id.toString(), data };
});

// Async thunk for fetching instructor search results
export const fetchInstructorSearch = createAsyncThunk<
  { query: string; page: number; data: PagedResponse<Instructor> },
  { query: string; page: number },
  { state: { instructors: InstructorsState }; extra: MadgradesApi }
>('instructors/fetchInstructorSearch', async ({ query, page }, { getState, extra: api, dispatch }) => {
  const state = getState();
  const instructorSearchData = state.instructors.searches[query];

  // Don't fetch if we already have this search
  if (instructorSearchData?.[page]) {
    return { query, page, data: instructorSearchData[page] };
  }

  const data = await api.searchInstructors(query, page);

  // Dispatch individual instructor data to store
  data.results.forEach((instructor) => {
    dispatch(receiveInstructor({ id: instructor.id.toString(), data: instructor }));
  });

  return { query, page, data };
});

const instructorsSlice = createSlice({
  name: 'instructors',
  initialState,
  reducers: {
    receiveInstructor: (state, action: { payload: { id: string; data: Instructor } }) => {
      const { id, data } = action.payload;
      state.data[id] = {
        ...data,
        isFetching: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstructor.pending, (state, action) => {
        const id = action.meta.arg.toString();
        state.data[id] = {
          ...state.data[id],
          id: action.meta.arg,
          isFetching: true,
        } as InstructorData;
      })
      .addCase(fetchInstructor.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        state.data[id] = {
          ...data,
          isFetching: false,
        };
      })
      .addCase(fetchInstructorSearch.pending, (state, action) => {
        const { query, page } = action.meta.arg;
        if (!state.searches[query]) {
          state.searches[query] = {};
        }
        state.searches[query][page] = {
          ...state.searches[query][page],
          isFetching: true,
        } as PagedResponse<Instructor> & { isFetching?: boolean };
      })
      .addCase(fetchInstructorSearch.fulfilled, (state, action) => {
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

export const { receiveInstructor } = instructorsSlice.actions;
export default instructorsSlice.reducer;
