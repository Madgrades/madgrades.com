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

export interface RootState {
  app: any;
  courses: any;
  instructors: any;
  subjects: any;
  explore: any;
  grades: any;
}
