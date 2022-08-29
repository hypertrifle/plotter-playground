import { Lines } from "../types/generate";

export const translate = (paths: Lines, offsetX: number, offsetY: number) => {
  paths.forEach((path) => {
    path.forEach((point) => {
      point[0] += offsetX;
      point[1] += offsetY;
    });
  });

  return paths;
};
