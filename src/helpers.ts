export /**
 * shallow comapres 2 objects and thier top level values
 *
 * @param {{ [key: string]: any }} a
 * @param {{ [key: string]: any }} b
 * @return {boolean} If objects match
 */
const shallowCompareObjects = (
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

/**
 * compares to points returns true if they are identicle
 *
 * @param {[number, number]} p1
 * @param {[number, number]} p2
 * @return {*}
 */
export const comparePoint = (p1: [number, number], p2: [number, number]) => {
  return p1[0] === p2[0] && p1[1] === p2[1];
};

/**
 * remove arrays with length less than
 *
 * @param {number[][]} array Array of Arrays
 * @param {number} [minLength=1] Min length of arrays, default 1
 * @return {number[][]} modified Array
 */
export const removeEmptyArrays = (
  array: [number, number][][],
  minLength = 1
) => {
  for (let i = array.length - 1; i >= 0; i--) {
    //remove paths with no points.
    if (array[i].length < minLength) {
      array.splice(i, 1);
      continue;
    }
  }
  return array;
};
