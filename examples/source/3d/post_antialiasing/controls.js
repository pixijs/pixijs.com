/**
 * The pane: `antialias`, which reloads the page; the three effects' `enabled` flags; two read-only rows, the
 * anti-aliasing the view gets and the wire's width in the loupe; and FXAA's three knobs, greyed out while FXAA is off
 */

/** The thresholds' readout, to the three decimals FXAA's defaults are written in */
const THREE_DECIMALS = { format: (value) => value.toFixed(3) };

export function createControls({
  pane,
  stage,
  antialias,
  effect,
  ssao,
  fxaa,
  antiAliasing,
  wire,
}) {
  pane
    .addBinding({ antialias }, 'antialias')
    .on('change', ({ value }) => reloadWith(value));
  pane.addBinding(effect, 'enabled', { label: 'effect.enabled' });
  pane.addBinding(ssao, 'enabled', { label: 'ssao.enabled' });

  const fxaaRow = pane.addBinding(fxaa, 'enabled', { label: 'fxaa.enabled' });

  pane.addBinding(
    {
      get value() {
        return antiAliasing();
      },
    },
    'value',
    { label: 'In use', readonly: true },
  );
  pane.addBinding(wire, 'wireWidth', {
    label: 'Wire width',
    readonly: true,
    format: (px) => `${px.toFixed(1)} px`,
  });

  const knobs = pane.addFolder({ title: 'fxaa' });

  // Each runs from its default to past the far rail's contrast, where the loupe's steps come back: below the default
  // the rail looks the same.
  knobs.addBinding(fxaa, 'edgeThreshold', {
    min: 0.125,
    max: 0.35,
    step: 0.005,
    ...THREE_DECIMALS,
  });
  // Two rows, since the label column is too narrow for the whole name on one.
  knobs.addBinding(fxaa, 'edgeThresholdMin', {
    label: 'edgeThreshold\nMin',
    min: 0.05,
    max: 0.3,
    step: 0.005,
    ...THREE_DECIMALS,
  });
  knobs.addBinding(fxaa, 'edgeSharpness', {
    options: [
      { text: '2 (softest)', value: 2 },
      { text: '4', value: 4 },
      { text: '8 (sharpest)', value: 8 },
    ],
  });
  knobs.disabled = !fxaa.enabled;
  fxaaRow.on('change', ({ value }) => (knobs.disabled = !value));

  /** `antialias` can't change on a live canvas, so the page reloads with it, and with the effects as they are */
  function reloadWith(value) {
    const url = new URL(location.href);

    url.searchParams.set('antialias', value ? 'on' : 'off');
    url.searchParams.set('effect', effect.enabled ? 'on' : 'off');
    url.searchParams.set('ssao', ssao.enabled ? 'on' : 'off');
    url.searchParams.set('fxaa', fxaa.enabled ? 'on' : 'off');
    url.searchParams.set('theme', stage.theme);
    location.replace(url);
  }
}
