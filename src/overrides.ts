import { eachPath, drawSVGPath, pathsToSVG } from "canvas-sketch-util/penplot";
import convert from "convert-length";

var DEFAULT_PEN_THICKNESS = 0.03;
var DEFAULT_PEN_THICKNESS_UNIT = "cm";
var DEFAULT_PIXELS_PER_INCH = 90;

export interface Group {
  lines: number[][];
  lineWidth?: number;
  color?: { r: number; g: number; b: number };
}

export function renderPaths(inputs: Group[], opt, paramsExport?: any) {
  opt = opt || {};

  var context = opt.context;
  if (!context) throw new Error('Must specify "context" options');

  var units = opt.units || "px";

  var width = opt.width;
  var height = opt.height;
  if (typeof width === "undefined" || typeof height === "undefined") {
    throw new Error('Must specify "width" and "height" options');
  }

  // Choose a default line width based on a relatively fine-tip pen
  var lineWidth = opt.lineWidth;
  if (typeof lineWidth === "undefined") {
    // Convert to user units
    lineWidth = convert(
      DEFAULT_PEN_THICKNESS,
      DEFAULT_PEN_THICKNESS_UNIT,
      units,
      {
        roundPixel: false,
        pixelsPerInch: DEFAULT_PIXELS_PER_INCH,
      }
    );
  }

  // Clear canvas
  context.clearRect(0, 0, width, height);

  context.globalCompositeOperation = "multiply";

  // Fill with white
  context.fillStyle = opt.background || "white";
  context.fillRect(0, 0, width, height);

  context.strokeStyle = opt.foreground || opt.strokeStyle || "black";
  context.lineWidth = lineWidth;
  context.lineJoin = opt.lineJoin || "miter";
  context.lineCap = opt.lineCap || "butt";

  inputs.forEach((group) => {
    // Draw lines
    eachPath(group.lines, function (feature) {
      if (group.color) {
        context.strokeStyle = `rgba(${group.color.r},${group.color.g},${group.color.b},1)`;
      }
      context.beginPath();
      if (typeof feature === "string") {
        // SVG string = drawSVGPath;
        drawSVGPath(context, feature);
      } else {
        // list of points
        feature.forEach(function (p) {
          context.lineTo(p[0], p[1]);
        });
      }
      context.stroke();
    });
  });

  // Save layers
  let svgs = inputs.map((group) => {
    if (group.color) {
      opt.strokeStyle = `rgb(${group.color.r},${group.color.g},${group.color.b})`;
    }

    return {
      data: pathsToSVG(group.lines, opt),
      extension: ".svg",
    };
  });

  (context.canvas as HTMLCanvasElement).toBlob((blob) => {
    let file = new File([blob], "fileName.png", { type: "image/png" });
    svgs.unshift({
      data: file,
      extension: ".png",
    });
  }, "image/png");

  if (paramsExport) {
    svgs.push({
      data: JSON.stringify(paramsExport, undefined, 1),
      extension: ".json",
    });
  }

  return svgs;
}
