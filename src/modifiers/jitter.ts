export const jitterPaths = (
  paths: [number, number][][],
  amountX: number,
  amountY: number
) => {
  for (let path of paths) {
    for (let point of path) {
      point[0] += Math.random() * amountX * 2 - amountX;
      point[1] += Math.random() * amountY * 2 - amountY;
    }
  }
};
