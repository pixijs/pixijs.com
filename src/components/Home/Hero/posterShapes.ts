import type { HeroShapeName } from './field/kinds';

/**
 * A shape's centre and size in the hero's frame: left as a percentage, top as a percentage or any CSS length (see
 * {@link over}, {@link strip} and {@link sunk}), and size in hundredths of the frame's width
 */
export type PosterSpot = [left: number, top: number | string, size: number];

/**
 * The copy sits in the middle of the hero under a fixed clearance for the top bar, so on a laptop the room above it
 * is a strip of that clearance and on a tall screen it's much more. `--above` (`hero.scss`) is the depth of that
 * room, and these hang a shape in it. A percentage would walk the shape into the headline as the hero gets shorter.
 */

/** Over the copy's top edge, with its own bottom edge `gap` px clear of it: for a shape that bleeds off the top */
const over = (gap: number): string => `calc(var(--above) - ${gap}px - var(--sz) * 0.45)`;
/** `share` of the way down the room above the copy, `nudge` px further */
const strip = (share: number, nudge = 0): string => `calc(var(--above) * ${share} + ${nudge}px)`;
/** Sunk into the wave at the hero's bottom edge, its centre `share` of its own size above the edge */
const sunk = (share: number): string => `calc(100% - var(--sz) * ${share})`;
/** Tucked under a phone's top bar, its centre `share` of its own size below the bar */
const tucked = (share: number): string => `calc(var(--px-topbar-h) + var(--sz) * ${share})`;
/** On the wave, its centre `share` of its own size above the wave's top line: half of it shows at 0 */
const wave = (share: number): string => `calc(100% - var(--wave) - var(--sz) * ${share})`;

type MirrorBand = 'wide' | 'mid' | 'compact' | 'compactShort';

const MIRRORED: MirrorBand[] = ['wide', 'mid', 'compact', 'compactShort'];

/** How high a shape at `depth` stands off the surface, against one in the middle of the slab; its shadow drops that much further */
export const heightAt = (depth: number): number => 1 + 0.6 * depth;

export interface PosterShape {
  shape: HeroShapeName;
  /**
   * Where it stands per width band, and it's hidden in a band without one: `wide` from 1100 px of content, `mid`
   * from 860, where the headline still runs to two lines, `compact` from 720, and `narrow`. A `wide` spot left of 0
   * or right of 100 stands in the margin a hero wider than the frame leaves, and off screen on any narrower one.
   */
  wide?: PosterSpot;
  mid?: PosterSpot;
  compact?: PosterSpot;
  narrow?: PosterSpot;
  /** Its `narrow` spot needs a phone at least 800 px tall: above the copy, or above the Pause motion control */
  narrowTall?: boolean;
  /**
   * Its `compact` spot on a screen under 1000 px tall, where the room above and below the copy is too shallow for the
   * `compact` one: in the gutters beside the copy
   */
  compactShort?: PosterSpot;
  /** Its spots on a mirrored hero where the mirror image of one would land on the GitHub button; `null` leaves it out */
  flip?: Partial<Record<MirrorBand, PosterSpot | null>>;
  /** -1 the furthest back to 1 the nearest: what passes in front of what, how high it stands and how far it drifts */
  depth: number;
}

/**
 * The hero's shapes (section 8.1), on `/` and on `/3d` with its logo and install chip: a few, close in size, as the
 * original 3D demo had them (about 5.5 to 11 hundredths of the frame; 8 to 14 on phones), bleeding off the frame,
 * sunk into the wave and scattered round the copy, with three voxel bunnies among them. Each band is composed round its own
 * copy, the nav pill, the GitHub button and the Pause motion control, at the shortest the hero gets. The server draws
 * them, and the live field picks up every one where it stands.
 */
