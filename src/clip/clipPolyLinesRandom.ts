/**
 * randomly remove points in an array of paths
 *
 * @export
 * @param {[number, number][][]} lines
 * @param {number} percent
 * @return {*} modified points.
 */

import { distanceBetweenPoints } from "../math";

export interface clipPolyLinesProps {
  lines: [number, number][][];
  percent: number;
  noiseOffsetCenter: number;
  cutoff?: boolean;
  width: number;
  height: number;
}

//todo: we dont need the extra out array here, we can revese the itterators and uses splice.
export function clipPolyLinesRandom({
  lines,
  percent,
  cutoff,
  noiseOffsetCenter,
  width,
  height,
}: clipPolyLinesProps): [number, number][][] {
  const out = [];

  for (let i = 0; i < lines.length; i++) {
    out.push([]);
  }
  for (let line = 0; line < lines.length; line++) {
    for (let p = 0; p < lines[line].length; p++) {
      const dist =
        distanceBetweenPoints([width / 2, height / 2], lines[line][p]) /
        (width / 2);

      console.log(dist, p, line);
      let point = lines[line][p];
      if (
        Math.random() * (1 - (noiseOffsetCenter / 100) * dist) >
        percent / 100
      ) {
        out[line].push(point);
      } else if (out[line].length > 0) {
        out.push(out[line]);
        if (cutoff === true) {
          out[line] = [];
          break;
        } else {
          out[line] = [];
        }
      }
    }
  }

  return out as [number, number][][];
}
