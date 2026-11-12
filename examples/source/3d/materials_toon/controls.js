/**
 * The pane: a folder for the toon material's values and one for the outline pass
 *
 * Each folder's rows bind to the options object its half was built from, and a change goes through the function
 * `index.ts` hands in, so every material and pass call stays there.
 */

/** Up to 0.1 local units, 2.5 times the starting width; each step is a shader, so a drag builds at most 21 */
const WIDTH_RANGE = { min: 0, max: 0.1, step: 0.005 };

const twoDecimals = (value) => value.toFixed(2);

export function createControls({
  pane,
  toon,
  outline,
  onToon,
  onOutline,
  onEnabled,
}) {
  const toonFolder = pane.addFolder({ title: 'ToonMaterial' });

  toonFolder
    .addBinding(toon, 'bands', { min: 1, max: 8, step: 1 })
    .on('change', onToon);
  toonFolder
    .addBinding(toon, 'specularSize', { min: 0, max: 0.3, format: twoDecimals })
    .on('change', onToon);
  toonFolder
    .addBinding(toon, 'rimIntensity', { min: 0, max: 1, format: twoDecimals })
    .on('change', onToon);
  toonFolder
    .addBinding(toon, 'rimPower', {
      min: 0.5,
      max: 8,
      format: (value) => value.toFixed(1),
    })
    .on('change', onToon);

  const outlineFolder = pane.addFolder({ title: 'OutlinePass' });

  outlineFolder
    .addBinding(outline, 'width', {
      ...WIDTH_RANGE,
      format: (value) => value.toFixed(3),
    })
    .on('change', onOutline);
  // The renderer keeps every colour's shader, so a drag across the picker builds one pass, when it ends.
  outlineFolder
    .addBinding(outline, 'color', { view: 'color' })
    .on('change', ({ last }) => {
      if (last) onOutline();
    });
  outlineFolder.addBinding(outline, 'enabled').on('change', onEnabled);
}
