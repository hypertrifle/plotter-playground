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
  width: number,
  height: number,
  invert: boolean = false,
  renderClipPath: boolean = false,
  size: number = 0.9,
  center: { x: number; y: number } = { x: 0.5, y: 0.5 }
) {
  const out = [];

  // scaledBounds =

  for (let i = 0; i < lines.length; i++) {
    out.push([]);
  }

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      let point = lines[y][x];
      let inside =
        point[0] >= width * center.x - size / 2 &&
        point[0] <= width * center.x + size / 2 &&
        point[1] >= height * center.y - size / 2 &&
        point[1] <= height * center.y + size / 2;

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
      [width * center.x - size / 2, height * center.y - size / 2],
      [width * center.x + size / 2, height * center.y - size / 2],
      [width * center.x + size / 2, height * center.y + size / 2],
      [width * center.x - size / 2, height * center.y + size / 2],
      [width * center.x - size / 2, height * center.y - size / 2],
    ]);
  }

  return out;
}
