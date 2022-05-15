import { Pane } from "tweakpane";

//info displayed on tweakpane
export const info = {
  points: 0,
  lines: 0,
  savedWithJoins: 0,
};

export enum RenderMode {
  PERLIN,
  GEO,
}

export enum ClipType {
  SQUARE,
  CIRCLE,
  TRIANGLE,
  TRIANGLE_IN_SQUARE,
  TRIANGLE_IN_CIRCLE,
  CIRCLE_IN_SQUARE,
}

//configuration params for project.
export const params = {
  cols: 100,
  rows: 80,
  scale: 1,
  freq: 0.02,
  speed: 1,
  amp: 10,
  frame: 0,
  invert: false,
  animate: false,
  smooth: 0,
  mode: RenderMode.GEO,
  clipType: ClipType.SQUARE,
  noise: 1,
  geoMod: 4,
  jitterX: 0,
  jitterY: 0,
  name: "",
};

export const createPane = (redraw: () => void) => {
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
      "triangle & circle": ClipType.TRIANGLE_IN_CIRCLE,
      "triangle & square": ClipType.TRIANGLE_IN_SQUARE,
      "circle & square": ClipType.CIRCLE_IN_SQUARE,
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

  const smooth = tabs.pages[0].addInput(params, "smooth", {
    min: -2,
    max: 2,
    title: "",
  });
  const resetSmooth = tabs.pages[0].addButton({ title: "clear" });
  resetSmooth.on("click", () => {
    params.smooth = 0;
    smooth.refresh();
  });
  tabs.pages[0].addInput(params, "animate");
  tabs.pages[0].addInput(params, "frame", { min: 0, max: 1000 });

  tabs.pages[2].addInput(params, "geoMod", { min: 0, max: 13, step: 1 });

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

  const btn = tabs.pages[0].addButton({ title: "Redraw" });
  btn.on("click", () => {
    redraw();
  });
};
