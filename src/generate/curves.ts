import { Generate, Lines } from "../types/generate";

export const curves: Generate = ({ width, height, frame, params }) => {
  // List of polylines for our pen plot
  let lines: Lines = [];

  //we might only generate one line here but lets see
  const centerX = width / 2;
  const centerY = height / 2;

  const R = params.amp;

  for (let i = -20; i < params.cols + 40; i++) {
    const line = [];
    for (let j = -20; j < params.rows + 40; j++) {
      let xOffset = Math.pow(
        R,
        (height / params.rows / (params.speed * 10)) * j
      );

      line.push([
        (width / params.cols) * i + xOffset,
        (height / params.rows) * j,
      ]);
    }
    lines.push(line);
  }

  return lines;
};
