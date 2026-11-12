/**
 * The pane: the batch's size, the share of its slots that show, the draws it costs, and a folder that sets every
 * slot's shape, colour and passes
 *
 * Each row that changes the batch calls one named function in `index.ts`, where every `BatchedMesh3D` call is written
 * out.
 */

import { RenderPassBit } from '@pixi/3d';

import { CLAY_COLORS } from './theme/palette';
import { CLAY_SHAPES } from './theme/shapes';

/** What the pane sets */

/** A list rather than a slider, since each change builds a whole batch */
const SIZES = {
  '1,000': 1_000,
  '10,000': 10_000,
  '25,000': 25_000,
  '50,000': 50_000,
  '100,000': 100_000,
};
/** `OPAQUE` alone draws the slots with no shadow, and `SHADOW` alone draws only their shadows */
const PASSES = {
  'OPAQUE | SHADOW': RenderPassBit.OPAQUE | RenderPassBit.SHADOW,
  OPAQUE: RenderPassBit.OPAQUE,
  SHADOW: RenderPassBit.SHADOW,
};
/**
 * The lowest share the slider reaches. WebGL skips a draw with no shown slot, so at 0 a shape's draw would leave while
 * the draws row still counts it; at 0.05 every shape keeps some at every size.
 */
const MIN_SHARE = 0.05;

export function createControls(options) {
  const { pane, settings, webgpu } = options;
  // The shadow pass draws with a shader of its own and binds no material, so it draws each shape once. The opaque pass
  // binds each slot's material: WebGL draws each shape once, as the colours share a shader, and WebGPU once per colour
  // in use, until a shape's colours would pass 16 draws and merge into one; there are only eight. The size and the
  // share shown change how many instances a draw holds, not how many draws there are. It's worked out from these
  // settings, not measured, and counts the main view only: a profiler also sees the loupe draw the opaque pass again,
  // and a material of another class, alpha mode or render state would split draws it misses.
  const cost = {
    get draws() {
      const opaque =
        settings.passes & RenderPassBit.OPAQUE
          ? settings.shapes * (webgpu ? settings.colors : 1)
          : 0;
      const shadow =
        settings.passes & RenderPassBit.SHADOW ? settings.shapes : 0;

      return opaque + shadow;
    },
  };

  pane
    .addBinding(settings, 'size', { options: SIZES })
    .on('change', ({ value }) => options.resize(value));
  pane
    .addBinding(settings, 'visibleShare', {
      label: 'visible share',
      min: MIN_SHARE,
      max: 1,
      step: 0.01,
    })
    .on('change', ({ value }) => options.showShare(value));
  pane.addBinding(cost, 'draws', {
    readonly: true,
    format: (draws) => draws.toFixed(0),
  });

  const slots = pane.addFolder({ title: 'every slot' });

  slots
    .addBinding(settings, 'shapes', {
      min: 1,
      max: CLAY_SHAPES.length,
      step: 1,
    })
    .on('change', ({ value }) => options.useShapes(value));
  slots
    .addBinding(settings, 'colors', {
      label: 'colours',
      min: 1,
      max: CLAY_COLORS.length,
      step: 1,
    })
    .on('change', ({ value }) => options.useColors(value));
  slots
    .addBinding(settings, 'passes', { options: PASSES })
    .on('change', ({ value }) => options.usePasses(value));
}