export const POSTER_SHAPES: PosterShape[] = [
  {
    shape: 'sphere-cyan',
    wide: [95.5, 60, 11],
    mid: [98, 66, 10.1],
    compact: [98.5, 73, 10.1],
    narrow: [92, tucked(0.35), 14],
    narrowTall: true,
    depth: 1,
  },
  {
    shape: 'sphere-violet',
    wide: [2.5, over(20), 9.7],
    mid: [2, over(20), 10.1],
    compact: [2, over(20), 10.1],
    narrow: [8, tucked(0.35), 13.5],
    narrowTall: true,
    flip: { wide: [80, over(20), 9.7], mid: [79, over(20), 8.9], compact: [97, 22, 7.4] },
    depth: 0.3,
  },
  {
    shape: 'torus-cyan',
    wide: [20, sunk(0.46), 8.9],
    mid: [19, sunk(0.46), 8.9],
    compact: [17, sunk(0.46), 9.3],
    narrow: [42, sunk(0.46), 11.3],
    depth: 0.7,
  },
  {
    shape: 'bunny-gold',
    wide: [12, 72, 8.9],
    mid: [9, 74, 8.2],
    compact: [10, 72, 8.7],
    narrow: [6, sunk(0.55), 12],
    depth: 0.8,
  },
  {
    shape: 'bunny-gold',
    wide: [11, 22, 8],
    mid: [29, 17, 7.5],
    compact: [8, 32, 8.5],
    compactShort: [6, 55, 7.5],
    depth: 0.2,
  },
  {
    shape: 'bunny-gold',
    wide: [87, 78, 8.5],
    mid: [92, 52, 8],
    compact: [93, strip(0.95), 8.5],
    compactShort: [74, strip(0.85), 7.5],
    narrow: [93, 28, 11],
    narrowTall: true,
    depth: 0.5,
  },
  {
    shape: 'cube-pink',
    wide: [79, over(26), 8],
    mid: [80, over(26), 6.3],
    compact: [70, 86, 6.3],
    compactShort: [85, strip(0.85), 6.3],
    depth: 0.6,
  },
  {
    shape: 'cube-violet',
    wide: [7, 55, 7.6],
    mid: [80, 78, 6.6],
    compact: [84, strip(0.62), 7.4],
    compactShort: [94, wave(0.3), 6.6],
    narrow: [64, tucked(0.9), 9.6],
    narrowTall: true,
    depth: 0.4,
  },
  {
    shape: 'pyramid-pink',
    wide: [77, 77, 6.8],
    mid: [5, 49, 6.3],
    compact: [90, 65, 6.3],
    flip: { compact: [6, 66, 6.3], compactShort: [7, 61, 6.3] },
    depth: 0.5,
  },
  {
    shape: 'torus-pink',
    wide: [21, over(28), 6.8],
    mid: [17, over(28), 6.4],
    compact: [22, over(28), 6.6],
    compactShort: [10, strip(0.75), 6.1],
    narrow: [38, strip(0.5, 28), 10.5],
    narrowTall: true,
    flip: { wide: null, mid: null },
    depth: -0.3,
  },
  {
    shape: 'octahedron-violet',
    wide: [79, wave(0.3), 6.6],
    mid: [76, wave(0), 6.1],
    compact: [68, wave(0.2), 5.9],
    narrow: [62, wave(1.1), 8.3],
    narrowTall: true,
    depth: -0.5,
  },
  {
    shape: 'capsule-rose',
    wide: [27, 82, 6.3],
    mid: [69, wave(0.3), 5.7],
    narrow: [5, 31, 8],
    depth: 0.1,
  },
  {
    shape: 'pyramid-cyan',
    mid: [11, 55, 5.9],
    compact: [16, 84, 5.9],
    compactShort: [44, wave(0.1), 5.9],
    narrow: [92, wave(1.9), 9.6],
    narrowTall: true,
    depth: -0.2,
  },
  {
    shape: 'cylinder-cyan',
    wide: [70, 87, 6.3],
    mid: [89, 62, 5.7],
    compact: [56, 88, 5.9],
    compactShort: [86, 82, 5.9],
    depth: 0.3,
  },
  {
    shape: 'sphere-pink',
    wide: [33, wave(0.1), 5.7],
    mid: [31, wave(0.1), 5.7],
    compact: [33, wave(0.1), 5.7],
    depth: -1,
  },
  { shape: 'sphere-violet', wide: [96, 30, 5.9], mid: [97, strip(0.75), 5.5], depth: -0.4 },
  { shape: 'sphere-pink', wide: [-8, 62, 6.3], depth: 0.2 },
  { shape: 'torus-cyan', wide: [-10, 22, 5.9], depth: -0.3 },
  { shape: 'cube-violet', wide: [108, 30, 6.4], depth: 0.1 },
  { shape: 'capsule-rose', wide: [111, 78, 6.1], depth: -0.2 },
];

/**
 * A shape on a mirrored hero, the composition `/3d` stands the other way round from `/`'s: from 720 px of content each
 * spot is turned left for right, or swapped for its `flip` one. Phones keep theirs, as the Pause motion control does.
 */
export function mirrored(shape: PosterShape): PosterShape {
  const turned: PosterShape = { ...shape };

  for (const band of MIRRORED) {
    const at = shape[band];

    turned[band] =
      shape.flip && band in shape.flip ? (shape.flip[band] ?? undefined) : at && [100 - at[0], at[1], at[2]];
  }

  return turned;
}
