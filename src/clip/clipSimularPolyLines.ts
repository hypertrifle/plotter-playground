//for all the lines generated

import { distanceBetweenPoints } from "../math";

export function clipSimularPolyLines(lines: [number, number][][]) {
  for (let i = lines.length - 1; i >= 0; i--) {
    //remove points if close.
    for (let j = lines[i].length - 1; j >= 1; j--) {
      if (distanceBetweenPoints(lines[i][j], lines[i][j - 1]) < 0.1) {
        lines[i].splice(j, 1);
        continue;
      }
    }
  }

  return lines;
}
