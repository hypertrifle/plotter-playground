import { comparePoint, removeEmptyArrays } from "../helpers";

export /**
 * joins paths if end / start point match
 *
 * @param {[number, number][][]} paths to join
 * @return {[number, number][][]} modified paths
 */
const joinPaths = (paths: [number, number][][]): [number, number][][] => {
  const info = [];

  //get info on start / end positions for all arrays
  for (let i = 0; i < paths.length; i++) {
    info[i] = {
      start: paths[i][0],
      end: paths[i][paths[i].length - 1],
    };
  }

  for (let i = 0; i < paths.length; i++) {
    for (let j = 0; j < paths.length; j++) {
      //dont join to self
      if (i === j) {
        continue;
      }

      //if we have points to check and they match
      if (
        info[i].start &&
        info[j].end &&
        comparePoint(info[i].start, info[j].end)
      ) {
        //join to array that matches end
        paths[j].push(...paths[i]);
        //set new end to updates
        info[j].end = info[i].end;
        //clear info of merged array
        info[i].end = info[i].start = undefined;
        paths[i] = [];
        continue;
      }
    }
  }
  //return removing empty arrays
  return removeEmptyArrays(paths);
};
