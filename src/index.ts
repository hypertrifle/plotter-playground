import canvasSketch from "canvas-sketch";
import { Pane } from "tweakpane";

import { renderPaths } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";

import { clipPolylinesToCircle } from "./clip/clipPolylinesToCircle";
import { clipPolylinesToTriangle } from "./clip/clipPolylinesToTriangle";

import { smoothPoints } from "./modifiers/smoothPoints";

import { perlinLines } from "./generate/perlinLines";
import { geoPatterns } from "./generate/geoPatterns";

import { distanceBetweenPoints } from "./math";
import { compareObjects, removeEmptyArrays } from "./helpers";
import { clipPolyLinesRandom } from "./clip/clipPolyLinesRandom";
import { joinPaths } from "./modifiers/joinPaths";
import { jitterPaths } from "./modifiers/jitter";

//canvas sketch settings.
const settings = {
  dimensions: [130, 130],
  units: "mm",
  pixelsPerInch: 300,
  scaleToView: true,
  animate: true,
};

//info displayed on tweakpane
const info = {
  points: 0,
  lines: 0,
  savedWithJoins: 0,
};

enum RenderMode {
  PERLIN,
  GEO,
}

enum ClipType {
  SQUARE,
  CIRCLE,
  TRIANGLE,
}

//configuration params for project.
const params = {
  cols: 20,
  rows: 80,
  scale: 1,
  freq: 0.02,
  speed: 1,
  amp: 10,
  frame: 0,
  invert: false,
  animate: false,
  smooth: 0,
  mode: RenderMode.PERLIN,
  clipType: ClipType.CIRCLE,
  noise: 1,
  geoMod: 1,
  jitterX: 0,
  jitterY: 0,
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
      if (params.animate || !compareObjects(params, prev)) {
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

      //finally apply smothing if needed.
      if (params.smooth !== 0) {
        lines[i] = smoothPoints(lines[i], params.smooth);
      }
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

    //render and update chache.
    cache = renderPaths(lines, {
      width,
      height,
      context,
      lineWidth: 0.4,
    });

    //return the updated cache
    return cache;
  };
};

const createPane = () => {
  const pane = new Pane();

  const tabs = pane.addTab({
    pages: [{ title: "mode" }, { title: "perlin" }, { title: "Geometric" }],
  });

  tabs.pages[0].addInput(params, "mode", {
    options: {
      "Perlin Lines": RenderMode.PERLIN,
      Geometric: RenderMode.GEO,
    },
  });

  tabs.pages[0].addInput(params, "clipType", {
    options: {
      square: ClipType.SQUARE,
      circle: ClipType.CIRCLE,
      triangle: ClipType.TRIANGLE,
    },
  });
  tabs.pages[0].addInput(params, "noise", {
    min: 0,
    max: 100,
    title: "",
  });
  tabs.pages[0].addInput(params, "jitterX", {
    min: 0,
    max: 2,
    title: "",
  });
  tabs.pages[0].addInput(params, "jitterY", {
    min: 0,
    max: 2,
    title: "",
  });

  tabs.pages[0].addInput(params, "smooth", {
    min: -2,
    max: 2,
    title: "",
  });
  tabs.pages[0].addInput(params, "animate");
  tabs.pages[0].addInput(params, "frame", { min: 0, max: 1000 });
  const btn = tabs.pages[0].addButton({ title: "Redraw" });
  btn.on("click", () => {
    prev = undefined;
  });

  tabs.pages[2].addInput(params, "geoMod", { min: 0, max: 25, step: 1 });

  const folder = tabs.pages[0].addFolder({ title: "densitiy" });
  folder.addInput(params, "cols", { min: 2, max: 500, step: 1 });
  folder.addInput(params, "rows", { min: 2, max: 200, step: 1 });

  const folderInfo = tabs.pages[0].addFolder({ title: "Info" });
  folderInfo.addMonitor(info, "lines");
  folderInfo.addMonitor(info, "points");
  folderInfo.addMonitor(info, "savedWithJoins");

  const noiseFolder = tabs.pages[1].addFolder({ title: "Noise" });
  noiseFolder.addInput(params, "freq", { min: 0, max: 0.05 });
  noiseFolder.addInput(params, "amp", { min: 1, max: 100, step: 1 });
  noiseFolder.addInput(params, "speed", { min: 1, max: 10, step: 1 });
};

createPane();
canvasSketch(sketch, settings);
