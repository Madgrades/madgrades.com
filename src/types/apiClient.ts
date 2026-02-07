import type {
  Term,
  Subject,
  Course,
  Instructor,
  CourseSearchResponse,
  InstructorSearchResponse,
  SubjectSearchResponse,
  CourseGradesResponse,
  InstructorGradesResponse,
  CourseFilterParams,
  ExploreCoursesResponse,
  ExploreInstructorsResponse,
  ExploreSubjectsResponse,
} from './api';

export interface ApiClient {
  getSubject(code: string): Promise<Subject>;
  searchSubjects(query: string, page: number): Promise<SubjectSearchResponse>;
  getTerms(): Promise<Term[]>;
  getCourse(uuid: string): Promise<Course>;
  filterCourses(params: CourseFilterParams, page: number): Promise<CourseSearchResponse>;
  getCourseGrades(uuid: string): Promise<CourseGradesResponse>;
  getInstructor(id: number): Promise<Instructor>;
  getInstructorGrades(id: number): Promise<InstructorGradesResponse>;
  searchInstructors(query: string, page: number): Promise<InstructorSearchResponse>;
  exploreCourses(params: Record<string, string | number | undefined>): Promise<ExploreCoursesResponse>;
  exploreInstructors(params: Record<string, string | number | undefined>): Promise<ExploreInstructorsResponse>;
  exploreSubjects(params: Record<string, string | number | undefined>): Promise<ExploreSubjectsResponse>;
}
