/**
 * The pane: the shape list, one folder of options per class (only the selected class's shows), the wireframe switch,
 * what the shape costs to draw, and a reset
 */

import { optionsOf, perShape, SHAPES } from './scene';

/** The ranges that teach: each class's real minimums for counts, and sizes that keep the hero in its spot */
const ROWS = {
  PlaneGeometry: {
    width: { min: 0.2, max: 2.6 },
    height: { min: 0.2, max: 2.6 },
    widthSegments: { min: 1, max: 16, step: 1 },
    heightSegments: { min: 1, max: 16, step: 1 },
  },
  CubeGeometry: {
    width: { min: 0.2, max: 2.2 },
    height: { min: 0.2, max: 2.2 },
    depth: { min: 0.2, max: 2.2 },
    widthSegments: { min: 1, max: 8, step: 1 },
    heightSegments: { min: 1, max: 8, step: 1 },
    depthSegments: { min: 1, max: 8, step: 1 },
  },
  SphereGeometry: {
    radius: { min: 0.1, max: 1.25 },
    widthSegments: { min: 3, max: 64, step: 1 },
    heightSegments: { min: 2, max: 32, step: 1 },
  },
  // The engine allows a detail of 7, 163 842 vertices; 5 is already 20 480 triangles.
  IcosahedronGeometry: {
    radius: { min: 0.1, max: 1.25 },
    detail: { min: 0, max: 5, step: 1 },
  },
  CapsuleGeometry: {
    radius: { min: 0.05, max: 0.9 },
    height: { min: 0.1, max: 2.6 },
    radialSegments: { min: 3, max: 64, step: 1 },
    heightSegments: { min: 1, max: 16, step: 1 },
  },
  // Both radii at 0 leave no triangles, and a height of 0 divides by zero in the side's slope.
  CylinderGeometry: {
    radiusTop: { min: 0, max: 1.1 },
    radiusBottom: { min: 0.05, max: 1.1 },
    height: { min: 0.1, max: 2.6 },
    radialSegments: { min: 3, max: 64, step: 1 },
    heightSegments: { min: 1, max: 16, step: 1 },
  },
  ConeGeometry: {
    radius: { min: 0.05, max: 1.1 },
    height: { min: 0.1, max: 2.6 },
    radialSegments: { min: 3, max: 64, step: 1 },
    heightSegments: { min: 1, max: 16, step: 1 },
  },
  TorusGeometry: {
    radius: { min: 0.1, max: 1 },
    tube: { min: 0.02, max: 0.5 },
    radialSegments: { min: 3, max: 32, step: 1 },
    tubularSegments: { min: 3, max: 96, step: 1 },
    arc: { min: 0.05, max: Math.PI * 2, step: 0.01 },
    thetaStart: { min: 0, max: Math.PI * 2, step: 0.01 },
    thetaLength: { min: 0.05, max: Math.PI * 2, step: 0.01 },
  },
  // A `p` of 0 divides by zero. A `p` and `q` that share a factor trace a simpler knot that many times over itself,
  // which the pane allows: `p: 2, q: 4` draws the `p: 1, q: 2` knot twice.
  TorusKnotGeometry: {
    radius: { min: 0.2, max: 0.7 },
    tube: { min: 0.02, max: 0.3 },
    tubularSegments: { min: 3, max: 256, step: 1 },
    radialSegments: { min: 3, max: 16, step: 1 },
    p: { min: 1, max: 8, step: 1 },
    q: { min: 1, max: 8, step: 1 },
  },
};
/** The value column in px: narrower than Tweakpane's 160 so `tubularSegments` fits, wide enough for class names */
const VALUE_WIDTH = 146;
const COUNT = { readonly: true, format: (count) => count.toFixed(0) };

export function createControls({
  pane,
  options,
  state,
  counts,
  select,
  rebuild,
}) {
  // Reset puts a class back to these.
  const starts = perShape((shape) => ({ ...optionsOf(options, shape) }));
  // Tweakpane fires a row's change handler when a refresh shows a new value, so Reset's own writes are fenced off.
  let resetting = false;

  pane
    .addBinding(state, 'shape', {
      label: 'Shape',
      options: Object.fromEntries(SHAPES.map((s) => [s, s])),
    })
    .on('change', ({ value }) => {
      select(value);
      showFolder();
    });

  const folders = perShape((shape) => {
    const folder = pane.addFolder({ title: shape });
    const values = optionsOf(options, shape);

    for (const key in values) {
      folder.addBinding(values, key, ROWS[shape][key]).on('change', () => {
        if (!resetting) rebuild();
      });
    }

    return folder;
  });

  // Tweakpane's own theming variable, read once at the pane's root.
  pane.element.style.setProperty('--tp-blade-value-width', `${VALUE_WIDTH}px`);

  pane.addBinding(state, 'wireframe', { label: 'Wireframe' });
  pane.addBinding(counts, 'vertices', { label: 'Vertices', ...COUNT });
  pane.addBinding(counts, 'triangles', { label: 'Triangles', ...COUNT });

  pane.addButton({ title: 'Reset' }).on('click', () => {
    Object.assign(optionsOf(options, state.shape), starts[state.shape]);
    resetting = true;
    folders[state.shape].refresh();
    resetting = false;
    rebuild();
  });

  function showFolder() {
    for (const shape of SHAPES) folders[shape].hidden = shape !== state.shape;
  }

  showFolder();
}
