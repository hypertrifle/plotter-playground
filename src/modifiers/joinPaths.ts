import { comparePoint } from "../helpers";

export const joinPaths = (paths: [number, number][][]) => {
  const info = [];

  for (let i = 0; i < paths.length; i++) {
    info[i] = {
      start: paths[i][0],
      end: paths[i][paths[i].length - 1],
    };
  }

  for (let i = 0; i < paths.length; i++) {
    for (let j = 0; j < paths.length; j++) {
      if (i === j) {
        continue;
      }

      if (
        info[i].start &&
        info[j].end &&
        comparePoint(info[i].start, info[j].end)
      ) {
        paths[j].push(...paths[i]);
        info[j].end = info[i].end;
        info[i].end = info[i].start = undefined;
        paths[i] = [];
      }
    }
  }

  return paths;
};
