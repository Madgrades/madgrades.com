
export function create(url, apiToken) {
  if (!url || !apiToken)
    throw new Error(
      'Madgrades API url or API token not provided! This ' +
      'probably means you did not create a .env file as ' +
      'documented at https://github.com/Madgrades/madgrades.com'
    );

  return new Api(url, apiToken);
}

class Api {
  constructor(url, apiToken) {
    this.url = url;
    this.apiToken = apiToken;
  }

  _queryString = (params) => Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

  async _fetchPath(path, params) {
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

  async getSubject(code)  {
    let res = await this._fetchPath('subjects/' + code);
    return res.json();
  }

  async searchSubjects(query, page) {
    let res = await this._fetchPath('subjects', {
      query: query,
      page: page,
      per_page: 100
    });
    return res.json();
  }

  async getTerms() {
    let res = await this._fetchPath('terms');
    return res.json();
  }

  async getCourse(uuid)  {
    let res = await this._fetchPath(`courses/${uuid}`);
    return res.json();
  }

  /**
   * Performs a complex course search/filter with optional sorting.
   */
  async filterCourses(params, page) {
    let { query, subjects, instructors, sort, order } = params;

    let subjectParam = Array.isArray(subjects) && subjects.join(',');
    let instructorParam = Array.isArray(instructors) && instructors.join(',');

    let queryString = {
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

    let res = await this._fetchPath('courses', queryString);
    return res.json();
  }

  async getCourseGrades(uuid)  {
    let res = await this._fetchPath('courses/' + uuid + '/grades');
    return res.json();
  }

  async getInstructor(id)  {
    let res = await this._fetchPath('instructors/' + id);
    return res.json();
  }

  async searchInstructors(query, page) {
    let res = await this._fetchPath('instructors', {
      query: query,
      page: page,
      per_page: 100
    });
    return res.json();
  }

  async exploreCourses(params) {
    let res = await this._fetchPath('explore/courses', params);
    return res.json();
  }

  async exploreInstructors(params) {
    let res = await this._fetchPath('explore/instructors', params);
    return res.json();
  }

  async exploreSubjects(params) {
    let res = await this._fetchPath('explore/subjects', params);
    return res.json();
  }
}