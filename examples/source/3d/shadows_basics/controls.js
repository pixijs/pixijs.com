/**
 * The pane: which light is on and whether it sways, each light's `castShadow` and biases, the logo's `castShadow`, the
 * wall's `receiveShadow`, and the shadow map's size and filter
 */

/** The bias stops, spaced by ratio, since acne lives under 0.0004 and peter-panning shows from 0.02 under the sun */
const BIAS_STOPS = [0, 0.0002, 0.0005, 0.001, 0.002, 0.005, 0.01, 0.02, 0.03];
/** The normalBias stops in world units, up to where the stripes are gone */
const NORMAL_BIAS_STOPS = [0, 0.005, 0.01, 0.02, 0.03];
/** The normalBias row's text for leaving it unset, so the engine sizes it */
const AUTO = 'auto';

export function createControls(options) {
  const { pane, view3d, sun, spot, logo, wall, motion } = options;
  // The rows with no single property to bind to; each change goes through index.ts.
  const rows = {
    light: sun.visible ? 'sun' : 'spot',
    logoCastShadow: logo.meshes[0].castShadow,
    wallReceiveShadow: wall.receiveShadow,
  };
  const start = {
    ...rows,
    moveLight: motion.moveLight,
    quality: view3d.shadowQuality,
    filter: view3d.shadowFilter,
  };
  const biasOptions = BIAS_STOPS.map((value) => ({
    text: String(value),
    value,
  }));
  const normalBiasOptions = [AUTO, ...NORMAL_BIAS_STOPS.map(String)].map(
    (value) => ({ text: value, value }),
  );

  pane
    .addBinding(rows, 'light', {
      label: 'Light',
      options: { DirectionalLight: 'sun', SpotLight: 'spot' },
    })
    .on('change', ({ value }) => {
      options.useLight(value);
      showLightFolder();
    });
  pane.addBinding(motion, 'moveLight', { label: 'Move light' });

  /** A light's folder: its castShadow and bias bound straight to it, and its normalBias, which can be unset */
  function addLightFolder(light, title) {
    const folder = pane.addFolder({ title });
    const lightStart = {
      castShadow: light.castShadow,
      bias: light.shadow.bias,
      normalBias: light.shadow.normalBias,
    };
    // A pane list can't hold `undefined`, so the row shows each stop as text, and unset as 'auto'.
    const row = { normalBias: String(lightStart.normalBias ?? AUTO) };

    folder.addBinding(light, 'castShadow');
    folder.addBinding(light.shadow, 'bias', { options: biasOptions });
    folder
      .addBinding(row, 'normalBias', { options: normalBiasOptions })
      .on('change', ({ value }) => {
        light.shadow.normalBias = value === AUTO ? undefined : Number(value);
      });

    return {
      folder,
      reset() {
        light.castShadow = lightStart.castShadow;
        light.shadow.bias = lightStart.bias;
        light.shadow.normalBias = lightStart.normalBias;
        row.normalBias = String(lightStart.normalBias ?? AUTO);
      },
    };
  }

  const folders = {
    sun: addLightFolder(sun, 'sun'),
    spot: addLightFolder(spot, 'spot'),
  };

  /** Shows the folder of the light that's on */
  function showLightFolder() {
    folders.sun.folder.hidden = rows.light !== 'sun';
    folders.spot.folder.hidden = rows.light !== 'spot';
  }

  pane
    .addFolder({ title: 'logo' })
    .addBinding(rows, 'logoCastShadow', { label: 'castShadow' })
    .on('change', ({ value }) => options.setLogoCastShadow(value));
  pane
    .addFolder({ title: 'wall' })
    .addBinding(rows, 'wallReceiveShadow', { label: 'receiveShadow' })
    .on('change', ({ value }) => options.setWallReceiveShadow(value));

  const viewFolder = pane.addFolder({ title: 'view3d' });

  viewFolder.addBinding(view3d, 'shadowQuality', {
    options: { low: 'low', medium: 'medium', high: 'high', ultra: 'ultra' },
  });
  viewFolder.addBinding(view3d, 'shadowFilter', {
    options: { hard: 'hard', pcf: 'pcf', 'pcf-high': 'pcf-high' },
  });

  pane.addButton({ title: 'Reset' }).on('click', () => {
    rows.light = start.light;
    rows.logoCastShadow = start.logoCastShadow;
    rows.wallReceiveShadow = start.wallReceiveShadow;
    options.useLight(rows.light);
    options.setLogoCastShadow(rows.logoCastShadow);
    options.setWallReceiveShadow(rows.wallReceiveShadow);
    folders.sun.reset();
    folders.spot.reset();
    view3d.shadowQuality = start.quality;
    view3d.shadowFilter = start.filter;
    motion.moveLight = start.moveLight;
    showLightFolder();
    pane.refresh();
  });
  showLightFolder();
}
