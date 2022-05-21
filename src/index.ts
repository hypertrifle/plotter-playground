import canvasSketch from "canvas-sketch";
import simplify from "simplify-path";

import { renderPaths } from "canvas-sketch-util/penplot";

import { clipPolylinesToCircle } from "./clip/clipPolylinesToCircle";
import { clipPolylinesToTriangle } from "./clip/clipPolylinesToTriangle";
import { clipPolylinesToBox } from "./clip/clipPolylinesToBox";

import { smoothPaths } from "./modifiers/smoothPoints";

import { perlinLines } from "./generate/perlinLines";
import { geoPatterns } from "./generate/geoPatterns";

import { removeEmptyArrays, quickCompareObjects } from "./helpers";
import { clipPolyLinesRandom } from "./clip/clipPolyLinesRandom";
import { joinPaths } from "./modifiers/joinPaths";
import { jitterPaths } from "./modifiers/jitter";
import { ClipType, createPane, info, params, RenderMode } from "./settings";
import { clipSimularPolyLines } from "./clip/clipSimularPolyLines";

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
      if (params.animate || !quickCompareObjects(params, prev)) {
      } else {
        return cache;
      }
    }
    prev = JSON.parse(JSON.stringify(params));

    //generate paths based on mode
    let lines = [];

    switch (params.mode) {
      case RenderMode.PERLIN:
        lines = perlinLines({ context, width, height, frame, params });
        break;
      case RenderMode.GEO:
        lines = geoPatterns({ width, height, frame, params });
        break;
      case RenderMode.GEO_PERLIN:
        lines = geoPatterns({ width, height, frame, params }, true);
        break;
    }

    // apply random 'noise'
    // remove points from lines based on %
    lines = clipPolyLinesRandom(lines, params.noise);

    removeEmptyArrays(lines);

    lines = joinPaths(lines);

    if (params.smooth !== 0 && (params.jitterX > 0 || params.jitterY > 0)) {
      jitterPaths(lines, params.jitterX, params.jitterY);
    }

    //clip poly lines
    lines = clipSimularPolyLines(lines);

    //apply smothing if needed.
    if (params.smooth !== 0) {
      lines = smoothPaths(lines, params.smooth);
    }

    const margin = 5.0;
    const box: [number, number, number, number] = [
      margin,
      margin,
      width - margin * 2,
      height - margin * 2,
    ];

    for (let clip of params.clippings) {
      switch (clip.type) {
        case ClipType.SQUARE:
          lines = clipPolylinesToBox(
            lines,
            width,
            height,
            clip.invert,
            clip.renderBorder,
            clip.size / 100,
            {
              x: (clip.offset.x + 1) / 2,
              y: (clip.offset.y + 1) / 2,
            }
          );
          removeEmptyArrays(lines);
          break;
        case ClipType.CIRCLE:
          lines = clipPolylinesToCircle(
            lines,
            width,
            height,
            clip.invert,
            clip.renderBorder,
            clip.size / 100,
            {
              x: (clip.offset.x + 1) / 2,
              y: (clip.offset.y + 1) / 2,
            }
          );
          break;
        case ClipType.TRIANGLE:
          lines = clipPolylinesToTriangle(
            lines,
            width,
            height,
            3,
            clip.invert,
            clip.renderBorder,
            clip.size / 100,
            {
              x: (clip.offset.x + 1) / 2,
              y: (clip.offset.y + 1) / 2,
            }
          );
          break;
      }
    }

    removeEmptyArrays(lines);

    let total = lines.length;
    if (params.simplify > 0) {
      const simple = [];
      for (let p of lines) {
        simple.push(simplify.douglasPeucker(p, params.simplify / 100));
      }
      lines = simple;
    }
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
      strokeStyle: `rgb(${params.colour.r},${params.colour.g},${params.colour.b})`,
    });

    //return the updated cache
    return cache;
  };
};

createPane(() => {
  cache = undefined;
});
canvasSketch(sketch, settings);

window.onresize = () => {
  cache = undefined;
};
