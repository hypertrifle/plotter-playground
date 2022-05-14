## current method

- generate svg line to svg with this tool
- **change svg width and height units to mm**
- convert to gcode with (svg2gcode)[https://sameer.github.io/svg2gcode/#close]. see below for settings, adjust the feedrate based on image.

```json
{
  "conversion": {
    "tolerance": 0.002,
    "feedrate": 1500.0,
    "dpi": 72.0,
    "origin": [106.0, 74.0]
  },
  "machine": {
    "supported_functionality": {
      "circular_interpolation": true
    },
    "tool_on_sequence": "G0 Z1.5",
    "tool_off_sequence": "G0 Z5",
    "begin_sequence": "G28 ; Home all axes\nG00 X77 Y39 Z1.3\nM0",
    "end_sequence": "M5\nG90 ;Absolute positioning\nG1 X0 Y220.0 ;Present print\nM2"
  },
  "postprocess": {
    "origin": [106.0, 74.0]
  }
}
```

svg2gcode --speed 400 --feed 300 --top 10 -d 1 ./output/2022.05.04-22.22.09-1.svg > test.gcode
