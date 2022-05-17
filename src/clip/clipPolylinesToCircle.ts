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
  height: number,
  invert: boolean = false,
  renderClipPath = false,
  size: number = 0.9,
  center: { x: number; y: number } = { x: 0.5, y: 0.5 }
) {
  const out = [];
  let r = (width / 2) * size;
  for (let i = 0; i < lines.length; i++) {
    out.push([]);
  }

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      let point = lines[y][x];
      let dist =
        (point[0] - width * center.x) * (point[0] - width * center.x) +
        (point[1] - height * center.y) * (point[1] - height * center.y);

      if ((dist < r * r && !invert) || (dist >= r * r && invert)) {
        out[y].push(point);
      } else if (out[y].length > 0) {
        out.push(out[y]);
        out[y] = [];
      }
    }
  }

  if (renderClipPath) {
    const circle = [];
    for (let i = 0; i < 100; i++) {
      const th = ((Math.PI * 2) / 100) * i;
      const xunit = r * Math.cos(th) + width * center.x;
      const yunit = r * Math.sin(th) + height * center.y;
      circle.push([xunit, yunit]);
    }

    const xunit = r * Math.cos(0) + width * center.x;
    const yunit = r * Math.sin(0) + height * center.y;
    circle.push([xunit, yunit]);

    out.push(circle);
  }

  return out;
}
