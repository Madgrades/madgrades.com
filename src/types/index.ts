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
  pages: {
    [page: number]: SearchPage<T>;
  };
  loading?: boolean;
  error?: string;
}

export interface CourseFilterParams {
  query?: string;
  subjects?: string[];
  instructors?: number[];
  sort?: string;
  order?: string;
  page?: number;
}

export interface AppState {
  searchQuery: string;
  courseFilterParams: CourseFilterParams;
  terms: Term[];
}

export interface CoursesState {
  data: { [uuid: string]: Course };
  search: SearchState<string>;
  grades: { [uuid: string]: CourseOffering[] };
}

export interface InstructorsState {
  data: { [id: number]: Instructor };
  search: SearchState<number>;
}

export interface SubjectsState {
  data: { [code: string]: Subject };
  search: SearchState<string>;
}

export interface ExploreState {
  courses: Course[];
  instructors: Instructor[];
  subjects: Subject[];
}

export interface GradeData {
  isFetching?: boolean;
  cumulative?: GradeDistribution;
  byTerm?: { [termCode: number]: GradeDistribution };
  byInstructor?: { [instructorId: number]: GradeDistribution };
}

export interface GradesState {
  courses: {
    data: { [uuid: string]: GradeData };
  };
  instructors: {
    data: { [id: number]: GradeData };
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
export interface ReduxAction<T = unknown> {
  type: string;
  payload?: T;
}
