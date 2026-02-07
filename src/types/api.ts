// Core entities
export interface Term {
  code: number;
  name: string;
}

export interface Subject {
  code: string;
  name: string;
  abbreviation?: string;
}

export interface Instructor {
  id: number;
  name: string;
}

export interface Course {
  uuid: string;
  name: string;
  number: number;
  credits: number;
  subjects: Subject[];
}

// Grade distribution - using compatible type with utils/grades.ts
export interface GradeDistribution {
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
  total?: number;
  [key: string]: number | undefined;
}

// Course offerings and sections
export interface Section {
  uuid: string;
  sectionNumber: number;
  instructors: Instructor[];
  scheduleNumber: number;
  roomUuid?: string;
  facilityCode?: string;
  roomCode?: string;
  termCode: number;
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
  total?: number;
  [key: string]: string | number | Instructor[] | undefined;
}

export interface CourseOffering {
  uuid: string;
  courseUuid: string;
  termCode: number;
  name: string;
  sections: Section[];
  cumulative: GradeDistribution;
}

// Instructor with grade data
export interface InstructorWithGrades {
  id: number;
  name: string;
  cumulative: GradeDistribution;
  terms: Array<GradeDistribution & { termCode: number }>;
  latestTerm: number;
}

// Course with grade data
export interface CourseWithGrades {
  uuid: string;
  cumulative: GradeDistribution;
  terms: Array<GradeDistribution & { termCode: number }>;
  latestTerm: number;
}

// API response types
export interface CourseGradesResponse {
  courseOfferings: CourseOffering[];
  instructors?: InstructorWithGrades[];
}

export interface InstructorGradesResponse {
  courseOfferings: Array<CourseOffering & { courseUuid: string }>;
  courses?: CourseWithGrades[];
}

export interface PaginatedResponse<T> {
  results: T[];
  total: number;
  page: number;
  perPage: number;
}

export type CourseSearchResponse = PaginatedResponse<Course>;
export type InstructorSearchResponse = PaginatedResponse<Instructor>;
export type SubjectSearchResponse = PaginatedResponse<Subject>;

// Explore entry types
export interface ExploreCourseEntry {
  course: Course;
  countAvg: number;
  gpaTotal: number;
  gpa: number;
}

export interface ExploreInstructorEntry {
  instructor: Instructor;
  countAvg: number;
  gpaTotal: number;
  gpa: number;
}

export interface ExploreSubjectEntry {
  subject: Subject;
  countAvg: number;
  gpaTotal: number;
  gpa: number;
}

// Explore responses - these can have additional properties from the API
export interface ExploreCoursesResponse {
  results: ExploreCourseEntry[];
  totalPages: number;
}

export interface ExploreInstructorsResponse {
  results: ExploreInstructorEntry[];
  totalPages: number;
}

export interface ExploreSubjectsResponse {
  results: ExploreSubjectEntry[];
  totalPages: number;
}

// Filter/search params
export interface CourseFilterParams {
  query?: string;
  subjects?: string | string[];
  instructors?: string | string[];
  sort?: string;
  order?: 'asc' | 'desc';
}
