# Plotter Mod

supporting 3d prints for ender 3 plotting.

## Pen Holder

Designed for and Ender 3 with an exisiting BLtouch attachments, incuded [stl](./export/plotter-v2-v7.stl) and [fusion 360 export](./export/plotter-v2-v7.f3d)

other attachments on thingiverse where either;

- designed to allow flex (giving lower acuracy)
- attached to a less stable part of the printer (giving lower accuracy)
- clamped pen to far a distance from the bed (giving lower accuracy)

the base unit will take any pen with a diameter of 12mm and below, with smaller more acurate pens utilising adapters (see fine line adapter)

## Fine line holder

designed for Stabilo point 88 fine liners. [stl]() and [fusion 360 export]()

- does not clamp pen, but uses gravity to apply pressure.
- allows smooth verticle movement, but restricts x / y

### nozzle offset

All offset / gcode values especcially recarding Z position will need to be calibrated to your printer, also different printer medium with vary, please only use these as a guide.

this mod brings the tip of a pen to around:

```json
{
    x:
    y:
    z:
}

``\
```
