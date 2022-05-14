var insideTri = require("point-in-triangle");

export function clipPolylinesToTriangle(
  lines: [number, number][][],
  width: number,
  height: number
) {
  const out = [];

  const tri = [];

  const center = [width / 2, height / 2];
  const w = Math.min(height, width) * 0.9;
  const h = w * (Math.sqrt(3) / 2);
  tri.push([center[0], center[1] - h / 2]);
  tri.push([center[0] + w / 2, center[1] + h / 2]);
  tri.push([center[0] - w / 2, center[1] + h / 2]);

  for (let i = 0; i < lines.length; i++) {
    out.push([]);
  }

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      let point = lines[y][x];

      if (insideTri(point, tri)) {
        out[y].push(point);
      } else if (out[y].length > 0) {
        out.push(out[y]);
        out[y] = [];
      }
    }
  }
  return out;
}
