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
  size: number = 0.9
) {
  const out = [];

  //generate our triangle points
  const tri = [];
  const center = [width / 2, height / 2];
  const r = Math.min(height, width) * size;

  for (let i = 0; i < sides; i++) {
    let angle = ((2 * Math.PI) / sides) * i - Math.PI / 2;

    tri.push([
      r * Math.cos(angle) + center[0],
      r * Math.sin(angle) + center[1],
    ]);
  }

  // const h = w * (Math.sqrt(3) / 3);
  // let hLow = (w * Math.sqrt(3)) / 2;

  // hLow = hLow + (hLow - h);

  // // const h = w * (Math.sqrt(3) / 2);
  // tri.push([center[0], center[1] - h / 2]);
  // tri.push([center[0] + w / 2, center[1] + hLow / 2]);
  // tri.push([center[0] - w / 2, center[1] + hLow / 2]);

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
