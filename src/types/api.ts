// API Response Types
export interface Term {
  code: number;
  name: string;
}

export interface Subject {
  code: string;
  name: string;
  abbreviation?: string;
}

export interface Course {
  uuid: string;
  name: string;
  number: number;
  subjects: Subject[];
}

export interface Instructor {
  id: number;
  name: string;
}

export interface GradeDistribution {
  a: number;
  ab: number;
  b: number;
  bc: number;
  c: number;
  d: number;
  f: number;
  p: number;
  other: number;
}

export interface CourseGrade {
  course: Course;
  termCode: number;
  sectionType?: string;
  instructor?: Instructor;
  gradeDistribution: GradeDistribution;
}

export interface InstructorGrade {
  instructor: Instructor;
  course: Course;
  termCode: number;
  sectionType?: string;
  gradeDistribution: GradeDistribution;
}

export interface PagedResponse<T> {
  results: T[];
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
}

export interface CourseFilterParams {
  query?: string;
  subjects?: string[];
  instructors?: number[];
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ExploreParams {
  term?: number;
  subject?: string;
  instructors?: number[];
  sort?: string;
  order?: 'asc' | 'desc';
}

// API Class Type
export interface MadgradesApi {
  getSubject(code: string): Promise<Subject>;
  searchSubjects(query: string, page: number): Promise<PagedResponse<Subject>>;
  getTerms(): Promise<Term[]>;
  getCourse(uuid: string): Promise<Course>;
  filterCourses(params: CourseFilterParams, page: number): Promise<PagedResponse<Course>>;
  getCourseGrades(uuid: string): Promise<CourseGrade[]>;
  getInstructor(id: number): Promise<Instructor>;
  searchInstructors(query: string, page: number): Promise<PagedResponse<Instructor>>;
  exploreCourses(params: ExploreParams): Promise<PagedResponse<Course>>;
  exploreInstructors(params: ExploreParams): Promise<PagedResponse<Instructor>>;
  exploreSubjects(params: ExploreParams): Promise<PagedResponse<Subject>>;
}
