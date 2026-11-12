/**
 * The pane: a folder per effect
 *
 * The vignette's rows bind the effect itself, since each of its properties is a uniform write. The edge blur's rows
 * bind its options and call `applyBlur()`, since a new `resolution` replaces the effect.
 */

const RESOLUTIONS = { 1: 1, 0.5: 0.5, 0.25: 0.25, 0.125: 0.125 };

export function createControls({ pane, vignette, blur, applyBlur }) {
  const vignetteRows = pane.addFolder({ title: 'vignette' });

  vignetteRows.addBinding(vignette, 'enabled');
  vignetteRows.addBinding(vignette, 'strength', { min: 0, max: 1, step: 0.01 });
  vignetteRows.addBinding(vignette, 'radius', { min: 0, max: 0.7, step: 0.01 });
  // smoothstep needs its two edges apart.
  vignetteRows.addBinding(vignette, 'softness', {
    min: 0.05,
    max: 0.7,
    step: 0.01,
  });

  const blurRows = pane.addFolder({ title: 'edgeBlur' });

  blurRows.addBinding(blur, 'enabled');
  blurRows.addBinding(blur, 'radius', { min: 0, max: 0.7, step: 0.01 });
  blurRows.addBinding(blur, 'softness', { min: 0.05, max: 0.7, step: 0.01 });
  // Past 32 the taps sit more than 2 blur texels apart at 0.25, and the blur bands.
  blurRows.addBinding(blur, 'size', { min: 0, max: 32, step: 1 });
  blurRows.addBinding(blur, 'resolution', { options: RESOLUTIONS });
  blurRows.on('change', applyBlur);
}
