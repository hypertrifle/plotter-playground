var insideTri = require("point-in-triangle");

/**
 * removes points in an array of paths that lie outside an equalatrial trangle perimeter
 * centerd within in a bounds.
 *
 * @export
 * @param {[number, number][][]} lines
 * @param {number} width
 * @param {number} height
 * @return {*}
 */

//todo again convert to splice.
export function clipPolylinesToTriangle(
  lines: [number, number][][],
  width: number,
  height: number,
  sides: number = 3,
  invert: boolean = false,
  renderClipPath: boolean = false,
  size: number = 0.9,
  center: { x: number; y: number } = { x: 0.5, y: 0.5 }
) {
  const out = [];

  //generate our triangle points
  const tri = [];
  const c = [width * center.x, height * center.y];
  const r = Math.min(height, width) * size;

  for (let i = 0; i < sides; i++) {
    let angle = ((2 * Math.PI) / sides) * i - Math.PI / 2;

    tri.push([r * Math.cos(angle) + c[0], r * Math.sin(angle) + c[1]]);
  }

  for (let i = 0; i < lines.length; i++) {
    out.push([]);
  }

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      let point = lines[y][x];

      if (
        (insideTri(point, tri) && !invert) ||
        (!insideTri(point, tri) && invert)
      ) {
        out[y].push(point);
      } else if (out[y].length > 0) {
        out.push(out[y]);
        out[y] = [];
      }
    }
  }

  if (renderClipPath) {
    const path = [];
    out.push([...tri, tri[0]]);
  }

  return out;
}
