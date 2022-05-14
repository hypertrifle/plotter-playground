export function distanceBetweenPoints(
  point1: [number, number],
  point2: [number, number]
) {
  return Math.hypot(point2[0] - point1[0], point2[1] - point1[1]);
}
