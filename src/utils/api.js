
export function create(url) {
  return new Api(url);
}

class Api {
  constructor(url) {
    this.url = url;
  }

  async getCourse(uuid)  {
    let res = await fetch(this.url + 'courses/' + uuid);
    return res.json();
  }

  async searchCourses(query, page) {
    let res = await fetch(this.url + 'courses/search/' + encodeURIComponent(query) + '?page=' + page);
    return res.json();
  }

  async getCourseGrades(uuid)  {
    let res = await fetch(this.url + 'courses/' + uuid + '/grades');
    return res.json();
  }

  async getInstructor(id)  {
    let res = await fetch(this.url + 'instructors/' + id);
    return res.json();
  }

  async searchInstructors(query, page) {
    let res = await fetch(this.url + 'instructors/search/' + encodeURIComponent(query) + '?page=' + page);
    return res.json();
  }

  async getInstructorGrades(id) {
    let res = await fetch(this.url + 'instructors/' + id + '/grades')
    return res.json();
  }
}