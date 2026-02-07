import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import utils from '../../utils';
import type { RootState } from '../index';
import type {
  CourseGradesResponse,
  InstructorGradesResponse,
  CourseOffering,
  InstructorWithGrades,
  CourseWithGrades,
  GradeDistribution,
} from '../../types/api';
import type { ApiClient } from '../../types/apiClient';

// Define types
interface CourseGradesData {
  isFetching: boolean;
  courseOfferings?: CourseOffering[];
  instructors?: InstructorWithGrades[];
}

interface InstructorGradesData {
  isFetching: boolean;
  courseOfferings?: Array<CourseOffering & { courseUuid: string }>;
  courses?: CourseWithGrades[];
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
  CourseGradesResponse,
  string,
  { state: RootState; extra: ApiClient }
>('grades/fetchCourseGrades', async (uuid, { getState, extra: api }) => {
  const state = getState();
  const gradesData = state.grades.courses.data[uuid];

  // Don't fetch if already loaded
  if (gradesData && !gradesData.isFetching && gradesData.courseOfferings) {
    return gradesData as CourseGradesResponse;
  }

  // Perform request
  const rawData = await api.getCourseGrades(uuid);

  // Process the data to view by instructor
  const byInstructor: Record<
    string,
    {
      id: number;
      terms: Record<number, GradeDistribution & { termCode: number }>;
    }
  > = {};
  const instructorNames: Record<string, string> = {};

  // Iterate each offering
  rawData.courseOfferings.forEach((offering) => {
    const { termCode } = offering;

    // Each section
    offering.sections.forEach((section) => {
      // Each instructor for the section
      section.instructors.forEach((instructor) => {
        const { id, name } = instructor;
        instructorNames[id] = name;

        // Add or put instructor in map
        let instructorGrades = byInstructor[id];
        if (!instructorGrades) {
          instructorGrades = { terms: {}, id };
          byInstructor[id] = instructorGrades;
        }

        const { terms } = instructorGrades;
        const existingTerm = terms[termCode];
        const base: Partial<GradeDistribution> = existingTerm || utils.grades.zero();

        // Combine existing with new section (section contains all grade distribution fields)
        const combined = utils.grades.combine(base, section as Partial<GradeDistribution>);
        terms[termCode] = { ...combined, termCode };
      });
    });
  });

  // Arrange the data by instructor
  const instructors: InstructorWithGrades[] = [];

  // Iterate each instructor key
  Object.keys(byInstructor).forEach((instructorKey) => {
    const data = byInstructor[instructorKey];
    if (!data) return;
    
    const terms: Array<GradeDistribution & { termCode: number }> = [];
    let latestTerm = 0;

    // Each term for the instructor gets added to array
    Object.keys(data.terms).forEach((termKey) => {
      const termData = data.terms[Number(termKey)];
      if (!termData) return;
      
      const { termCode } = termData;
      terms.push(termData);

      // Track latest term taught
      if (termCode > latestTerm) {
        latestTerm = termCode;
      }
    });

    // Combine all terms
    const cumulative = utils.grades.combineAll(terms as Partial<GradeDistribution>[]);

    const instructorName = instructorNames[data.id];
    if (!instructorName) return;

    // Add instructor to data
    instructors.push({
      id: data.id,
      name: instructorName,
      cumulative,
      terms,
      latestTerm,
    });
  });

  // Sort instructors by most recent teachings first
  instructors.sort((a, b) => b.latestTerm - a.latestTerm);

  return { ...rawData, instructors };
});

export const fetchInstructorGrades = createAsyncThunk<
  InstructorGradesResponse,
  number,
  { state: RootState; extra: ApiClient }
>('grades/fetchInstructorGrades', async (id, { getState, extra: api }) => {
  const state = getState();
  const gradesData = state.grades.instructors.data[id];

  // Don't fetch if already loaded
  if (gradesData && !gradesData.isFetching && gradesData.courseOfferings) {
    return gradesData as InstructorGradesResponse;
  }

  // Get JSON
  const rawData = await api.getInstructorGrades(id);

  const byCourse: Record<
    string,
    {
      uuid: string;
      terms: Record<number, GradeDistribution & { termCode: number }>;
    }
  > = {};

  // Iterate each offering
  rawData.courseOfferings.forEach((offering) => {
    const { termCode, courseUuid } = offering;

    let courseGrades = byCourse[courseUuid];
    if (!courseGrades) {
      courseGrades = { terms: {}, uuid: courseUuid };
      byCourse[courseUuid] = courseGrades;
    }

    const { terms } = courseGrades;
    const existingTerm = terms[termCode];
    const base: Partial<GradeDistribution> = existingTerm || utils.grades.zero();

    // Combine existing with new offering
    const combined = utils.grades.combine(base, offering.cumulative);
    terms[termCode] = { ...combined, termCode };
  });

  // Arrange the data by course
  const courses: CourseWithGrades[] = [];

  // Iterate each course key
  Object.keys(byCourse).forEach((courseKey) => {
    const data = byCourse[courseKey];
    if (!data) return;
    
    const terms: Array<GradeDistribution & { termCode: number }> = [];
    let latestTerm = 0;

    // Each term gets added to array
    Object.keys(data.terms).forEach((termKey) => {
      const termData = data.terms[Number(termKey)];
      if (!termData) return;
      
      const { termCode } = termData;
      terms.push(termData);

      // Track latest term taught
      if (termCode > latestTerm) {
        latestTerm = termCode;
      }
    });

    // Combine all terms
    const cumulative = utils.grades.combineAll(terms as Partial<GradeDistribution>[]);

    // Add course to data
    courses.push({
      uuid: data.uuid,
      cumulative,
      terms,
      latestTerm,
    });
  });

  // Sort courses by most recent teachings first
  courses.sort((a, b) => b.latestTerm - a.latestTerm);

  return { ...rawData, courses };
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
