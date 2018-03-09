import * as actionTypes from "../actionTypes";
import utils from "../../utils";

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

  // iterate each offering
  gradesData.courseOfferings.forEach(offering => {
    const { termCode } = offering;

    // each section
    offering.sections.forEach(section => {

      // each instructor for the section
      section.instructors.forEach(instructor => {

        // add or put instructor in map
        let instructorGrades = byInstructor[instructor];
        if (!instructorGrades) {
          instructorGrades = {terms: {}, id: instructor};
          byInstructor[instructor] = instructorGrades;
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