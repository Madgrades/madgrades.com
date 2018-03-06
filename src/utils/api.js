
export function create(url, apiToken) {
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

    return await fetch(this.url + path + queryString, {
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

  async getCourse(uuid)  {
    let res = await this._fetchPath(`courses/${uuid}`);
    return res.json();
  }

  async searchCourses(query, page) {
    let res = await this._fetchPath('courses', {
      query: query,
      page: page,
      per_page: 100
    });
    return res.json();
  }

  /**
   * Performs a complex course search/filter with optional sorting.
   */
  async filterCourses(params, page) {
    let { query, subjects, instructors, sort, order } = params;

    let subjectParam = Array.isArray(subjects) && subjects.join(',');
    let instructorParam = Array.isArray(instructors) && instructors.join(',');
    let sortParam = sort;
    let orderParam = order;

    let queryString = {
      sort: sortParam,
      order: orderParam,
      page: page,
      per_page: 100
    };

    if (subjectParam) {
      queryString.subject = subjectParam;
    }

    if (instructorParam) {
      queryString.instructor = instructorParam;
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

  async getInstructorGrades(id) {
    let res = await this._fetchPath('instructors/' + id + '/grades');
    return res.json();
  }
}