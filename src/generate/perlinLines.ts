const random = require("canvas-sketch-util/random");
import BezierEasing from "bezier-easing";
import { Generate, Lines } from "../types/generate";
export /**
 * generates lines with variations based on perlin nose.
 *
 * @param {*} { context, width, height, frame, params }
 * @return {*}
 */
const perlinLines: Generate = ({ width, height, frame, params }) => {
  // List of polylines for our pen plot
  let lines: Lines = [];

  const cols = params.cols;
  const rows = params.rows;
  const numCells = cols * rows;
  const cellw = width / cols;
  const cellh = (height + 10) / rows;
  let ns, nt;

  //the lines we are ghoing to generate
  for (let i = 0; i < rows; i++) {
    lines.push([]);
  }

  let ease = BezierEasing(
    ...(params.distribution as [number, number, number, number])
  );

  for (let i = 0; i < numCells; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * cellw;
    const y = params.useQuadratic
      ? ease(row / rows) * cellh * row
      : row * cellh;
    const w = cellw;
    const h = cellh;
    const f = params.frame;

    col == 0
      ? (ns = random.noise3D(
          (col - 1) * cellw,
          y,
          f * params.speed,
          params.freq
        ))
      : (ns = nt);
    nt = random.noise3D(x + 1, y, f * params.speed, params.freq) * 1; //random.noise3D((x + 1) / 2, y / 2, f * params.speed, params.freq);
    if (col === 0) {
      lines[row].push([x + w * -0.5, y + ns * params.amp]);
    }
    lines[row].push([x + w * 0.5, y + nt * params.amp]);
  }
  return lines;
};
