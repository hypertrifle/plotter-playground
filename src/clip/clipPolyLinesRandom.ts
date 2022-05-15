/**
 * randomly remove points in an array of paths
 *
 * @export
 * @param {[number, number][][]} lines
 * @param {number} percent
 * @return {*} modified points.
 */

//todo: we dont need the extra out array here, we can revese the itterators and uses splice.
export function clipPolyLinesRandom(
  lines: [number, number][][],
  percent: number
) {
  const out = [];

  for (let i = 0; i < lines.length; i++) {
    out.push([]);
  }
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      let point = lines[y][x];
      if (Math.random() > percent / 100) {
        out[y].push(point);
      } else if (out[y].length > 0) {
        out.push(out[y]);
        out[y] = [];
      }
    }
  }

  return out;
}
