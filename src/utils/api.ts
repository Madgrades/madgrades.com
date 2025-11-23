import { Term } from '../types';

export function create(url: string, apiToken: string) {
  if (!url || !apiToken) {
    throw new Error(
      'Madgrades API url or API token not provided! This ' +
        'probably means you did not create a .env file as ' +
        'documented at https://github.com/Madgrades/madgrades.com'
    );
  }

  return new Api(url, apiToken);
}

export class Api {
  url: string;
  apiToken: string;

  constructor(url: string, apiToken: string) {
    this.url = url;
    this.apiToken = apiToken;
  }

  _queryString = (params: Record<string, string | number | boolean>) =>
    Object.keys(params)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&');

  async _fetchPath(
    path: string,
    params?: Record<string, string | number | boolean>
  ): Promise<Response> {
    let queryString = '';
    if (params) {
      queryString = `?${this._queryString(params)}`;
    }

    return await fetch(`${this.url}v1/${path}${queryString}`, {
      method: 'get',
      headers: {
        Authorization: `Token token=${this.apiToken}`,
      },
    });
  }

  async getSubject(code: string): Promise<unknown> {
    const res = await this._fetchPath(`subjects/${code}`);
    return res.json() as Promise<unknown>;
  }

  async searchSubjects(query: string, page: number): Promise<unknown> {
    const res = await this._fetchPath('subjects', {
      query: query,
      page: page,
      per_page: 100,
    });
    return res.json() as Promise<unknown>;
  }

  async getTerms(): Promise<Term[]> {
    const res = await this._fetchPath('terms');
    return res.json() as Promise<Term[]>;
  }

  async getCourse(uuid: string): Promise<unknown> {
    const res = await this._fetchPath(`courses/${uuid}`);
    return res.json() as Promise<unknown>;
  }

  /**
   * Performs a complex course search/filter with optional sorting.
   */
  async filterCourses(
    params: {
      query?: string;
      subjects?: string[];
      instructors?: number[];
      sort?: string;
      order?: string;
    },
    page: number
  ): Promise<unknown> {
    const { query, subjects, instructors, sort, order } = params;

    const subjectParam = Array.isArray(subjects) && subjects.join(',');
    const instructorParam = Array.isArray(instructors) && instructors.join(',');

    const queryString: Record<string, string | number | boolean> = {
      page: page,
      per_page: 25,
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
      queryString.order = order;
    }

    if (query) {
      queryString.query = query;
    }

    const res = await this._fetchPath('courses', queryString);
    return res.json() as Promise<unknown>;
  }

  async getCourseGrades(uuid: string): Promise<unknown> {
    const res = await this._fetchPath(`courses/${uuid}/grades`);
    return res.json() as Promise<unknown>;
  }

  async getInstructor(id: number): Promise<unknown> {
    const res = await this._fetchPath(`instructors/${String(id)}`);
    return res.json() as Promise<unknown>;
  }

  async getInstructorGrades(id: number): Promise<unknown> {
    const res = await this._fetchPath(`instructors/${String(id)}/grades`);
    return res.json() as Promise<unknown>;
  }

  async searchInstructors(query: string, page: number): Promise<unknown> {
    const res = await this._fetchPath('instructors', {
      query: query,
      page: page,
      per_page: 100,
    });
    return res.json() as Promise<unknown>;
  }

  async exploreCourses(params: Record<string, string | number | boolean>): Promise<unknown> {
    const res = await this._fetchPath('explore/courses', params);
    return res.json() as Promise<unknown>;
  }

  async exploreInstructors(params: Record<string, string | number | boolean>): Promise<unknown> {
    const res = await this._fetchPath('explore/instructors', params);
    return res.json() as Promise<unknown>;
  }

  async exploreSubjects(params: Record<string, string | number | boolean>): Promise<unknown> {
    const res = await this._fetchPath('explore/subjects', params);
    return res.json() as Promise<unknown>;
  }
}
