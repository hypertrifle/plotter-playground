import { defaultLayer } from "../settings";

export type Lines = [number, number][][];

export type Generate = (
  opt: {
    width: number;
    height: number;
    frame: number;
    params: typeof defaultLayer;
  },
  p?: any
) => Lines;
