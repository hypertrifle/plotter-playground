import canvasSketch from "canvas-sketch";

import { renderPaths } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";

import { clipPolylinesToCircle } from "./clip/clipPolylinesToCircle";
import { clipPolylinesToTriangle } from "./clip/clipPolylinesToTriangle";

import { smoothPaths, smoothPoints } from "./modifiers/smoothPoints";

import { perlinLines } from "./generate/perlinLines";
import { geoPatterns } from "./generate/geoPatterns";

import { distanceBetweenPoints } from "./math";
import { shallowCompareObjects, removeEmptyArrays } from "./helpers";
import { clipPolyLinesRandom } from "./clip/clipPolyLinesRandom";
import { joinPaths } from "./modifiers/joinPaths";
import { jitterPaths } from "./modifiers/jitter";
import { ClipType, createPane, info, params, RenderMode } from "./settings";

//canvas sketch settings.
const settings = {
  dimensions: [130, 130],
  units: "mm",
  pixelsPerInch: 300,
  scaleToView: true,
  animate: true,
};

//cache line generation.
let cache;
//prev tracks if params have changed since last render
let prev = { ...params };

const sketch = () => {
  return (props) => {
    const { context, width, height, frame } = props;

    // if we have a cache, we are not animating,
    // and our params are the same as previous frame
    // return cache
    if (cache !== undefined) {
      if (params.animate || !shallowCompareObjects(params, prev)) {
      } else {
        return cache;
      }
    }
    prev = { ...params };

    //generate paths based on mode
    let lines;

    switch (params.mode) {
      case RenderMode.PERLIN:
        lines = perlinLines({ context, width, height, frame, params });
        break;
      case RenderMode.GEO:
        lines = geoPatterns({ width, height, frame, params });
        break;
    }

    // apply random 'noise'
    // remove points from lines based on %
    lines = clipPolyLinesRandom(lines, params.noise);

    removeEmptyArrays(lines);

    if (params.smooth !== 0 && (params.jitterX > 0 || params.jitterY > 0)) {
      jitterPaths(lines, params.jitterX, params.jitterY);
    }

    //for all the lines generated
    for (let i = lines.length - 1; i >= 0; i--) {
      //remove points if close.
      for (let j = lines[i].length - 1; j >= 1; j--) {
        if (distanceBetweenPoints(lines[i][j], lines[i][j - 1]) < 0.1) {
          lines[i].splice(j, 1);
          continue;
        }
      }
    }

    //apply smothing if needed.
    if (params.smooth !== 0) {
      lines = smoothPaths(lines, params.smooth);
    }
    //if we are to clip lines
    switch (params.clipType) {
      case ClipType.SQUARE:
        const margin = 10.0;
        const box = [margin, margin, width - margin, height - margin];
        lines = clipPolylinesToBox(lines, box);
        break;
      case ClipType.CIRCLE:
        lines = clipPolylinesToCircle(lines, width, height);

        break;
      case ClipType.TRIANGLE:
        lines = clipPolylinesToTriangle(lines, width, height);

        break;
    }
    removeEmptyArrays(lines);

    let total = lines.length;
    joinPaths(lines);
    removeEmptyArrays(lines, 2);
    info.savedWithJoins = total - lines.length;

    if ((params.jitterX > 0 || params.jitterY > 0) && params.smooth === 0) {
      jitterPaths(lines, params.jitterX, params.jitterY);
    }

    //info for tweakpane panel.
    info.points = lines.reduce((prev, current) => prev + current.length, 0);
    info.lines = lines.length;

    //render to chache.
    cache = renderPaths(lines, {
      width,
      height,
      context,
      lineWidth: 0.4,
      units: "mm",
    });

    //return the updated cache
    return cache;
  };
};

createPane(() => {
  cache = undefined;
});
canvasSketch(sketch, settings);
