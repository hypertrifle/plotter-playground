import { rotate } from "../modifiers/rotate";
import { Generate, Lines } from "../types/generate";

const project = (
  point: [number, number],
  { fov, viewDist, angle, w, h }
): [number, number] => {
  var rd, ca, sa, ry, rz, f;

  rd = (angle * Math.PI) / 180; /// convert angle into radians
  ca = Math.cos(rd);
  sa = Math.sin(rd);

  ry = point[1] * ca; /// convert y value as we are rotating
  rz = point[1] * sa; /// only around x. Z will also change

  /// Project the new coords into screen coords
  f = fov / (viewDist + rz);
  let x = point[0] * f + w;
  let y = ry * f + h;

  return [x, y];
};

export const grids: Generate = ({ width, height, frame, params }) => {
  // List of polylines for our pen plot
  let lines: Lines = [];

  //we might only generate one line here but lets see
  const centerX = width / 2;
  const centerY = height / 2;

  // const R = params.spiro.R;

  let options = {
    fov: params.grid.fov,
    angle: params.grid.angle,
    h: height / 2,
    w: width / 2,
    viewDist: params.grid.viewDist,
  };

  let cols = params.cols;
  let rows = params.cols;

  for (let i = 0; i < cols + 1; i++) {
    const line = [];
    for (let j = 0; j < rows; j++) {
      let xy: [number, number] = [i / cols - 0.5, j / rows - 0.5];
      xy = rotate(0, 0, xy[0], xy[1], params.grid.rotate);
      let pos = project(xy, options);
      line.push(pos);
    }
    lines.push(line);
  }

  for (let j = 0; j < cols; j++) {
    const line = [];
    for (let i = 0; i < rows + 1; i++) {
      let xy: [number, number] = [i / cols - 0.5, j / rows - 0.5];
      xy = rotate(0, 0, xy[0], xy[1], params.grid.rotate);
      let pos = project(xy, options);
      line.push(pos);
    }
    lines.push(line);
  }

  return lines;
};
