function rotate(cx, cy, x, y, angle): [number, number] {
  var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * (x - cx) + sin * (y - cy) + cx,
    ny = cos * (y - cy) - sin * (x - cx) + cy;
  return [nx, ny];
}

export const rotatePaths = (
  paths: [number, number][][],
  angle: number,
  centerX: number,
  centerY: number
): [number, number][][] => {
  const ret = [];
  for (let path of paths) {
    let p = [];
    for (let point of path) {
      p.push(rotate(centerX, centerY, point[0], point[1], angle));
    }
    ret.push(p);
  }

  return ret;
};
