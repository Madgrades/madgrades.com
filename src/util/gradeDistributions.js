
const GRADE_KEYS = [
  'aCount',
  'abCount',
  'bCount',
  'bcCount',
  'cCount',
  'dCount',
  'fCount'
];

export const getGradeKeys = (includeMisc) => {
  // todo: do include misc thing
  return GRADE_KEYS;
};

export const keyToName = (key) => key.replace("Count", "").toUpperCase();

export const zero = () => {
  const result = {
    count: 0,
    gpa: null
  };
  getGradeKeys(true).forEach(key => {
    result[key] = 0;
  });
  return result;
};

export const combine = (a, b) => {
  let result = zero();
  result.count = (a.count || 0) + (b.count || 0);
  getGradeKeys(true).forEach(key => {
    result[key] = (a[key] || 0) + (b[key] || 0)
  });
  // todo: combine 2 gpa's
  return result;
};

export const combineAll = (list) => {
  let result = zero();
  list.forEach(grade => {
    result = combine(result, grade);
  });
  return result;
};