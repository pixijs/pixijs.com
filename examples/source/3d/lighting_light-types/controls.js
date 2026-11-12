/**
 * The pane: a row that shows all four lights or one alone, the lights and shadow maps in use, and a folder for each
 * light
 *
 * Rows bind straight to the lights' own properties. Switching lights and setting a colour need code, so they go
 * through the two functions `index.ts` hands in, and every light call stays there.
 */

import { MAX_LIGHTS } from '@pixi/3d';

/**
 * Each intensity row's range. Tweakpane clamps a bound value into its slider when the row is made, so each top sits
 * above the light's value in `index.ts`, and for the bulb and the spot above four times that, as the dark theme sets.
 * The dark theme stops the bulb and the spot at their tops, so a row never reads less than its light shines at.
 */
export const INTENSITY = {
  sun: { max: 3, step: 0.1 },
  bulb: { max: 30, step: 0.1 },
  lamp: { max: 400, step: 1 },
  fill: { max: 1.5, step: 0.1 },
};
/** The bulb's range up to where its floor ring still fits the frame */
const RANGE = { min: 0, max: 2.6, step: 0.1 };
/** The spot's cone up to where its outline still passes clear of the logo */
const CONE_ANGLE = { min: 5, max: 32, step: 1 };

/** Which lights the Show row says are on: all four, one alone, or any other mix */

const LIGHT_NAMES = ['sun', 'bulb', 'lamp', 'fill'];
const SHOW_OPTIONS = {
  all: 'all',
  DirectionalLight: 'sun',
  PointLight: 'bulb',
  SpotLight: 'lamp',
  AmbientLight: 'fill',
  custom: 'custom',
};

export function createControls(options) {
  const { pane, sun, bulb, lamp, fill, usage, showOnly, setLightColor } =
    options;
  const lights = { sun, bulb, lamp, fill };
  const folders = [];
  const visibleRows = [];
  // Read from the lights, so it shows 'custom' once the reader switches lights on and off in their folders. A pane
  // refresh writes back the value it just read, so a write that matches what's on changes nothing.
  const show = {
    get lights() {
      let on = 0;
      let last = 'sun';

      for (const name of LIGHT_NAMES) {
        if (!lights[name].visible) continue;
        on++;
        last = name;
      }

      return on === LIGHT_NAMES.length ? 'all' : on === 1 ? last : 'custom';
    },
    set lights(value) {
      if (value === show.lights || value === 'custom') return;
      showOnly(value === 'all' ? null : lights[value]);
    },
  };
  const showRow = pane.addBinding(show, 'lights', {
    label: 'Show',
    options: SHOW_OPTIONS,
  });

  // Picking 'custom' switches nothing, so the row reads the lights back and shows what's really on.
  showRow.on('change', () => {
    for (const row of visibleRows) row.refresh();
    showRow.refresh();
  });
  pane.addBinding(usage, 'lights', {
    label: 'lights in use',
    readonly: true,
    format: (count) => `${count} of ${MAX_LIGHTS}`,
  });
  pane.addBinding(usage, 'shadowMaps', {
    label: 'shadows',
    readonly: true,
    format: (count) => `${count} ${count === 1 ? 'map' : 'maps'}`,
  });

  /** A light's folder with the rows every light has: on or off, colour and intensity */
  function addFolder(light, title, intensity) {
    const folder = pane.addFolder({ title, expanded: false });
    // Tweakpane edits a number as a colour, so the row binds a copy and hands each new value to the light.
    const picked = { color: light.color.toNumber() };

    folders.push(folder);
    // One light's folder at a time, so the pane stays short and clear of the scene.
    folder.on('fold', ({ expanded }) => {
      if (expanded)
        for (const other of folders) other.expanded = other === folder;
    });
    // A closed folder hides its `visible` row, so its title says when the light is off.
    const visibleRow = folder.addBinding(light, 'visible').on('change', () => {
      folder.title = light.visible ? title : `${title} (off)`;
      showRow.refresh();
    });

    visibleRows.push(visibleRow);
    folder
      .addBinding(picked, 'color', { view: 'color' })
      .on('change', ({ value }) => setLightColor(light, value));
    folder.addBinding(light, 'intensity', { min: 0, ...intensity });

    return folder;
  }

  addFolder(sun, 'DirectionalLight', INTENSITY.sun).addBinding(
    sun,
    'castShadow',
  );
  addFolder(bulb, 'PointLight', INTENSITY.bulb).addBinding(
    bulb,
    'range',
    RANGE,
  );

  const lampFolder = addFolder(lamp, 'SpotLight', INTENSITY.lamp);

  lampFolder.addBinding(lamp, 'coneAngle', CONE_ANGLE);
  lampFolder.addBinding(lamp, 'penumbra', { min: 0, max: 1, step: 0.01 });
  lampFolder.addBinding(lamp, 'castShadow');

  addFolder(fill, 'AmbientLight', INTENSITY.fill);
}
