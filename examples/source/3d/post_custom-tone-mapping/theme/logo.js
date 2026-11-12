/**
 * The PixiJS logo model, split into its five pieces, each on a pivot at its own centre
 *
 * Examples show off materials and effects on the logo rather than on spheres, so loading and splitting it lives
 * here once.
 */

import { Box, Container3D, Mesh3D, Model3D, Vector3 } from '@pixi/3d';
import { Assets } from 'pixi.js';

import { model } from '../manifest';
import { EnamelMaterial } from './EnamelMaterial';

export const LOGO_URL = model('pixijs.Logo');

/** The five pieces, left to right */
export const LOGO_PIECES = ['p', 'ixi', 'dotL', 'dotR', 'js'];

/** Each piece's node label in the model */
const PIECE_LABELS = {
  p: 'P • continuous curled ribbon',
  ixi: 'IXI • seamless unified body',
  dotL: 'i • left dot',
  dotR: 'i • right dot',
  js: 'JS • original SVG badge',
};

/** One logo piece wrapped in a pivot at its bounds centre, so it spins and squashes about itself */

/** Picks a material per mesh: return the same one for every piece, or one each */

let users = 0;

function collectMeshes(node, out) {
  if (node instanceof Mesh3D) out.push(node);
  for (const child of node.children) collectMeshes(child, out);
}

function halfExtents(size, scale) {
  return new Vector3(
    size.x * scale * 0.5,
    size.y * scale * 0.5,
    size.z * scale * 0.5,
  );
}

/**
 * Loads the PixiJS logo and splits it into five independently posable pieces
 *
 * Load it once per example; the model is shared, so several logos cost one download.
 */
export async function loadPixiLogo(options = {}) {
  const {
    width = 4,
    material = 'enamel',
    reflections,
    castShadow = true,
    receiveShadow = false,
  } = options;
  const source = await Assets.load(LOGO_URL);

  users++;

  const model = Model3D.from(source, { castShadow, receiveShadow });
  const bounds = model.getLocalBounds();
  const scale = width / Math.max(bounds.max.x - bounds.min.x, 1e-3);
  const centre = bounds.getCenter();
  const root = new Container3D({ label: 'pixiLogo' });
  const meshes = [];
  const enamel = {};
  const pieces = {};
  const release = () => {
    root.destroy({ children: true });
    for (const id of LOGO_PIECES) enamel[id]?.destroy();
    meshes.length = 0;
    // Unloading destroys the model's geometries and materials, which every logo shares.
    if (--users === 0) void Assets.unload(LOGO_URL);
  };

  for (const id of LOGO_PIECES) {
    const node = model.getChildByLabel(PIECE_LABELS[id], true);

    if (!(node instanceof Container3D)) {
      model.destroy({ children: true });
      release();
      throw new Error(
        `Logo piece '${PIECE_LABELS[id]}' is missing from ${LOGO_URL}`,
      );
    }

    const holder = new Container3D();

    holder.addChild(node);

    const box = holder.getLocalBounds(new Box());

    const pieceCentre = box.getCenter();
    const pivot = new Container3D({ label: id });
    const rest = new Vector3(
      (pieceCentre.x - centre.x) * scale,
      (pieceCentre.y - centre.y) * scale,
      (pieceCentre.z - centre.z) * scale,
    );
    const own = [];

    holder.scale.set(scale, scale, scale);
    holder.position.set(
      -pieceCentre.x * scale,
      -pieceCentre.y * scale,
      -pieceCentre.z * scale,
    );
    pivot.position.copyFrom(rest);
    pivot.addChild(holder);
    root.addChild(pivot);
    collectMeshes(node, own);
    meshes.push(...own);

    if (material === 'enamel') {
      const skin = new EnamelMaterial({ reflections });

      enamel[id] = skin;
      for (const mesh of own) mesh.material = skin;
    }

    pieces[id] = {
      id,
      pivot,
      rest,
      half: halfExtents(box.getSize(), scale),
      meshes: own,
    };
  }

  const half = halfExtents(bounds.getSize(), scale);

  // The pieces now hang off their own pivots; the emptied model shell goes.
  model.destroy();

  let destroyed = false;

  return {
    root,
    source,
    pieces,
    meshes,
    half,
    enamel,
    setMaterial: (skin) => {
      for (const id of LOGO_PIECES) {
        for (const mesh of pieces[id].meshes) {
          mesh.material = typeof skin === 'function' ? skin(id, mesh) : skin;
        }
      }
    },
    setShadows: (cast, receive) => {
      for (const mesh of meshes) {
        mesh.castShadow = cast;
        mesh.receiveShadow = receive;
      }
    },
    pointOn: (id, x, y, out) => {
      const piece = pieces[id];

      return out.set(
        piece.rest.x + x * piece.half.x,
        piece.rest.y + y * piece.half.y,
        piece.rest.z + piece.half.z,
      );
    },
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      release();
    },
  };
}
