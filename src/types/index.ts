// Global type definitions
export interface Course {
  uuid: string;
  name: string;
  number: string;
  subjects: Subject[];
  credits?: number;
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

export interface Term {
  code: number;
  name: string;
}

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
}

export interface CourseOffering {
  uuid: string;
  termCode: number;
  sectionType?: string;
  instructor?: Instructor;
  grades?: GradeDistribution;
}

export interface SearchPage<T> {
  totalCount: number;
  results: T[];
}

export interface SearchState<T> {
  pages: Record<number, SearchPage<T>>;
  isFetching?: boolean;
  params?: CourseFilterParams;
  error?: string;
}

export interface SearchPageWithPagination<T> extends SearchPage<T> {
  totalPages: number;
}

export interface CourseFilterParams {
  query?: string;
  subjects?: string[];
  instructors?: number[];
  sort?: string;
  order?: string;
  page?: number;
  compareWith?: string;
}

export interface AppState {
  searchQuery: string;
  courseFilterParams: CourseFilterParams;
  terms: Term[];
}

export interface CoursesState {
  data: Record<string, Course>;
  search: SearchState<Course>;
  grades: Record<string, CourseOffering[]>;
}

export interface SearchResults<T> {
  isFetching?: boolean;
  totalCount?: number;
  results?: T[];
}

export interface InstructorsState {
  data: Record<number, Instructor & { isFetching?: boolean }>;
  search: SearchState<Instructor>;
  searches?: Record<string, Record<number, SearchResults<Instructor>>>;
}

export interface SubjectsState {
  data: Record<string, Subject>;
  search: SearchState<Subject>;
  searches?: Record<string, Record<number, SearchResults<Subject>>>;
}

export interface ExploreParams {
  page?: number;
  sort?: string;
  order?: string;
  min_count_avg?: number;
  min_gpa_total?: number;
  per_page?: number;
  [key: string]: string | number | string[] | number[] | undefined;
}

export interface ExploreData<T> {
  params?: ExploreParams;
  isFetching?: boolean;
  data?: {
    results: T[];
    totalCount: number;
    totalPages: number;
  };
}

export interface ExploreState {
  courses: ExploreData<CourseExploreEntry>;
  instructors: ExploreData<InstructorExploreEntry>;
  subjects: ExploreData<SubjectExploreEntry>;
}

export interface CourseExploreEntry {
  course: Course;
  gpa: number | null;
  gpaTotal: number | null;
  countAvg: number | null;
  rank: number;
}

export interface InstructorExploreEntry {
  instructor: Instructor;
  gpa: number | null;
  gpaTotal: number | null;
  countAvg: number | null;
  rank: number;
}

export interface SubjectExploreEntry {
  subject: Subject;
  gpa: number | null;
  gpaTotal: number | null;
  countAvg: number | null;
  rank: number;
}

export interface InstructorTermData extends GradeDistribution {
  termCode: number;
}

export interface ProcessedInstructor {
  id: number;
  name: string;
  cumulative: GradeDistribution;
  terms: InstructorTermData[];
  latestTerm: number;
}

export interface CourseOfferingData {
  termCode: number;
  sections: ({
    instructors: {
      id: number;
      name: string;
    }[];
  } & GradeDistribution)[];
  cumulative?: GradeDistribution;
}

export interface CourseTermData extends GradeDistribution {
  termCode: number;
}

export interface ProcessedCourse {
  uuid: string;
  cumulative: GradeDistribution;
  terms: CourseTermData[];
  latestTerm: number;
}

export interface CourseGradeData {
  isFetching?: boolean;
  courseOfferings?: CourseOfferingData[];
  instructors?: ProcessedInstructor[];
}

export interface InstructorGradeData {
  isFetching?: boolean;
  courseOfferings?: {
    termCode: number;
    courseUuid: string;
    cumulative: GradeDistribution;
  }[];
  courses?: ProcessedCourse[];
}

export interface GradeData {
  isFetching?: boolean;
  cumulative?: GradeDistribution;
  byTerm?: Record<number, GradeDistribution>;
  byInstructor?: Record<number, GradeDistribution>;
}

export interface GradesState {
  courses: {
    data: Record<string, CourseGradeData>;
  };
  instructors: {
    data: Record<number, InstructorGradeData>;
  };
}

export interface RootState {
  app: AppState;
  courses: CoursesState;
  instructors: InstructorsState;
  subjects: SubjectsState;
  explore: ExploreState;
  grades: GradesState;
}

// Redux action types
export interface ReduxAction<T = void> {
  type: string;
  payload?: T;
}

// Pagination event types for Semantic UI
export interface PaginationData {
  activePage: number;
}

// React event types
export type ReactChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;
export type ReactFormEvent = React.FormEvent<HTMLFormElement>;
export type ReactMouseEvent = React.MouseEvent<HTMLElement>;

// HOC prop types
export interface WithNavigateProps {
  navigate: (path: string) => void;
}
