import {setCourseFilterParams, setSearchQuery} from "./app";
import {
  fetchAdvancedCourseSearch, fetchCourse,
  fetchCourseSearch
} from "./courses";
import {fetchCourseGrades} from "./grades";
import {fetchInstructor, fetchInstructorSearch} from "./instructors";
import {fetchSubject, fetchSubjectSearch} from "./subjects";

export default {
  setSearchQuery,
  setCourseFilterParams,
  fetchSubject,
  fetchSubjectSearch,
  fetchCourse,
  fetchAdvancedCourseSearch,
  fetchCourseSearch,
  fetchCourseGrades,
  fetchInstructor,
  fetchInstructorSearch
}