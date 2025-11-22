import {setCourseFilterParams, fetchTerms} from './app';
import {fetchCourse, fetchCourseSearch} from './courses';
import {fetchCourseGrades, fetchInstructorGrades} from './grades';
import {fetchInstructor, fetchInstructorSearch} from './instructors';
import {fetchSubject, fetchSubjectSearch} from './subjects';
import {
  fetchExploreCourses,
  fetchExploreInstructors,
  fetchExploreSubjects
} from './explore';

export default {
  setCourseFilterParams,
  fetchTerms,
  fetchSubject,
  fetchSubjectSearch,
  fetchCourse,
  fetchCourseSearch,
  fetchCourseGrades,
  fetchInstructor,
  fetchInstructorSearch,
  fetchInstructorGrades,
  fetchExploreCourses,
  fetchExploreInstructors,
  fetchExploreSubjects
}