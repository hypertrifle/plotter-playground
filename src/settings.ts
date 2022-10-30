import { FolderApi, Pane } from "tweakpane";
import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
//info displayed on tweakpane
export const info = {
  points: 0,
  lines: 0,
  savedWithJoins: 0,
};

//@ts-ignore
window.info = info;

export enum RenderMode {
  PERLIN,
  GEO,
  GEO_PERLIN,
  SPIRO,
  CURVES,
  JUST_CLIP_PATH,
  GRIDS,
}

export enum ClipType {
  SQUARE,
  CIRCLE,
  TRIANGLE,
  NONE,
  FLAMINGO,
  RING,
  WOBBLE,
  BOULDER,
}

export const defaultLayer = {
  cols: 16,
  rows: 16,
  scale: 1,
  freq: 0.02,
  speed: 1,
  amp: 10,
  frame: 0,
  smooth: 0.01,
  rotate: 0,
  simplify: 1,
  mode: RenderMode.GRIDS,
  noiseCutoff: true,
  clippings: [],
  useQuadratic: false,
  distribution: [0.5, 0, 0.5, 1],

  grid: {
    angle: -50,
    fov: 160,
    viewDist: 3.5,
    rotate: 0,
  },

  spiro: {
    R: 20,
    r: 2,
    p: 20,
    precision: 2000,
  },
  offset: { x: 0, y: 0 },
  noise: 0,
  noiseOffsetCenter: 0,
  geoMod: 4,
  jitterX: 0,
  jitterY: 0,
  name: "",
  colour: { r: 0, g: 0, b: 0 },
};

const save = localStorage.getItem("plot-playerground-hypertrifle-save");

//configuration params for project.
export const paramsExport = save ? JSON.parse(save) : [defaultLayer];

export const layersUI: { ui: FolderApi; params: typeof defaultLayer }[] = [];

