# Plotter Playground

The purpose of this project is to streamline and document the process of converting vector line art to be printed on a modded Ender 3 printer.

## Artwork generation

![App Example](./supporting/doc-files/app-example.png)

this repo contains a app that can be used to generate SVGs from sets of points using the brilliant [canvas-sketch](https://github.com/mattdesl/canvas-sketch) and various resources online.

some code taken from resouces online, with some added extras.

## running

- `yarn install`
- `yarn start`
- `ctrl-s` in browser to export.

## Printing artwork.

- generate svg line to svg with this tool
- **change svg width and height units to mm**
- convert to gcode with [svg2gcode](https://sameer.github.io/svg2gcode/#close) / [github](https://github.com/sameer/svg2gcode). see below for settings, adjust the feedrate based on image / amount of detail. _Have previously tried InkScape for this but produces too many artifacts with more compicated SVGs. with built in gcode tools_
- print! I have been uploading to octoprint but this should work with sd card.
- the printer will auto home, move to the front left corner of your build surface and wait for a user input, load the pen now and resume!

## Resources

### Ender 3 Plotter attachment

[see supporting docs](./supporting/ender-3-plotter/readme.md)

### Svg2gcode settings

online tool can be used or command line option using svg2gcode command line:

`./svg2gcode --settings svg2gcode.json --out ./out.gcode ./input.svg`

## todo:

- intergrate svg2gcode into project? remove manual use of hosted version.
