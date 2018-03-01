
const GPA_KEYS = [
  'aCount',
  'abCount',
  'bCount',
  'bcCount',
  'cCount',
  'dCount',
  'fCount'
];

const ALL_KEYS = GPA_KEYS.concat([
  'sCount',
  'ubCount',
  'crCount',
  'nCount',
  'pCount',
  'iCount',
  'nwCount',
  'nrCount',
  'otherCount'
]);

export const getGradeKeys = (includeMisc) => {
  // todo: do include misc thing
  if (includeMisc)
    return ALL_KEYS;
  return GPA_KEYS;
};

export const keyToName = (key) => key.replace("Count", "").toUpperCase();

export const zero = () => {
  const result = {
    gpa: null,
    gpaTotal: 0,
    total: 0
  };
  getGradeKeys(true).forEach(key => {
    result[key] = 0;
  });
  return result;
};

export const combine = (a, b) => {
  let result = zero();
  result.gpaTotal = (a.gpaTotal || 0) + (b.gpaTotal || 0);
  result.total = (a.total || 0) + (b.total || 0);
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