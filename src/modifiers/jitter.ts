export /**
 * modifieds all points of paths a random amount
 *
 * @param {[number, number][][]} paths paths to modify
 * @param {number} amountX
 * @param {number} amountY
 * @return {[number, number][][]}   modified paths.
 */
const jitterPaths = (
  paths: [number, number][][],
  amountX: number,
  amountY?: number
): [number, number][][] => {
  for (let path of paths) {
    for (let point of path) {
      point[0] += Math.random() * amountX * 2 - amountX;
      point[1] += Math.random() * amountY * 2 - (amountY || amountX);
    }
  }

  return paths;
};
