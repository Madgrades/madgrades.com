interface GradeDistribution {
  aCount: number;
  abCount: number;
  bCount: number;
  bcCount: number;
  cCount: number;
  dCount: number;
  fCount: number;
  sCount?: number;
  ubCount?: number;
  crCount?: number;
  nCount?: number;
  pCount?: number;
  iCount?: number;
  nwCount?: number;
  nrCount?: number;
  otherCount?: number;
  total?: number;
  [key: string]: number | undefined;
}

const GPA_KEYS = [
  'aCount',
  'abCount',
  'bCount',
  'bcCount',
  'cCount',
  'dCount',
  'fCount'
] as const;

const ALL_KEYS = [
  ...GPA_KEYS,
  'sCount',
  'ubCount',
  'crCount',
  'nCount',
  'pCount',
  'iCount',
  'nwCount',
  'nrCount',
  'otherCount'
] as const;

export const getGradeKeys = (includeMisc: boolean): readonly string[] => {
  if (includeMisc)
    return ALL_KEYS;
  return GPA_KEYS;
};

export const keyToName = (key: string): string => key.replace('Count', '').toUpperCase();

export const gpaCount = (dist: GradeDistribution): number =>
    dist.aCount + dist.abCount + dist.bCount + dist.bcCount +
    dist.cCount + dist.dCount + dist.fCount;

export const formatGpa = (gpa: number): string => {
  if (isNaN(gpa))
    return 'N/A';
  return gpa.toFixed(2);
};

export const gpa = (dist: GradeDistribution, format?: boolean): number | string => {
  const count = gpaCount(dist);

  if (count === 0) {
    if (format)
      return formatGpa(NaN);
    return NaN;
  }

  const weighted = dist.aCount * 4.0 +
      dist.abCount * 3.5 +
      dist.bCount * 3.0 +
      dist.bcCount * 2.5 +
      dist.cCount * 2.0 +
      dist.dCount * 1.0;
  const result = weighted / count;

  if (format)
    return formatGpa(result);
  return result;
};

export const zero = (): GradeDistribution => {
  const result: GradeDistribution = {
    total: 0,
    aCount: 0,
    abCount: 0,
    bCount: 0,
    bcCount: 0,
    cCount: 0,
    dCount: 0,
    fCount: 0
  };
  getGradeKeys(true).forEach(key => {
    result[key] = 0;
  });
  return result;
};

export const combine = (a: Partial<GradeDistribution>, b: Partial<GradeDistribution>): GradeDistribution => {
  const result = zero();
  result.total = (a.total || 0) + (b.total || 0);
  getGradeKeys(true).forEach(key => {
    result[key] = (a[key] || 0) + (b[key] || 0);
  });
  return result;
};

export const combineAll = (list: Partial<GradeDistribution>[]): GradeDistribution => {
  let result = zero();
  list.forEach(grade => {
    result = combine(result, grade);
  });
  return result;
};
