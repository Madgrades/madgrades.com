import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import utils from '../../utils';
import type { MadgradesApi } from '../../types/api';

// Type definitions for grades data structures
interface GradeData {
  total: number;
  aCount: number;
  abCount: number;
  bCount: number;
  bcCount: number;
  cCount: number;
  dCount: number;
  fCount: number;
  sCount?: number;
  ubCount?: number;
  crCount?: number;
  nCount?: number;
  pCount?: number;
  iCount?: number;
  nwCount?: number;
  nrCount?: number;
  otherCount?: number;
  termCode?: number;
}

interface InstructorGradeData {
  id: number;
  name: string;
  cumulative: GradeData;
  terms: GradeData[];
  latestTerm: number;
}

interface CourseGradesData {
  isFetching?: boolean;
  courseOfferings?: unknown[];
  instructors?: InstructorGradeData[];
}

interface CourseGradesWithUuid {
  uuid: string;
  cumulative: GradeData;
  terms: GradeData[];
  latestTerm: number;
}

interface InstructorGradesData {
  isFetching?: boolean;
  courseOfferings?: unknown[];
  courses?: CourseGradesWithUuid[];
}

interface GradesState {
  courses: {
    data: Record<string, CourseGradesData>;
  };
  instructors: {
    data: Record<string, InstructorGradesData>;
  };
}

const initialState: GradesState = {
  courses: {
    data: {},
  },
  instructors: {
    data: {},
  },
};

// Async thunk for fetching course grades
export const fetchCourseGrades = createAsyncThunk<
  { uuid: string; data: CourseGradesData },
  string,
  { state: { grades: GradesState }; extra: MadgradesApi }
>('grades/fetchCourseGrades', async (uuid, { getState, extra: api }) => {
  const state = getState();
  const gradesData = state.grades.courses.data[uuid];

  // Don't fetch if we already have grades
  if (gradesData && !gradesData.isFetching) {
    return { uuid, data: gradesData };
  }

  // Perform request and process data for viewing by instructor
  const rawData = (await api.getCourseGrades(uuid)) as {
    courseOfferings: Array<{
      termCode: number;
      sections: Array<{
        instructors: Array<{ id: number; name: string }>;
        [key: string]: unknown;
      }>;
    }>;
  };

  const byInstructor: Record<number, { terms: Record<number, GradeData>; id: number }> = {};
  const instructorNames: Record<number, string> = {};

  // Iterate each offering
  rawData.courseOfferings.forEach((offering) => {
    const { termCode } = offering;

    // Each section
    offering.sections.forEach((section) => {
      // Each instructor for the section
      section.instructors.forEach((instructor) => {
        const { id, name } = instructor;
        instructorNames[id] = name;

        // Add or update instructor in map
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
        terms[termCode] = utils.grades.combine(base, section as GradeData);
        terms[termCode].termCode = termCode;
      });
    });
  });

  // Arrange the data by instructor
  const instructors: InstructorGradeData[] = [];

  // Iterate each instructor key
  Object.keys(byInstructor).forEach((instructorKey) => {
    const data = byInstructor[Number(instructorKey)];
    const terms: GradeData[] = [];
    let latestTerm = 0;

    // Each term for the instructor gets added to array
    Object.keys(data.terms).forEach((termKey) => {
      const termData = data.terms[Number(termKey)];
      const { termCode } = termData;
      terms.push(termData);

      // Track latest term taught
      if (termCode && termCode > latestTerm) {
        latestTerm = termCode;
      }
    });

    // Combine all terms
    const cumulative = utils.grades.combineAll(terms);

    // Add instructor to data
    instructors.push({
      id: data.id,
      name: instructorNames[data.id] || '',
      cumulative,
      terms,
      latestTerm,
    });
  });

  // Sort instructors by most recent teachings first
  instructors.sort((a, b) => b.latestTerm - a.latestTerm);

  return {
    uuid,
    data: {
      ...rawData,
      instructors,
    },
  };
});

// Async thunk for fetching instructor grades
export const fetchInstructorGrades = createAsyncThunk<
  { id: string; data: InstructorGradesData },
  number,
  { state: { grades: GradesState }; extra: MadgradesApi }
>('grades/fetchInstructorGrades', async (id, { getState, extra: api }) => {
  const state = getState();
  const gradesData = state.grades.instructors.data[id.toString()];

  // Don't fetch if we already have grades
  if (gradesData && !gradesData.isFetching) {
    return { id: id.toString(), data: gradesData };
  }

  // Get JSON
  const rawData = (await api.getInstructor(id)) as {
    courseOfferings: Array<{
      termCode: number;
      courseUuid: string;
      cumulative: GradeData;
    }>;
  };

  const byCourse: Record<string, { terms: Record<number, GradeData>; uuid: string }> = {};

  // Iterate each offering
  rawData.courseOfferings.forEach((offering) => {
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
  const courses: CourseGradesWithUuid[] = [];

  // Iterate each course key
  Object.keys(byCourse).forEach((courseKey) => {
    const data = byCourse[courseKey];
    const terms: GradeData[] = [];
    let latestTerm = 0;

    // Each term for the course gets added to array
    Object.keys(data.terms).forEach((termKey) => {
      const termData = data.terms[Number(termKey)];
      const { termCode } = termData;
      terms.push(termData);

      // Track latest term taught
      if (termCode && termCode > latestTerm) {
        latestTerm = termCode;
      }
    });

    // Combine all terms
    const cumulative = utils.grades.combineAll(terms);

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

  return {
    id: id.toString(),
    data: {
      ...rawData,
      courses,
    },
  };
});

const gradesSlice = createSlice({
  name: 'grades',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseGrades.pending, (state, action) => {
        const uuid = action.meta.arg;
        state.courses.data[uuid] = {
          ...state.courses.data[uuid],
          isFetching: true,
        };
      })
      .addCase(fetchCourseGrades.fulfilled, (state, action) => {
        const { uuid, data } = action.payload;
        state.courses.data[uuid] = {
          ...data,
          isFetching: false,
        };
      })
      .addCase(fetchInstructorGrades.pending, (state, action) => {
        const id = action.meta.arg.toString();
        state.instructors.data[id] = {
          ...state.instructors.data[id],
          isFetching: true,
        };
      })
      .addCase(fetchInstructorGrades.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        state.instructors.data[id] = {
          ...data,
          isFetching: false,
        };
      });
  },
});

export default gradesSlice.reducer;
