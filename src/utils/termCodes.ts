
const SEASON_IDS: Record<number, string> = {
  4: 'Spring',
  6: 'Summer',
  2: 'Fall'
};

export const toName = (termCode: number): string => {
  const seasonId = termCode % 10;
  const termYear = Math.round(termCode / 10);

  let offset = termYear - 101;
  if (seasonId === 2)
    offset -= 1;

  const calendarYear = 2001 + offset;
  const season = SEASON_IDS[seasonId];
  return `${season} ${calendarYear}`
};