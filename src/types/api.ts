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

// Grade distribution
export interface GradeDistribution {
  aCount: number;
  abCount: number;
  bCount: number;
  bcCount: number;
  cCount: number;
  dCount: number;
  fCount: number;
  sCount: number;
  ubCount: number;
  crCount: number;
  nCount: number;
  pCount: number;
  iCount: number;
  nwCount: number;
  nrCount: number;
  otherCount: number;
  total: number;
}

// Course offerings and sections
export interface Section extends GradeDistribution {
  uuid: string;
  sectionNumber: number;
  instructors: Instructor[];
  scheduleNumber: number;
  roomUuid?: string;
  facilityCode?: string;
  roomCode?: string;
  termCode: number;
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
  instructors: InstructorWithGrades[];
}

export interface InstructorGradesResponse {
  courseOfferings: Array<CourseOffering & { courseUuid: string }>;
  courses: CourseWithGrades[];
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

// Explore responses
export interface ExploreCoursesResponse {
  courses: Course[];
  [key: string]: unknown;
}

export interface ExploreInstructorsResponse {
  instructors: Instructor[];
  [key: string]: unknown;
}

export interface ExploreSubjectsResponse {
  subjects: Subject[];
  [key: string]: unknown;
}

// Filter/search params
export interface CourseFilterParams {
  query?: string;
  subjects?: string | string[];
  instructors?: string | string[];
  sort?: string;
  order?: 'asc' | 'desc';
}
