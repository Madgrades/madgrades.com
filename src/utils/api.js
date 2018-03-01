
export function create(url, apiToken) {
  return new Api(url, apiToken);
}

class Api {
  constructor(url, apiToken) {
    this.url = url;
    this.apiToken = apiToken;
  }

  /**
   * performs an api http request with the api token header
   * @param path
   * @returns {Promise.<*>}
   * @private
   */
  async _fetchPath(path) {
    return await fetch(this.url + path, {
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

  async getCourse(uuid)  {
    let res = await this._fetchPath('courses/' + uuid);
    return res.json();
  }

  async searchCourses(query, page) {
    let res = await this._fetchPath('courses/search?query=' + encodeURIComponent(query) + '&page=' + page);
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
    let res = await this._fetchPath('instructors/search?query=' + encodeURIComponent(query) + '&page=' + page);
    return res.json();
  }

  async getInstructorGrades(id) {
    let res = await this._fetchPath('instructors/' + id + '/grades');
    return res.json();
  }
}