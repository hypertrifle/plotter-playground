// modified version of: (main chaanges are how array points are indexed number[] => [number,number][])
// https://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas

export function smoothPaths(
  paths: [number, number][][],
  tension: number = 0.1,
  isClosed: boolean = false,
  numOfSegments: number = 16
) {
  const out = [];

  for (let path of paths) {
    out.push(smoothPoints(path, tension, isClosed, numOfSegments));
  }

  return out;
}

export function smoothPoints(
  pts: [number, number][],
  tension: number = 1,
  isClosed: boolean = false,
  numOfSegments: number = 16
) {
  var _pts = [],
    res = [], // clone array
    x,
    y, // our x,y coords
    t1x,
    t2x,
    t1y,
    t2y, // tension vectors
    c1,
    c2,
    c3,
    c4, // cardinal points
    st,
    t,
    i; // steps based on num. of segments

  // clone array so we don't change the original
  //
  _pts = pts.slice(0);

  // ok, lets start..

  // 1. loop goes through point array
  // 2. loop goes through each segment between the 2 pts + 1e point before and after
  for (i = 0; i < _pts.length - 1; i++) {
    for (t = 0; t <= numOfSegments; t++) {
      let p = _pts[i];
      let p_prev = _pts[i - 1] || p;
      let p_two = _pts[i + 1] || p;
      let p_three = _pts[i + 2] || p_two;

      // calc tension vectors
      t1x = (p_two[0] - p_prev[0]) * tension;
      t2x = (p_three[0] - p[0]) * tension;

      t1y = (p_two[1] - p_prev[1]) * tension;
      t2y = (p_three[1] - p[1]) * tension;

      // calc step
      st = t / numOfSegments;

      // calc cardinals
      c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1;
      c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
      c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st;
      c4 = Math.pow(st, 3) - Math.pow(st, 2);

      // calc x and y cords with common control vectors
      x = c1 * p[0] + c2 * p_two[0] + c3 * t1x + c4 * t2x;
      y = c1 * p[1] + c2 * p_two[1] + c3 * t1y + c4 * t2y;

      //store points in array
      res.push([x, y]);
    }
  }

  //reat the first and last points
  res.unshift(pts[0]);
  res.push(pts[pts.length - 1]);

  return res;
}
