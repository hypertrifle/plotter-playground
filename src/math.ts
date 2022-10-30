/**
 * get the distance between 2 points.
 *
 * @export
 * @param {[number, number]} point1
 * @param {[number, number]} point2
 * @return {number} distance
 */
export function distanceBetweenPoints(
  point1: [number, number],
  point2: [number, number]
) {
  let x = point2[0] - point1[0];
  let y = point2[1] - point1[1];
  // return Math.hypot(point2[0] - point1[0], point2[1] - point1[1]);
  return Math.sqrt(x * x + y * y);
}
