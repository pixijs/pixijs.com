/**
 * The pane: a `fog` folder that mirrors the fog objects, and the `background` row beside it, as `view3d.background`
 * sits beside `view3d.fog`
 *
 * The distance and density rows bind straight to the fog objects and `background` straight to the view, so each row's
 * label is the property it writes. The curve and the colour go through `index.ts`'s functions, since one assigns
 * another object and the other writes every fog and the sky.
 */

import { mixColor, THEMES } from './theme/palette';

/** One decimal for a distance; a density needs four before a change shows */
const DISTANCE = { format: (value) => value.toFixed(1) };
const DENSITY = { min: 0, max: 0.08, format: (value) => value.toFixed(4) };

export function createControls(options) {
  const { pane, stage, view3d, fogs, setFogType, setFogColor } = options;
  // The curve and colour rows edit copies, since each change goes through a function rather than one property.
  const picked = {
    type: view3d.fog?.type ?? 'linear',
    color: fogs.linear.color,
  };
  // Refreshing a row fires its change event, which would otherwise write the colour back while the theme fades it.
  let syncing = false;
  let theme = stage.theme;
  /** The colour a theme fade started from and the darkness it started at, or -1 with no fade running */
  let fadeFrom = -1;
  let fadeStart = 0;

  const folder = pane.addFolder({ title: 'fog' });

  folder
    .addBinding(picked, 'type', {
      options: { linear: 'linear', exponential: 'exponential', exp2: 'exp2' },
    })
    .on('change', ({ value }) => {
      setFogType(value);
      showRows();
    });
  // The two ranges never meet, so `near` stays under `far`, as linear fog needs.
  const nearRow = folder.addBinding(fogs.linear, 'near', {
    min: 0,
    max: 30,
    ...DISTANCE,
  });
  const farRow = folder.addBinding(fogs.linear, 'far', {
    min: 35,
    max: 100,
    ...DISTANCE,
  });
  const densityRows = {
    exponential: folder.addBinding(fogs.exponential, 'density', DENSITY),
    exp2: folder.addBinding(fogs.exp2, 'density', DENSITY),
  };
  const colorRow = folder
    .addBinding(picked, 'color', { view: 'color' })
    .on('change', ({ value }) => {
      if (syncing) return;
      setFogColor(value);
      backgroundRow.refresh();
    });
  const backgroundRow = pane.addBinding(view3d, 'background', {
    view: 'color',
  });

  showRows();

  /** Shows the rows of the live curve only */
  function showRows() {
    nearRow.hidden = farRow.hidden = picked.type !== 'linear';
    densityRows.exponential.hidden = picked.type !== 'exponential';
    densityRows.exp2.hidden = picked.type !== 'exp2';
  }

  function showColors() {
    syncing = true;
    picked.color = fogs.linear.color;
    colorRow.refresh();
    backgroundRow.refresh();
    syncing = false;
  }

  return {
    followTheme() {
      if (stage.theme !== theme) {
        theme = stage.theme;
        fadeFrom = fogs.linear.color;
        fadeStart = stage.darkness;
      }
      if (fadeFrom < 0) return;

      const end = theme === 'dark' ? 1 : 0;
      const k =
        end === fadeStart
          ? 1
          : (stage.darkness - fadeStart) / (end - fadeStart);

      // A colour the reader picked gives way to the new theme's haze, and a background moved off it is matched again.
      setFogColor(mixColor(fadeFrom, THEMES[theme].haze, k));
      if (k >= 1) fadeFrom = -1;
      showColors();
    },
  };
}
