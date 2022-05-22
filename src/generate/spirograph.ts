const gcd = (...arr) => {
  const _gcd = (x, y) => (!y ? x : gcd(y, x % y));
  return [...arr].reduce((a, b) => _gcd(a, b));
};

export const spirograph = ({ width, height, frame, params }) => {
  // List of polylines for our pen plot
  let lines = [];

  //we might only generate one line here but lets see
  const centerX = width / 2;
  const centerY = height / 2;

  const R = params.spiro.R;
  const r = params.spiro.r;
  const p = params.spiro.p;

  const precision = params.spiro.precision;

  let line = [];

  const rr = Math.abs(r);
  const turns = rr / gcd(R, rr) + precision;

  for (let i = 0; i < turns; i++) {
    const t = (i / turns) * (Math.PI * 2);

    let x = (R - r) * Math.cos(t) + p * Math.cos(((R - r) * t) / r);
    let y = (R - r) * Math.sin(t) - p * Math.sin(((R - r) * t) / r);

    line.push([x + centerX, y + centerY]);
  }

  const t = 0;
  let x = (R - r) * Math.cos(t) + p * Math.cos(((R - r) * t) / r);
  let y = (R - r) * Math.sin(t) - p * Math.sin(((R - r) * t) / r);
  line.push([x + centerX, y + centerY]);

  return [line];
};
