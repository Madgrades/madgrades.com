import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import utils from '../../utils';
import type { RootState } from '../index';

// Define types
interface GradeDistribution {
  aCount: number;
  abCount: number;
  bCount: number;
  bcCount: number;
  cCount: number;
  dCount: number;
  fCount: number;
  // Add other grade properties as needed
  [key: string]: any;
}

interface CourseGradesData {
  isFetching: boolean;
  courseOfferings?: any[];
  instructors?: any[];
  [key: string]: any;
}

interface InstructorGradesData {
  isFetching: boolean;
  courseOfferings?: any[];
  courses?: any[];
  [key: string]: any;
}

interface GradesState {
  courses: {
    data: Record<string, CourseGradesData>;
  };
  instructors: {
    data: Record<string, InstructorGradesData>;
  };
}

// Initial state
const initialState: GradesState = {
  courses: {
    data: {},
  },
  instructors: {
    data: {},
  },
};

// Async thunks
export const fetchCourseGrades = createAsyncThunk<
  any,
  string,
  { state: RootState; extra: any }
>('grades/fetchCourseGrades', async (uuid, { getState, extra: api }) => {
  const state = getState();
  const gradesData = state.grades.courses.data[uuid];

  // Don't fetch if already loaded
  if (gradesData && !gradesData.isFetching && gradesData.courseOfferings) {
    return gradesData;
  }

  // Perform request
  const rawData = await api.getCourseGrades(uuid);

  // Process the data to view by instructor
  const byInstructor: Record<string, any> = {};
  const instructorNames: Record<string, string> = {};

  // Iterate each offering
  rawData.courseOfferings.forEach((offering: any) => {
    const { termCode } = offering;

    // Each section
    offering.sections.forEach((section: any) => {
      // Each instructor for the section
      section.instructors.forEach((instructor: any) => {
        const { id, name } = instructor;
        instructorNames[id] = name;

        // Add or put instructor in map
        let instructorGrades = byInstructor[id];
        if (!instructorGrades) {
          instructorGrades = { terms: {}, id };
          byInstructor[id] = instructorGrades;
        }

        const { terms } = instructorGrades;
        let base = utils.grades.zero();

        if (termCode in terms) {
          base = terms[termCode];
        }

        // Combine existing with new section
        terms[termCode] = utils.grades.combine(base, section);
        terms[termCode].termCode = termCode;
      });
    });
  });

  // Arrange the data by instructor
  rawData.instructors = [];

  // Iterate each instructor key
  Object.keys(byInstructor).forEach((instructorKey) => {
    const data = byInstructor[instructorKey];
    const terms = [];
    let latestTerm = 0;

    // Each term for the instructor gets added to array
    Object.keys(data.terms).forEach((termKey) => {
      const termData = data.terms[termKey];
      const { termCode } = termData;
      terms.push(termData);

      // Track latest term taught
      if (termCode > latestTerm) {
        latestTerm = termCode;
      }
    });

    // Combine all terms
    const cumulative = utils.grades.combineAll(terms);

    // Add instructor to data
    rawData.instructors.push({
      id: data.id,
      name: instructorNames[data.id],
      cumulative,
      terms,
      latestTerm,
    });
  });

  // Sort instructors by most recent teachings first
  rawData.instructors.sort((a: any, b: any) => b.latestTerm - a.latestTerm);

  return rawData;
});

export const fetchInstructorGrades = createAsyncThunk<
  any,
  number,
  { state: RootState; extra: any }
>('grades/fetchInstructorGrades', async (id, { getState, extra: api }) => {
  const state = getState();
  const gradesData = state.grades.instructors.data[id];

  // Don't fetch if already loaded
  if (gradesData && !gradesData.isFetching && gradesData.courseOfferings) {
    return gradesData;
  }

  // Get JSON
  const rawData = await api.getInstructorGrades(id);

  const byCourse: Record<string, any> = {};

  // Iterate each offering
  rawData.courseOfferings.forEach((offering: any) => {
    const { termCode, courseUuid } = offering;

    let courseGrades = byCourse[courseUuid];
    if (!courseGrades) {
      courseGrades = { terms: {}, uuid: courseUuid };
      byCourse[courseUuid] = courseGrades;
    }

    const { terms } = courseGrades;
    let base = utils.grades.zero();

    if (termCode in terms) {
      base = terms[termCode];
    }

    // Combine existing with new offering
    terms[termCode] = utils.grades.combine(base, offering.cumulative);
    terms[termCode].termCode = termCode;
  });

  // Arrange the data by course
  rawData.courses = [];

  // Iterate each course key
  Object.keys(byCourse).forEach((courseKey) => {
    const data = byCourse[courseKey];
    const terms = [];
    let latestTerm = 0;

    // Each term gets added to array
    Object.keys(data.terms).forEach((termKey) => {
      const termData = data.terms[termKey];
      const { termCode } = termData;
      terms.push(termData);

      // Track latest term taught
      if (termCode > latestTerm) {
        latestTerm = termCode;
      }
    });

    // Combine all terms
    const cumulative = utils.grades.combineAll(terms);

    // Add course to data
    rawData.courses.push({
      uuid: data.uuid,
      cumulative,
      terms,
      latestTerm,
    });
  });

  // Sort courses by most recent teachings first
  rawData.courses.sort((a: any, b: any) => b.latestTerm - a.latestTerm);

  return rawData;
});

// Slice
const gradesSlice = createSlice({
  name: 'grades',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchCourseGrades
      .addCase(fetchCourseGrades.pending, (state, action) => {
        const uuid = action.meta.arg;
        state.courses.data[uuid] = {
          isFetching: true,
        };
      })
      .addCase(fetchCourseGrades.fulfilled, (state, action) => {
        const uuid = action.meta.arg;
        state.courses.data[uuid] = {
          isFetching: false,
          ...action.payload,
        };
      })
      .addCase(fetchCourseGrades.rejected, (state, action) => {
        const uuid = action.meta.arg;
        if (state.courses.data[uuid]) {
          state.courses.data[uuid].isFetching = false;
        }
      })
      // fetchInstructorGrades
      .addCase(fetchInstructorGrades.pending, (state, action) => {
        const id = action.meta.arg;
        state.instructors.data[id] = {
          isFetching: true,
        };
      })
      .addCase(fetchInstructorGrades.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.instructors.data[id] = {
          isFetching: false,
          ...action.payload,
        };
      })
      .addCase(fetchInstructorGrades.rejected, (state, action) => {
        const id = action.meta.arg;
        if (state.instructors.data[id]) {
          state.instructors.data[id].isFetching = false;
        }
      });
  },
});

// Export selectors
export const selectCourseGrades = (uuid: string) => (state: RootState) =>
  state.grades.courses.data[uuid];
export const selectInstructorGrades = (id: number) => (state: RootState) =>
  state.grades.instructors.data[id];

// Export reducer
export default gradesSlice.reducer;