export const createPane = (redraw: () => void) => {
  const pane = new Pane();

  //save to local storage on change
  pane.on("change", () => {
    localStorage.setItem(
      "plot-playerground-hypertrifle-save",
      JSON.stringify(paramsExport)
    );
  });

  pane.registerPlugin(EssentialsPlugin);

  //TODO:
  const removeLayer = (i) => {
    const toRemove = layersUI.splice(i, 1);

    toRemove.forEach((layer) => {
      layer.ui.dispose();
      const index = paramsExport.findIndex((value) => {
        if (value === layer.params) {
          return true;
        }
      });
      if (index > -1) {
        paramsExport.splice(index, 1);
      }
    });
  };

  const addLayer = (params: typeof defaultLayer, i) => {
    let clipCount = 0;

    const addClip = (clipParmas?) => {
      //add to params
      console.log("addClip", params.clippings);
      const p = clipParmas || {
        type: ClipType.TRIANGLE,
        renderBorder: true,
        size: 80,
        offset: { x: 0, y: 0 },

        invert: false,
      };

      const index = params.clippings.push(p);
      //setup tweakpane

      let folder = tabs.pages[3].addFolder({ title: `Clip #${index}` });
      folder.addInput(p, "type", {
        options: {
          none: ClipType.NONE,
          square: ClipType.SQUARE,
          circle: ClipType.CIRCLE,
          triangle: ClipType.TRIANGLE,
          path: ClipType.FLAMINGO,
          ring: ClipType.RING,
          wobble: ClipType.WOBBLE,
          boulder: ClipType.BOULDER,
        },
        title: "type",
      });
      folder.addInput(p, "renderBorder");
      folder.addInput(p, "size", {
        min: 0,
        max: 100,
        step: 1,
      });
      folder.addInput(p, "offset", {
        x: { min: -1, max: 1, steps: 0.01 },
        y: { min: -1, max: 1, steps: 0.01 },
      });

      folder.addInput(p, "invert");

      const remove = folder.addButton({ title: "Remove" });
      remove.on("click", () => {
        folder.dispose();
        let findIndex = params.clippings.findIndex((clip) => clip === p);
        params.clippings.splice(findIndex, 1);
      });
    };

    const layer = pane.addFolder({ title: "layer " + i });
    layersUI.push({ ui: layer, params });
    const removeLayerButton = layer.addButton({ title: "Remove" });
    removeLayerButton.on("click", () => {
      let i = paramsExport.indexOf(params);
      if (i > -1) removeLayer(i);
    });

    const tabs = layer.addTab({
      pages: [
        { title: "mode" },
        { title: "perlin" },
        { title: "Geometric" },
        { title: "Clipping" },
      ],
    });

    params.clippings.forEach((c, i) => {
      let folder = tabs.pages[3].addFolder({ title: `Clip #${i}` });
      folder.addInput(c, "type", {
        options: {
          none: ClipType.NONE,
          square: ClipType.SQUARE,
          circle: ClipType.CIRCLE,
          triangle: ClipType.TRIANGLE,
          path: ClipType.FLAMINGO,
          ring: ClipType.RING,
          wobble: ClipType.WOBBLE,
          boulder: ClipType.BOULDER,
        },
        title: "type",
      });
      folder.addInput(c, "renderBorder");
      folder.addInput(c, "size", {
        min: 0,
        max: 100,
        step: 1,
      });
      folder.addInput(c, "offset", {
        x: { min: -1, max: 1, steps: 0.01 },
        y: { min: -1, max: 1, steps: 0.01 },
      });

      folder.addInput(c, "invert");

      const remove = folder.addButton({ title: "Remove" });
      remove.on("click", () => {
        folder.dispose();
        let findIndex = params.clippings.findIndex((clip) => clip === c);
        params.clippings.splice(findIndex, 1);
      });
    });

    const addClipButton = tabs.pages[3].addButton({ title: "New Clip Layer" });
    addClipButton.on("click", () => {
      addClip();
      redraw();
    });

    const colour = tabs.pages[0].addInput(params, "colour");

    colour.on("change", function (ev) {
      redraw();
    });

    tabs.pages[0].addInput(params, "mode", {
      options: {
        "Perlin Lines": RenderMode.PERLIN,
        Geometric: RenderMode.GEO,
        "Geo with Perlin": RenderMode.GEO_PERLIN,
        "Clip Path": RenderMode.JUST_CLIP_PATH,
        Spiro: RenderMode.SPIRO,
        Curves: RenderMode.CURVES,
        Grids: RenderMode.GRIDS,
      },
    });

    tabs.pages[2].addInput(params, "geoMod", { min: 0, max: 13, step: 1 });

    let s = tabs.pages[2].addFolder({ title: "Spiro" });

    s.addInput(params.spiro, "R", { min: 0, max: 100, step: 1 });
    s.addInput(params.spiro, "r", { min: 1, max: 8, step: 1 });
    s.addInput(params.spiro, "p", { min: 0, max: 100, step: 1 });
    s.addInput(params.spiro, "precision", { min: 10, max: 3000 });

    let g = tabs.pages[2].addFolder({ title: "Grids" });
    g.addInput(params.grid, "fov", { min: 0, max: 200, step: 1 });
    g.addInput(params.grid, "viewDist", { min: 0, max: 10, step: 0.1 });
    g.addInput(params.grid, "rotate", { min: 0, max: 360, step: 0.1 });
    g.addInput(params.grid, "angle", { min: 0, max: 180, step: 1 });

    const variationFolder = tabs.pages[0].addFolder({ title: "variation" });

    variationFolder.addInput(params, "noise", {
      min: 0,
      max: 100,
      title: "",
    });

    variationFolder.addInput(params, "noiseOffsetCenter", {
      min: 0,
      max: 100,
      title: "",
    });
    variationFolder.addInput(params, "noiseCutoff", {});
    variationFolder.addInput(params, "rotate", {
      min: 0,
      max: 360,
      title: "",
    });
    variationFolder.addInput(params, "jitterX", {
      min: 0,
      max: 2,
      title: "",
    });
    variationFolder.addInput(params, "jitterY", {
      min: 0,
      max: 2,
      title: "",
    });
    variationFolder.addInput(params, "frame", { min: 0, max: 1000 });

    const folder = tabs.pages[0].addFolder({
      title: "densitiy",
      expanded: false,
    });
    folder.addInput(params, "cols", { min: 2, max: 500, step: 1 });
    folder.addInput(params, "rows", { min: 2, max: 200, step: 1 });
    folder.addInput(params, "offset", {
      x: { min: -1, max: 1, steps: 0.01 },
      y: { min: -1, max: 1, steps: 0.01 },
    });

    // const folderInfo = tabs.pages[0].addFolder({ title: "Info" });
    // folderInfo.addMonitor(info, "lines");
    // folderInfo.addMonitor(info, "points");
    // folderInfo.addMonitor(info, "savedWithJoins");

    const noiseFolder = tabs.pages[1].addFolder({ title: "Noise" });
    noiseFolder.addInput(params, "freq", { min: 0, max: 0.05 });
    noiseFolder.addInput(params, "amp", { min: 1, max: 100, step: 1 });
    noiseFolder.addInput(params, "speed", { min: 1, max: 10, step: 1 });
    tabs.pages[1].addInput(params, "useQuadratic");

    let bez = tabs.pages[1].addBlade({
      view: "cubicbezier",
      value: [0.5, 0, 0.5, 1],

      expanded: true,
      label: "cubicbezier",
      picker: "inline",
    });

    //@ts-ignore
    bez.on("change", (ev) => {
      params.distribution = [
        ev.value.x1,
        ev.value.y1,
        ev.value.x2,
        ev.value.y2,
      ];
      redraw();
    });

    const optimisationsFolder = tabs.pages[0].addFolder({
      title: "Optimisations",
      expanded: false,
    });

    const smooth = optimisationsFolder.addInput(params, "smooth", {
      min: -2,
      max: 2,
      title: "",
    });
    optimisationsFolder.addInput(params, "simplify", {
      min: 0,
      max: 100,
      step: 1,
    });

    const resetSmooth = optimisationsFolder.addButton({
      title: "clear smoothing",
    });
    resetSmooth.on("click", () => {
      params.smooth = 0;
      smooth.refresh();
    });
  };

  const addLayerButton = pane.addButton({ title: "Add Layer" });
  addLayerButton.on("click", () => {
    const layer = JSON.parse(
      JSON.stringify(paramsExport[paramsExport.length - 1])
    );
    paramsExport.push(layer);
    addLayer(layer, paramsExport.length);
  });

  const btn = pane.addButton({ title: "Redraw" });
  btn.on("click", () => {
    redraw();
  });

  const btnExport = pane.addButton({ title: "export" });
  btnExport.on("click", () => {
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(paramsExport));
    var dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "export.json");
    dlAnchorElem.click();
  });

  for (let i in paramsExport) {
    addLayer(paramsExport[i], i);
  }
};
