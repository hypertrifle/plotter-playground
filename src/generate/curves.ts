export const curves = ({ width, height, frame, params }) => {
  // List of polylines for our pen plot
  let lines = [];

  //we might only generate one line here but lets see
  const centerX = width / 2;
  const centerY = height / 2;

  // const R = params.spiro.R;

  for (let i = -20; i < params.cols + 40; i++) {
    const line = [];
    for (let j = -20; j < params.rows + 40; j++) {
      let xOffset = Math.pow(20, (height / params.rows / 80) * j);

      // xOffset *= Math.sign(params.cols / 2 - i) * -1;

      line.push([
        (width / params.cols) * i + xOffset,
        (height / params.rows) * j,
      ]);
    }
    lines.push(line);
  }

  return lines;
};
