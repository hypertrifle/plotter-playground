export const compareObjects = (
  a: { [key: string]: any },
  b: { [key: string]: any }
) => {
  if (a === undefined || b === undefined) {
    return false;
  }
  for (let prop in a) {
    if (a[prop] !== b[prop]) {
      return false;
    }
  }
  return true;
};

export const comparePoint = (p1: [number, number], p2: [number, number]) => {
  return p1[0] === p2[0] && p1[1] === p2[1];
};

export const removeEmptyArrays = (array: number[][], minLength = 1) => {
  for (let i = array.length - 1; i >= 0; i--) {
    //remove paths with no poarrayts.
    if (array[i].length < minLength) {
      array.splice(i, 1);
      continue;
    }
  }
  return array;
};
