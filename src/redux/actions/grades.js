import * as actionTypes from '../actionTypes';
import utils from '../../utils';

const requestCourseGrades = (uuid) => {
  return {
    type: actionTypes.REQUEST_COURSE_GRADES,
    uuid
  }
};

const receiveCourseGrades = (uuid, data) => {
  return {
    type: actionTypes.RECEIVE_COURSE_GRADES,
    uuid,
    data
  }
};

export const fetchCourseGrades = (uuid) => async (dispatch, getState, api) => {
  const state = getState();
  let gradesData = state.grades.courses.data[uuid];

  // don't fetch again
  if (gradesData)
    return;

  // request action
  dispatch(requestCourseGrades(uuid));

  // perform request
  // we process this data bit so we can view by instructor
  gradesData = await api.getCourseGrades(uuid);


  let byInstructor = {};
  let instructorNames = {};

  // iterate each offering
  gradesData.courseOfferings.forEach(offering => {
    const { termCode } = offering;

    // each section
    offering.sections.forEach(section => {

      // each instructor for the section
      section.instructors.forEach(instructor => {
        const { id, name } = instructor;
        instructorNames[id] = name;

        // add or put instructor in map
        let instructorGrades = byInstructor[id];
        if (!instructorGrades) {
          instructorGrades = {terms: {}, id: id};
          byInstructor[id] = instructorGrades;
        }

        let { terms } = instructorGrades;
        let base = utils.grades.zero();

        if (termCode in terms)
          base = terms[termCode];

        // combine existing with new section
        terms[termCode] = utils.grades.combine(base, section);
        terms[termCode].termCode = termCode;
      });
    })
  });

  // we arrange the data by instructor as well
  gradesData.instructors = [];

  // iterate each instructor key
  Object.keys(byInstructor).forEach(instructorKey => {
    let data = byInstructor[instructorKey];
    let terms = [];
    let latestTerm = 0;

    // each term for the instructor gets added to array instead of map
    Object.keys(data.terms).forEach(termKey => {
      const termData = data.terms[termKey];
      const { termCode } = termData;
      terms.push(termData);

      // track latest term taught
      if (termCode > latestTerm)
        latestTerm = termCode;
    });

    // combine all terms
    let cumulative = utils.grades.combineAll(terms);

    // add instructor to data
    gradesData.instructors.push({
      id: data.id,
      name: instructorNames[data.id],
      cumulative,
      terms,
      latestTerm
    })
  });

  // sort instructors by most recent teachings first
  gradesData.instructors.sort((a, b) => b.latestTerm - a.latestTerm);

  // receive action
  dispatch(receiveCourseGrades(uuid, gradesData));
};

const requestInstructorGrades = (id) => {
  return {
    type: actionTypes.REQUEST_INSTRUCTOR_GRADES,
    id
  }
};

const receiveInstructorGrades = (id, data) => {
  return {
    type: actionTypes.RECEIVE_INSTRUCTOR_GRADES,
    id,
    data
  }
};

export const fetchInstructorGrades = (id) => async (dispatch, getState, api) => {
  const state = getState();
  let gradesData = state.grades.instructors.data[id];

  // don't fetch again
  if (gradesData)
    return;

  // request action
  dispatch(requestInstructorGrades(id));

  // get json
  gradesData = await api.getInstructorGrades(id);


  let byCourse = {};

  // iterate each offering
  gradesData.courseOfferings.forEach(offering => {
    const { termCode, courseUuid } = offering;

    let courseGrades = byCourse[courseUuid];
    if (!courseGrades) {
      courseGrades = {terms: {}, uuid: courseUuid};
      byCourse[courseUuid] = courseGrades;
    }

    let { terms } = courseGrades;
    let base = utils.grades.zero();

    if (termCode in terms)
      base = terms[termCode];

    // combine existing with new offering
    terms[termCode] = utils.grades.combine(base, offering.cumulative);
    terms[termCode].termCode = termCode;
  });

  // we arrange the data by instructor as well
  gradesData.courses = [];

  // iterate each instructor key
  Object.keys(byCourse).forEach(instructorKey => {
    let data = byCourse[instructorKey];
    let terms = [];
    let latestTerm = 0;

    // each term for the instructor gets added to array instead of map
    Object.keys(data.terms).forEach(termKey => {
      const termData = data.terms[termKey];
      const { termCode } = termData;
      terms.push(termData);

      // track latest term taught
      if (termCode > latestTerm)
        latestTerm = termCode;
    });

    // combine all terms
    let cumulative = utils.grades.combineAll(terms);

    // add instructor to data
    gradesData.courses.push({
      uuid: data.uuid,
      cumulative,
      terms,
      latestTerm
    })
  });

  // sort instructors by most recent teachings first
  gradesData.courses.sort((a, b) => b.latestTerm - a.latestTerm);

  // receive action
  dispatch(receiveInstructorGrades(id, gradesData));
};