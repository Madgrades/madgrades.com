import type { 
  Subject, 
  Course, 
  Instructor, 
  Term, 
  CourseFilterParams, 
  ExploreParams, 
  PagedResponse, 
  CourseGrade 
} from '../types/api';

export function create(url: string, apiToken: string) {
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

  return new Api(url, apiToken);
}

class Api {
  private url: string;
  private apiToken: string;

  constructor(url: string, apiToken: string) {
    this.url = url;
    this.apiToken = apiToken;
  }

  private _queryString = (params: Record<string, string | number>): string => Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

  private async _fetchPath(path: string, params?: Record<string, string | number>): Promise<Response> {
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

  async getSubject(code: string): Promise<Subject>  {
    const res = await this._fetchPath('subjects/' + code);
    return res.json();
  }

  async searchSubjects(query: string, page: number): Promise<PagedResponse<Subject>> {
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

  async getCourse(uuid: string): Promise<Course>  {
    const res = await this._fetchPath(`courses/${uuid}`);
    return res.json();
  }

  /**
   * Performs a complex course search/filter with optional sorting.
   */
  async filterCourses(params: CourseFilterParams, page: number): Promise<PagedResponse<Course>> {
    const { query, subjects, instructors, sort, order } = params;

    const subjectParam = Array.isArray(subjects) && subjects.join(',');
    const instructorParam = Array.isArray(instructors) && instructors.join(',');

    const queryString: Record<string, string | number> = {
      page: page,
      per_page: 25
    };

    if (subjectParam) {
      queryString.subject = subjectParam;
    }

    if (instructorParam) {
      queryString.instructor = instructorParam;
    }

    if (sort) {
      queryString.sort = sort;
    }

    if (order) {
      queryString.order = order
    }

    if (query) {
      queryString.query = query;
    }

    const res = await this._fetchPath('courses', queryString);
    return res.json();
  }

  async getCourseGrades(uuid: string): Promise<CourseGrade[]>  {
    const res = await this._fetchPath('courses/' + uuid + '/grades');
    return res.json();
  }

  async getInstructor(id: number): Promise<Instructor>  {
    const res = await this._fetchPath('instructors/' + id);
    return res.json();
  }

  async searchInstructors(query: string, page: number): Promise<PagedResponse<Instructor>> {
    const res = await this._fetchPath('instructors', {
      query: query,
      page: page,
      per_page: 100
    });
    return res.json();
  }

  async exploreCourses(params: ExploreParams): Promise<PagedResponse<Course>> {
    const res = await this._fetchPath('explore/courses', params as Record<string, string | number>);
    return res.json();
  }

  async exploreInstructors(params: ExploreParams): Promise<PagedResponse<Instructor>> {
    const res = await this._fetchPath('explore/instructors', params as Record<string, string | number>);
    return res.json();
  }

  async exploreSubjects(params: ExploreParams): Promise<PagedResponse<Subject>> {
    const res = await this._fetchPath('explore/subjects', params as Record<string, string | number>);
    return res.json();
  }
}