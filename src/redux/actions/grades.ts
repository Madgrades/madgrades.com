import * as actionTypes from '../actionTypes';
import utils from '../../utils';
import { Dispatch } from 'redux';
import { GradeDistribution, RootState } from '../../types';
import { Api } from '../../utils/api';

interface CourseGradesResponse {
  courseOfferings: {
    termCode: number;
    sections: ({
      instructors: {
        id: number;
        name: string;
      }[];
    } & GradeDistribution)[];
  }[];
}

interface InstructorTermData extends GradeDistribution {
  termCode: number;
}

interface InstructorGradesData {
  terms: Record<number, InstructorTermData>;
  id: number;
}

interface ProcessedInstructor {
  id: number;
  name: string;
  cumulative: GradeDistribution;
  terms: InstructorTermData[];
  latestTerm: number;
}

interface ProcessedCourseGrades extends CourseGradesResponse {
  instructors: ProcessedInstructor[];
}

const requestCourseGrades = (uuid: string) => {
  return {
    type: actionTypes.REQUEST_COURSE_GRADES,
    uuid,
  };
};

const receiveCourseGrades = (uuid: string, data: ProcessedCourseGrades) => {
  return {
    type: actionTypes.RECEIVE_COURSE_GRADES,
    uuid,
    data,
  };
};

export const fetchCourseGrades =
  (uuid: string) =>
  async (dispatch: Dispatch, getState: () => RootState, api: Api): Promise<void> => {
    const state = getState();
    const gradesDataEntry = state.grades.courses.data[uuid];
    const gradesData: CourseGradesResponse | undefined = gradesDataEntry?.courseOfferings
      ? (gradesDataEntry as unknown as CourseGradesResponse)
      : undefined;

    // don't fetch again
    if (gradesData) {
      return;
    }

    // request action
    dispatch(requestCourseGrades(uuid));

    // perform request
    // we process this data bit so we can view by instructor
    const fetchedGradesData = (await api.getCourseGrades(uuid)) as CourseGradesResponse;

    const byInstructor: Record<number, InstructorGradesData> = {};
    const instructorNames: Record<number, string> = {};

    // iterate each offering
    fetchedGradesData.courseOfferings.forEach(offering => {
      const { termCode } = offering;

      // each section
      offering.sections.forEach(section => {
        // each instructor for the section
        section.instructors.forEach(instructor => {
          const { id, name } = instructor;
          instructorNames[id] = name;

          // add or put instructor in map
          const instructorGrades = byInstructor[id] ?? (byInstructor[id] = { terms: {}, id: id });

          const { terms } = instructorGrades;
          let base = utils.grades.zero();

          if (termCode in terms) {
            base = terms[termCode];
          }

          // combine existing with new section
          terms[termCode] = utils.grades.combine(base, section);
          terms[termCode].termCode = termCode;
        });
      });
    });

    // we arrange the data by instructor as well
    const processedGradesData = fetchedGradesData as ProcessedCourseGrades;
    processedGradesData.instructors = [];

    // iterate each instructor key
    Object.keys(byInstructor).forEach(instructorKey => {
      const data = byInstructor[parseInt(instructorKey)];
      const terms: InstructorTermData[] = [];

      // each term for the instructor gets added to array instead of map
      Object.keys(data.terms).forEach(termKey => {
        const termData = data.terms[parseInt(termKey)];
        terms.push(termData);
      });

      // track latest term taught
      const latestTerm = terms.reduce((max, t) => Math.max(max, t.termCode), 0);

      // combine all terms
      const cumulative = utils.grades.combineAll(terms);

      // add instructor to data
      processedGradesData.instructors.push({
        id: data.id,
        name: instructorNames[data.id],
        cumulative,
        terms,
        latestTerm,
      });
    });

    // sort instructors by most recent teachings first
    processedGradesData.instructors.sort((a, b) => b.latestTerm - a.latestTerm);

    // receive action
    dispatch(receiveCourseGrades(uuid, processedGradesData));
  };

interface InstructorGradesResponse {
  courseOfferings: {
    termCode: number;
    courseUuid: string;
    cumulative: GradeDistribution;
  }[];
}

interface CourseTermData extends GradeDistribution {
  termCode: number;
}

interface CourseGradesData {
  terms: Record<number, CourseTermData>;
  uuid: string;
}

interface ProcessedCourse {
  uuid: string;
  cumulative: GradeDistribution;
  terms: CourseTermData[];
  latestTerm: number;
}

interface ProcessedInstructorGrades extends InstructorGradesResponse {
  courses: ProcessedCourse[];
}

const requestInstructorGrades = (id: number) => {
  return {
    type: actionTypes.REQUEST_INSTRUCTOR_GRADES,
    id,
  };
};

const receiveInstructorGrades = (id: number, data: ProcessedInstructorGrades) => {
  return {
    type: actionTypes.RECEIVE_INSTRUCTOR_GRADES,
    id,
    data,
  };
};

export const fetchInstructorGrades =
  (id: number) =>
  async (dispatch: Dispatch, getState: () => RootState, api: Api): Promise<void> => {
    const state = getState();
    const gradesDataEntry = state.grades.instructors.data[id];
    const gradesData: InstructorGradesResponse | undefined = gradesDataEntry?.courseOfferings
      ? (gradesDataEntry as unknown as InstructorGradesResponse)
      : undefined;

    // don't fetch again
    if (gradesData) {
      return;
    }

    // request action
    dispatch(requestInstructorGrades(id));

    // get json
    const fetchedGradesData = (await api.getInstructorGrades(id)) as InstructorGradesResponse;

    const byCourse: Record<string, CourseGradesData> = {};

    // iterate each offering
    fetchedGradesData.courseOfferings.forEach(offering => {
      const { termCode, courseUuid } = offering;

      const courseGrades =
        byCourse[courseUuid] ?? (byCourse[courseUuid] = { terms: {}, uuid: courseUuid });

      const { terms } = courseGrades;
      let base = utils.grades.zero();

      if (termCode in terms) {
        base = terms[termCode];
      }

      // combine existing with new offering
      terms[termCode] = utils.grades.combine(base, offering.cumulative);
      terms[termCode].termCode = termCode;
    });

    // we arrange the data by course as well
    const processedGradesData = fetchedGradesData as ProcessedInstructorGrades;
    processedGradesData.courses = [];

    // iterate each course key
    Object.keys(byCourse).forEach(courseKey => {
      const data = byCourse[courseKey];
      const terms: CourseTermData[] = [];

      // each term for the course gets added to array instead of map
      Object.keys(data.terms).forEach(termKey => {
        const termData = data.terms[parseInt(termKey)];
        terms.push(termData);
      });

      // track latest term taught
      const latestTerm = terms.reduce((max, t) => Math.max(max, t.termCode), 0);

      // combine all terms
      const cumulative = utils.grades.combineAll(terms);

      // add course to data
      processedGradesData.courses.push({
        uuid: data.uuid,
        cumulative,
        terms,
        latestTerm,
      });
    });

    // sort courses by most recent teachings first
    processedGradesData.courses.sort((a, b) => b.latestTerm - a.latestTerm);

    // receive action
    dispatch(receiveInstructorGrades(id, processedGradesData));
  };
