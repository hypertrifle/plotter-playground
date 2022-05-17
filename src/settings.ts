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
  GEO_PERLIN,
  JUST_CLIP_PATH,
}

export enum ClipType {
  SQUARE,
  CIRCLE,
  TRIANGLE,
  NONE,
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
  smooth: 0.01,
  simplify: 1,
  mode: RenderMode.GEO,
  clippings: [],
  // clipOuter: ClipType.TRIANGLE,
  // clipInner: ClipType.NONE,
  // clipInnerBorder: true,
  // clipOuterBorder: true,
  // clipInnerSize: 80,
  // clipOuterSize: 90,
  noise: 1,
  geoMod: 4,
  jitterX: 0,
  jitterY: 0,
  name: "",
  colour: { r: 0, g: 0, b: 0 },
};

export const createPane = (redraw: () => void) => {
  const pane = new Pane();

  let clipCount = 0;

  const addClip = () => {
    //add to params
    console.log("addClip");
    const p = {
      type: ClipType.TRIANGLE,
      renderBorder: true,
      size: 80,
      offsetX: 50,
      offsetY: 50,
      invert: false,
    };

    const i = params.clippings.push(p);
    console.log(params);
    //setup tweakpane

    let folder = tabs.pages[3].addFolder({ title: `Clip #${i}` });
    folder.addInput(p, "type", {
      options: {
        none: ClipType.NONE,
        square: ClipType.SQUARE,
        circle: ClipType.CIRCLE,
        triangle: ClipType.TRIANGLE,
      },
      title: "type",
    });
    folder.addInput(p, "renderBorder");
    folder.addInput(p, "size", {
      min: 0,
      max: 100,
      step: 1,
    });
    folder.addInput(p, "offsetX", {
      min: 0,
      max: 100,
      step: 1,
    });
    folder.addInput(p, "offsetY", {
      min: 0,
      max: 100,
      step: 1,
    });

    folder.addInput(p, "invert");

    const remove = folder.addButton({ title: "Remove" });
    remove.on("click", () => {
      folder.dispose();
      params.clippings.splice(i, 1);
    });
  };

  const tabs = pane.addTab({
    pages: [
      { title: "mode" },
      { title: "perlin" },
      { title: "Geometric" },
      { title: "Clipping" },
    ],
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
    },
  });

  tabs.pages[2].addInput(params, "geoMod", { min: 0, max: 13, step: 1 });

  const variationFolder = tabs.pages[0].addFolder({ title: "variation" });

  variationFolder.addInput(params, "noise", {
    min: 0,
    max: 100,
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

  const animatationFolder = tabs.pages[0].addFolder({ title: "animation" });
  animatationFolder.addInput(params, "animate");
  animatationFolder.addInput(params, "frame", { min: 0, max: 1000 });

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

  const optimisationsFolder = tabs.pages[0].addFolder({
    title: "Optimisations",
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

  const btn = tabs.pages[0].addButton({ title: "Redraw" });
  btn.on("click", () => {
    redraw();
  });

  const btnExport = tabs.pages[0].addButton({ title: "export" });
  btnExport.on("click", () => {
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(params));
    var dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "export.json");
    dlAnchorElem.click();
  });
};
