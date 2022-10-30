import { serialize } from "v8";
import { ClipType } from "../settings";
import boulder from "./shapes/boulder";
import flamingo from "./shapes/flamingo";
import ring from "./shapes/ring";
import ring2 from "./shapes/ring2";
import ringbigger from "./shapes/ringbigger";
import wobble6 from "./shapes/wobble6";

function insidePoly(point: [number, number], vs: [number, number][]) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

  var x = point[0],
    y = point[1];

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0],
      yi = vs[i][1];
    var xj = vs[j][0],
      yj = vs[j][1];

    var intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * remove points from an array of paths the lie outside of a Box perimeter from a center of a bounds
 *
 * @export
 * @param {[number, number][][]} lines
 * @param {number} width
 * @return {*}
 */

//todo again convert to splice.
export function clipPolyLinesPoly(
  lines: [number, number][][],
  width: number,
  height: number,
  invert: boolean = false,
  renderClipPath: boolean = false,
  size: number = 0.9,
  center: { x: number; y: number } = { x: 0.5, y: 0.5 },
  type: ClipType
) {
  const out = [] as [number, number][][];
  for (let i = 0; i < lines.length; i++) {
    out.push([]);
  }

  const clips = {
    [ClipType.FLAMINGO]: flamingo,
    [ClipType.RING]: ringbigger,
    [ClipType.WOBBLE]: wobble6,
    [ClipType.BOULDER]: boulder,
  };

  let clip = clips[type];

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      let point = lines[y][x];

      const scaled = [
        (1 / size) * (point[0] - width / 2) + width / 2,
        (1 / size) * (point[1] - height / 2) + height / 2,
      ];

      let offset = [
        scaled[0] - (center.x - 0.5) * (width / 2) * (1 / size),
        scaled[1] - (center.y - 0.5) * (height / 2) * (1 / size),
      ] as [number, number];

      let inside = insidePoly(offset, clip);

      if ((inside && !invert) || (!inside && invert)) {
        out[y].push(point);
      } else if (out[y].length > 0) {
        out.push(out[y]);
        out[y] = [];
      }
    }
  }

  if (renderClipPath) {
    let outPath = [] as [number, number][];

    clip.forEach((point) => {
      //if we want to skip a jump to a cutout of a polygon
      if (point[0] === 77.851266 && point[1] === 12.57272) {
        // complete the path and create new
        out.push([...outPath, outPath[0]]);
        outPath = [];
      } else {
        outPath.push([
          size * (point[0] - width / 2) +
            width / 2 +
            (center.x - 0.5) * (width / 2),
          size * (point[1] - height / 2) +
            height / 2 +
            (center.y - 0.5) * (height / 2),
        ]);
      }
    });

    out.push(outPath);
  }

  return out;
}
