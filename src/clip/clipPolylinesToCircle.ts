/**
 * remove points from an array of paths the lie outside of a circle perimeter from a center of a bounds
 *
 * @export
 * @param {[number, number][][]} lines
 * @param {number} width
 * @param {number} height
 * @return {*}
 */

//todo again convert to splice.
export function clipPolylinesToCircle(
  lines: [number, number][][],
  width: number,
  height: number
) {
  const out = [];

  for (let i = 0; i < lines.length; i++) {
    out.push([]);
  }

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      let point = lines[y][x];
      let dist =
        (point[0] - width / 2) * (point[0] - width / 2) +
        (point[1] - height / 2) * (point[1] - height / 2);
      let r = (width / 2) * 0.9;
      if (dist < r * r) {
        out[y].push(point);
      } else if (out[y].length > 0) {
        out.push(out[y]);
        out[y] = [];
      }
    }
  }

  return out;
}
