
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

export const gpa = (dist) => {
  const numer = dist.aCount * 4.0 +
      dist.abCount * 3.5 +
      dist.bCount * 3.0 +
      dist.bcCount * 2.5 +
      dist.cCount * 2.0 +
      dist.dCount * 1.0;
  const denom = dist.total;
  return numer / denom;
};

export const zero = () => {
  const result = {
    total: 0
  };
  getGradeKeys(true).forEach(key => {
    result[key] = 0;
  });
  return result;
};

export const combine = (a, b) => {
  let result = zero();
  result.total = (a.total || 0) + (b.total || 0);
  getGradeKeys(true).forEach(key => {
    result[key] = (a[key] || 0) + (b[key] || 0)
  });
  return result;
};

export const combineAll = (list) => {
  let result = zero();
  list.forEach(grade => {
    result = combine(result, grade);
  });
  return result;
};