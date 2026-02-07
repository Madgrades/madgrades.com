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
} from '../types/api';

export function create(url: string | undefined, apiToken: string | undefined) {
  if (!url)
    throw new Error(
      'Madgrades API url not provided! This ' +
      'probably means you did not create a .env file as ' +
      'documented at https://github.com/Madgrades/madgrades.com'
    );

  if (!apiToken) {
    console.warn(
      'Madgrades API token not provided. API calls will fail. ' +
      'Add VITE_MADGRADES_API_TOKEN to your .env file.'
    );
  }

  return new Api(url, apiToken || '');
}

interface QueryParams {
  [key: string]: string | number | undefined;
}

class Api {
  private url: string;
  private apiToken: string;

  constructor(url: string, apiToken: string) {
    this.url = url;
    this.apiToken = apiToken;
  }

  private _queryString = (params: QueryParams): string => Object.keys(params)
    .filter(k => params[k] !== undefined)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(String(params[k])))
    .join('&');

  private async _fetchPath(path: string, params?: QueryParams): Promise<Response> {
    let queryString = '';
    if (params) {
      queryString = '?' + this._queryString(params);
    }

    return await fetch(this.url + 'v1/' + path + queryString, {
      method: 'get',
      headers: {
        'Authorization': 'Token token=' + this.apiToken
      }
    });
  }

  async getSubject(code: string): Promise<Subject> {
    const res = await this._fetchPath('subjects/' + code);
    return res.json();
  }

  async searchSubjects(query: string, page: number): Promise<SubjectSearchResponse> {
    const res = await this._fetchPath('subjects', {
      query: query,
      page: page,
      per_page: 100
    });
    return res.json();
  }

  async getTerms(): Promise<Term[]> {
    const res = await this._fetchPath('terms');
    return res.json();
  }

  async getCourse(uuid: string): Promise<Course> {
    const res = await this._fetchPath(`courses/${uuid}`);
    return res.json();
  }

  /**
   * Performs a complex course search/filter with optional sorting.
   */
  async filterCourses(params: CourseFilterParams, page: number): Promise<CourseSearchResponse> {
    const { query, subjects, instructors, sort, order } = params;

    const subjectParam = Array.isArray(subjects) ? subjects.join(',') : subjects;
    const instructorParam = Array.isArray(instructors) ? instructors.join(',') : instructors;

    const queryString: QueryParams = {
      page: page,
      per_page: 25
    };

    if (subjectParam) {
      queryString['subject'] = subjectParam;
    }

    if (instructorParam) {
      queryString['instructor'] = instructorParam;
    }

    if (sort) {
      queryString['sort'] = sort;
    }

    if (order) {
      queryString['order'] = order;
    }

    if (query) {
      queryString['query'] = query;
    }

    const res = await this._fetchPath('courses', queryString);
    return res.json();
  }

  async getCourseGrades(uuid: string): Promise<CourseGradesResponse> {
    const res = await this._fetchPath('courses/' + uuid + '/grades');
    return res.json();
  }

  async getInstructor(id: number): Promise<Instructor> {
    const res = await this._fetchPath('instructors/' + id);
    return res.json();
  }

  async getInstructorGrades(id: number): Promise<InstructorGradesResponse> {
    const res = await this._fetchPath('instructors/' + id + '/grades');
    return res.json();
  }

  async searchInstructors(query: string, page: number): Promise<InstructorSearchResponse> {
    const res = await this._fetchPath('instructors', {
      query: query,
      page: page,
      per_page: 100
    });
    return res.json();
  }

  async exploreCourses(params: QueryParams): Promise<ExploreCoursesResponse> {
    const res = await this._fetchPath('explore/courses', params);
    return res.json();
  }

  async exploreInstructors(params: QueryParams): Promise<ExploreInstructorsResponse> {
    const res = await this._fetchPath('explore/instructors', params);
    return res.json();
  }

  async exploreSubjects(params: QueryParams): Promise<ExploreSubjectsResponse> {
    const res = await this._fetchPath('explore/subjects', params);
    return res.json();
  }
}
