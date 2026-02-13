import * as actionTypes from "../actionTypes";

export const setCourseFilterParams = (params) => {
  return {
    type: actionTypes.SET_COURSE_FILTER_PARAMS,
    params,
  };
};

const receiveTerms = (termsData) => {
  return {
    type: actionTypes.RECEIVE_TERMS,
    terms: termsData,
  };
};

export const fetchTerms = () => async (dispatch, getState, api) => {
  const state = getState();
  let termsData = state.terms;

  // don't fetch again
  if (termsData) return;

  // perform request
  termsData = await api.getTerms();

  // receive action
  dispatch(receiveTerms(termsData));
};

export const setTheme = (theme) => {
  return {
    type: actionTypes.SET_THEME,
    theme,
  };
};

export const toggleTheme = () => (dispatch, getState) => {
  const currentTheme = getState().app.theme;
  const newTheme = currentTheme === "light" ? "dark" : "light";
  localStorage.setItem("madgrades-theme", newTheme);
  dispatch(setTheme(newTheme));
};
