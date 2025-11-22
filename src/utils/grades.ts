export interface GradeDistribution {
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
}

type GradeKey = keyof GradeDistribution;

const GPA_KEYS: readonly GradeKey[] = [
  'aCount',
  'abCount',
  'bCount',
  'bcCount',
  'cCount',
  'dCount',
  'fCount'
] as const;

const ALL_KEYS: readonly GradeKey[] = [
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

export const getGradeKeys = (includeMisc: boolean): readonly GradeKey[] => {
  if (includeMisc) {
    return ALL_KEYS;
  }
  return GPA_KEYS;
};

export const keyToName = (key: string): string => 
  key.replace('Count', '').toUpperCase();

export const gpaCount = (dist: GradeDistribution): number =>
  dist.aCount + dist.abCount + dist.bCount + dist.bcCount +
  dist.cCount + dist.dCount + dist.fCount;

export const formatGpa = (gpa: number): string => {
  if (isNaN(gpa)) {
    return 'N/A';
  }
  return gpa.toFixed(2);
};

export const gpa = (dist: GradeDistribution, format?: boolean): number | string => {
  const count = gpaCount(dist);

  if (count === 0) {
    if (format) {
      return formatGpa(NaN);
    }
    return NaN;
  }

  const weighted = dist.aCount * 4.0 +
    dist.abCount * 3.5 +
    dist.bCount * 3.0 +
    dist.bcCount * 2.5 +
    dist.cCount * 2.0 +
    dist.dCount * 1.0;
  const result = weighted / count;

  if (format) {
    return formatGpa(result);
  }
  return result;
};

export const zero = (): GradeDistribution => {
  const result: any = {
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
  return result as GradeDistribution;
};

export const combine = (a: GradeDistribution, b: GradeDistribution): GradeDistribution => {
  const result = zero();
  result.total = (a.total || 0) + (b.total || 0);
  getGradeKeys(true).forEach(key => {
    (result as any)[key] = ((a as any)[key] || 0) + ((b as any)[key] || 0);
  });
  return result;
};

export const combineAll = (list: GradeDistribution[]): GradeDistribution => {
  let result = zero();
  list.forEach(grade => {
    result = combine(result, grade);
  });
  return result;
};
