/**
 * remove points from an array of paths the lie outside of a Box perimeter from a center of a bounds
 *
 * @export
 * @param {[number, number][][]} lines
 * @param {number} width
 * @return {*}
 */

//todo again convert to splice.
export function clipPolylinesToBox(
  lines: [number, number][][],
  bounds: [number, number, number, number],
  invert: boolean = false,
  renderClipPath: boolean = false
) {
  const out = [];

  for (let i = 0; i < lines.length; i++) {
    out.push([]);
  }

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      let point = lines[y][x];
      let inside =
        point[0] >= bounds[0] &&
        point[0] <= bounds[2] + 5 &&
        point[1] >= bounds[1] &&
        point[1] <= bounds[3] + 5;

      if ((inside && !invert) || (!inside && invert)) {
        out[y].push(point);
        // } else if (out[y].length > 0) {
        //   out.push(out[y]);
        //   out[y] = [];
      }
    }
  }

  if (renderClipPath) {
    out.push([
      [bounds[0], bounds[1]],
      [bounds[0] + bounds[2], bounds[1]],
      [bounds[0] + bounds[2], bounds[1] + bounds[3]],
      [bounds[0], bounds[1] + bounds[3]],
      [bounds[0], bounds[1]],
    ]);
  }

  return out;
}
