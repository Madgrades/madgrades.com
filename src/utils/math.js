

export function round(number, places) {
  return +(Math.round(number + "e+" + places) + "e-" + places);
}