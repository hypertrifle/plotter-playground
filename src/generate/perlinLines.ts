const random = require("canvas-sketch-util/random");

export const perlinLines = ({ context, width, height, frame, params }) => {
  // List of polylines for our pen plot
  let lines = [];

  const marg = params.amp * 2 + params.scale;
  const cols = params.cols;
  const rows = params.rows;
  const numCells = cols * rows;
  const cellw = width / cols;
  const cellh = height / rows;
  let ns, nt;

  for (let i = 0; i < rows; i++) {
    lines.push([]);
  }

  for (let i = 0; i < numCells; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * cellw;
    const y = row * cellh;
    const w = cellw;
    const h = cellh;
    const f = params.animate ? frame : params.frame;

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
