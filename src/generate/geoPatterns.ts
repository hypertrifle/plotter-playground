import { Generate, Lines } from "../types/generate";

const random = require("canvas-sketch-util/random");

export /**
 * generates lines based on some geometric / hexagonal calculations.
 *
 * @param {*} { width, height, frame, params }
 * @return {*}
 */
const geoPatterns: Generate = (
  { width, height, frame, params },
  withNoise = false
) => {
  let lines: Lines = [];
  const f = params.frame;

  const a = (2 * Math.PI) / 6;

  const r = (1 / params.cols) * 500;
  const xSpace = r + r * Math.cos(a);
  const ySpace = 2 * r * Math.sin(a);

  const rows = Math.floor(height / ySpace);
  const cols = Math.floor(height / xSpace);

  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      const x = col * xSpace;
      const y = row * ySpace;

      const yOffest = col % 2 === 0 ? 0 : r * Math.sin(a);

      let line = [];

      let mod = (params.geoMod % 5) + 1;
      let comp = Math.floor(params.geoMod / 5);

      // if (params.geoMod > 4) {
      //   mod = params.geoMod - 5;
      //   comp = 1;
      // }

      for (var i = 0; i < 7; i++) {
        if (i % mod === comp) {
          const offset = withNoise
            ? random.noise3D(x + 1, y, f * params.speed, params.freq)
            : 0;

          line.push([
            x + r * Math.cos(a * i),
            y + yOffest + r * Math.sin(a * i) + offset * params.amp,
          ]);
        }
      }

      lines.push(line);
    }
  }

  return lines;
};
