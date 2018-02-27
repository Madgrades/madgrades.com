
const SEASON_IDS = {
  4: "Spring",
  6: "Summer",
  2: "Fall"
};

export const toName = (termCode) => {
  let seasonId = termCode % 10;
  let termYear = Math.round(termCode / 10);

  let offset = termYear - 101;
  if (seasonId === 2)
    offset -= 1;

  let calendarYear = 2001 + offset
  let season = SEASON_IDS[seasonId];
  return `${season} ${calendarYear}`
};