import { Container3D, Model3D, Quaternion, Vector3 } from '@pixi/3d';

const ORIENT_DEG = { 0: 0, 10: 180, 16: 90, 22: 270 };

const CELL_RAW = 9.99;
const GRID_SCALE = 0.75;

const TRACK_CELLS = [
  [-3, -3, 'track-corner', 16],
  [-2, -3, 'track-straight', 22],
  [-1, -3, 'track-straight', 22],
  [0, -3, 'track-corner', 0],
  [-3, -2, 'track-straight', 0],
  [0, -2, 'track-straight', 0],
  [-3, -1, 'track-corner', 10],
  [-2, -1, 'track-corner', 0],
  [0, -1, 'track-straight', 0],
  [-2, 0, 'track-straight', 10],
  [0, 0, 'track-finish', 0],
  [-2, 1, 'track-straight', 10],
  [0, 1, 'track-straight', 0],
  [-2, 2, 'track-corner', 10],
  [-1, 2, 'track-straight', 16],
  [0, 2, 'track-corner', 22],
];

const DECO_CELLS = [
  [-4, -2, 'decoration-tents', 10],
  [-1, -4, 'decoration-tents', 22],
  [-1, 1, 'decoration-tents', 22],
  [-8, -9, 'decoration-forest', 0],
  [-7, -9, 'decoration-forest', 0],
  [-6, -9, 'decoration-forest', 0],
  [-5, -9, 'decoration-forest', 0],
  [-4, -9, 'decoration-forest', 0],
  [-3, -9, 'decoration-forest', 0],
  [-2, -9, 'decoration-forest', 0],
  [-1, -9, 'decoration-forest', 0],
  [0, -9, 'decoration-forest', 0],
  [1, -9, 'decoration-forest', 0],
  [2, -9, 'decoration-forest', 0],
  [-8, -8, 'decoration-forest', 0],
  [-7, -8, 'decoration-forest', 0],
  [-6, -8, 'decoration-forest', 0],
  [-5, -8, 'decoration-forest', 0],
  [-4, -8, 'decoration-forest', 0],
  [-3, -8, 'decoration-forest', 0],
  [-2, -8, 'decoration-forest', 0],
  [-1, -8, 'decoration-forest', 0],
  [0, -8, 'decoration-forest', 0],
  [1, -8, 'decoration-forest', 0],
  [2, -8, 'decoration-forest', 0],
  [-8, -7, 'decoration-forest', 0],
  [-7, -7, 'decoration-forest', 0],
  [-6, -7, 'decoration-forest', 0],
  [-5, -7, 'decoration-forest', 0],
  [-4, -7, 'decoration-forest', 0],
  [-3, -7, 'decoration-forest', 0],
  [-2, -7, 'decoration-forest', 0],
  [-1, -7, 'decoration-forest', 0],
  [0, -7, 'decoration-forest', 0],
  [1, -7, 'decoration-forest', 0],
  [2, -7, 'decoration-forest', 0],
  [-8, -6, 'decoration-forest', 0],
  [-7, -6, 'decoration-forest', 0],
  [-6, -6, 'decoration-forest', 0],
  [-5, -6, 'decoration-forest', 0],
  [-4, -6, 'decoration-forest', 0],
  [-3, -6, 'decoration-empty', 0],
  [-2, -6, 'decoration-empty', 0],
  [-1, -6, 'decoration-empty', 0],
  [0, -6, 'decoration-empty', 0],
  [1, -6, 'decoration-forest', 0],
  [2, -6, 'decoration-forest', 0],
  [-8, -5, 'decoration-forest', 0],
  [-7, -5, 'decoration-forest', 0],
  [-6, -5, 'decoration-forest', 0],
  [-5, -5, 'decoration-forest', 0],
  [-4, -5, 'decoration-empty', 0],
  [-3, -5, 'decoration-empty', 0],
  [-2, -5, 'decoration-empty', 0],
  [-1, -5, 'decoration-empty', 0],
  [0, -5, 'decoration-empty', 0],
  [1, -5, 'decoration-forest', 0],
  [2, -5, 'decoration-forest', 0],
  [-8, -4, 'decoration-forest', 0],
  [-7, -4, 'decoration-forest', 0],
  [-6, -4, 'decoration-forest', 0],
  [-5, -4, 'decoration-forest', 0],
  [-4, -4, 'decoration-empty', 0],
  [1, -4, 'decoration-forest', 0],
  [2, -4, 'decoration-forest', 0],
  [-8, -3, 'decoration-forest', 0],
  [-7, -3, 'decoration-forest', 0],
  [-6, -3, 'decoration-forest', 0],
  [-5, -3, 'decoration-forest', 0],
  [-4, -3, 'decoration-empty', 0],
  [1, -3, 'decoration-forest', 0],
  [2, -3, 'decoration-forest', 0],
  [-8, -2, 'decoration-forest', 0],
  [-7, -2, 'decoration-forest', 0],
  [-6, -2, 'decoration-forest', 0],
  [-5, -2, 'decoration-forest', 0],
  [1, -2, 'decoration-forest', 0],
  [2, -2, 'decoration-forest', 0],
  [-8, -1, 'decoration-forest', 0],
  [-7, -1, 'decoration-forest', 0],
  [-6, -1, 'decoration-forest', 0],
  [-5, -1, 'decoration-forest', 0],
  [-4, -1, 'decoration-empty', 0],
  [-1, -1, 'decoration-empty', 0],
  [1, -1, 'decoration-forest', 0],
  [2, -1, 'decoration-forest', 0],
  [-8, 0, 'decoration-forest', 0],
  [-7, 0, 'decoration-forest', 0],
  [-6, 0, 'decoration-forest', 0],
  [-5, 0, 'decoration-forest', 0],
  [-4, 0, 'decoration-empty', 0],
  [-3, 0, 'decoration-empty', 0],
  [-1, 0, 'decoration-empty', 0],
  [1, 0, 'decoration-forest', 0],
  [2, 0, 'decoration-forest', 0],
  [-8, 1, 'decoration-forest', 0],
  [-7, 1, 'decoration-forest', 0],
  [-6, 1, 'decoration-forest', 0],
  [-5, 1, 'decoration-forest', 0],
  [-4, 1, 'decoration-empty', 0],
  [-3, 1, 'decoration-empty', 0],
  [1, 1, 'decoration-forest', 0],
  [2, 1, 'decoration-forest', 0],
  [-8, 2, 'decoration-forest', 0],
  [-7, 2, 'decoration-forest', 0],
  [-6, 2, 'decoration-forest', 0],
  [-5, 2, 'decoration-forest', 0],
  [-4, 2, 'decoration-empty', 0],
  [-3, 2, 'decoration-empty', 0],
  [1, 2, 'decoration-forest', 0],
  [2, 2, 'decoration-forest', 0],
  [-8, 3, 'decoration-forest', 0],
  [-7, 3, 'decoration-forest', 0],
  [-6, 3, 'decoration-forest', 0],
  [-5, 3, 'decoration-forest', 0],
  [-4, 3, 'decoration-forest', 0],
  [-3, 3, 'decoration-forest', 0],
  [-2, 3, 'decoration-forest', 0],
  [-1, 3, 'decoration-forest', 0],
  [0, 3, 'decoration-forest', 0],
  [1, 3, 'decoration-forest', 0],
  [2, 3, 'decoration-forest', 0],
  [-8, 4, 'decoration-forest', 0],
  [-7, 4, 'decoration-forest', 0],
  [-6, 4, 'decoration-forest', 0],
  [-5, 4, 'decoration-forest', 0],
  [-4, 4, 'decoration-forest', 0],
  [-3, 4, 'decoration-forest', 0],
  [-2, 4, 'decoration-forest', 0],
  [-1, 4, 'decoration-forest', 0],
  [0, 4, 'decoration-forest', 0],
  [1, 4, 'decoration-forest', 0],
  [2, 4, 'decoration-forest', 0],
];

const NPC_TRUCKS = [
  { key: 'vehicle-truck-green', x: -3.51, y: -0.01, z: 12.7, rotDeg: 98.0 },
  { key: 'vehicle-truck-purple', x: -23.78, y: -0.14, z: -13.56, rotDeg: 0.0 },
  { key: 'vehicle-truck-red', x: -1.36, y: -0.15, z: -23.8, rotDeg: 155.9 },
];

function pieceWorldPosition(gx, gz) {
  return {
    x: (gx + 0.5) * CELL_RAW * GRID_SCALE,
    z: (gz + 0.5) * CELL_RAW * GRID_SCALE,
  };
}

const _q = new Quaternion();
const _yAxis = new Vector3(0, 1, 0);

function placeModel(source, parent, x, y, z, yawRad) {
  const root = new Model3D(source);

  root.position.set(x, y, z);
  _q.setFromAxisAngle(_yAxis, yawRad);
  root.quaternion.copyFrom(_q);
  parent.addChild(root);

  return root;
}

export function buildTrack(parent, sources) {
  const trackGroup = new Container3D();

  trackGroup.scale.set(GRID_SCALE, GRID_SCALE, GRID_SCALE);
  trackGroup.position.set(0, -0.5, 0);
  parent.addChild(trackGroup);

  for (const [gx, gz, key, orient] of TRACK_CELLS) {
    const source = sources[key];

    if (!source) continue;

    const px = (gx + 0.5) * CELL_RAW;
    const pz = (gz + 0.5) * CELL_RAW;
    const yaw = ((ORIENT_DEG[orient] ?? 0) * Math.PI) / 180;

    placeModel(source, trackGroup, px, 0.5, pz, yaw);
  }

  // Decorations
  const occupied = new Set();
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  for (const [gx, gz] of TRACK_CELLS) {
    occupied.add(`${gx},${gz}`);
    if (gx < minX) minX = gx;
    if (gx > maxX) maxX = gx;
    if (gz < minZ) minZ = gz;
    if (gz > maxZ) maxZ = gz;
  }

  for (const [gx, gz, key, orient] of DECO_CELLS) {
    occupied.add(`${gx},${gz}`);
    if (gx < minX) minX = gx;
    if (gx > maxX) maxX = gx;
    if (gz < minZ) minZ = gz;
    if (gz > maxZ) maxZ = gz;

    const source = sources[key];

    if (!source) continue;

    const px = (gx + 0.5) * CELL_RAW;
    const pz = (gz + 0.5) * CELL_RAW;
    const yaw = ((ORIENT_DEG[orient] ?? 0) * Math.PI) / 180;

    placeModel(source, trackGroup, px, 0.5, pz, yaw);
  }

  const pad = 3;

  for (let gz = minZ - pad; gz <= maxZ + pad; gz++) {
    for (let gx = minX - pad; gx <= maxX + pad; gx++) {
      if (occupied.has(`${gx},${gz}`)) continue;

      const distX = gx < minX ? minX - gx : gx > maxX ? gx - maxX : 0;
      const distZ = gz < minZ ? minZ - gz : gz > maxZ ? gz - maxZ : 0;
      const dist = Math.max(distX, distZ);

      const px = (gx + 0.5) * CELL_RAW;
      const pz = (gz + 0.5) * CELL_RAW;

      let key = 'decoration-forest';
      let yawQuarters = 0;

      if (dist <= 1) {
        const h = pseudoHash(gx, gz);

        if (h % 7 === 0) {
          key = 'decoration-tents';
          yawQuarters = h % 4;
        } else {
          key = 'decoration-empty';
        }
      }

      const source = sources[key];

      if (!source) continue;

      placeModel(source, trackGroup, px, 0.5, pz, (yawQuarters * Math.PI) / 2);
    }
  }

  // Parked trucks go in `parent`, outside the scaled track group
  for (const npc of NPC_TRUCKS) {
    const source = sources[npc.key];

    if (!source) continue;

    const npcRoot = placeModel(
      source,
      parent,
      npc.x,
      npc.y,
      npc.z,
      ((npc.rotDeg + 180) * Math.PI) / 180,
    );

    npcRoot.scale.set(0.5, 0.5, 0.5);
  }

  // Walls
  const walls = buildWallColliders();

  // Finish line frame for lap detection (matches `track-finish` cell at gx=0, gz=0)
  const finishCell = TRACK_CELLS.find(([, , key]) => key === 'track-finish');
  const finishOrient = finishCell[3];
  const finishYaw = ((ORIENT_DEG[finishOrient] ?? 0) * Math.PI) / 180;
  const finishWorld = pieceWorldPosition(finishCell[0], finishCell[1]);
  const finishCenter = new Vector3(finishWorld.x, 0, finishWorld.z);
  const finishForward = new Vector3(
    Math.sin(finishYaw),
    0,
    Math.cos(finishYaw),
  );
  const finishRight = new Vector3(finishForward.z, 0, -finishForward.x);

  const requiredCellKeys = new Set();

  for (const [gx, gz, key] of TRACK_CELLS) {
    if (key !== 'track-finish') requiredCellKeys.add(`${gx},${gz}`);
  }

  return {
    walls,
    finishCenter,
    finishForward,
    finishRight,
    requiredCellKeys,
    cellSize: CELL_RAW * GRID_SCALE,
  };
}

function pseudoHash(gx, gz) {
  let h = gx * 374761393 + gz * 668265263;

  h = (h ^ (h >> 13)) * 1274126177;

  return (h ^ (h >> 16)) >>> 0;
}

function buildWallColliders() {
  const S = GRID_SCALE;
  const CELL_HALF = CELL_RAW / 2;
  const WALL_HALF_THICK = 0.25;
  const WALL_X = 4.75;
  const WALL_HALF_H = 1.5;

  const wallY = (0.5 + WALL_HALF_H) * S - 0.5;
  const hThick = WALL_HALF_THICK * S;
  const hHeight = WALL_HALF_H * S;
  const hLen = CELL_HALF * S;

  const ARC_SPAN = -Math.PI / 2;
  const ARC_CENTER_X = -CELL_HALF;
  const ARC_CENTER_Z = CELL_HALF;
  const OUTER_R = 2 * CELL_HALF - WALL_HALF_THICK;
  const OUTER_SEG = 8;
  const OUTER_SEG_HALF_LEN = ((OUTER_R * (Math.PI / 2)) / OUTER_SEG / 2) * S;
  const INNER_R = WALL_HALF_THICK;
  const INNER_SEG = 3;
  const INNER_SEG_HALF_LEN = ((INNER_R * (Math.PI / 2)) / INNER_SEG / 2) * S;

  const walls = [];

  for (const [gx, gz, key, orient] of TRACK_CELLS) {
    if (key === 'track-bump') continue;

    const cx = (gx + 0.5) * CELL_RAW * S;
    const cz = (gz + 0.5) * CELL_RAW * S;
    const deg = ORIENT_DEG[orient] ?? 0;
    const rad = (deg * Math.PI) / 180;
    const cr = Math.cos(rad);
    const sr = Math.sin(rad);

    if (key === 'track-straight' || key === 'track-finish') {
      for (const side of [-1, 1]) {
        const lx = side * WALL_X;
        const wx = cx + lx * cr * S;
        const wz = cz + -lx * sr * S;

        walls.push({
          halfExtents: [hThick, hHeight, hLen],
          position: [wx, wallY, wz],
          quaternion: [0, Math.sin(rad / 2), 0, Math.cos(rad / 2)],
        });
      }
    } else if (key === 'track-corner') {
      const wcx = cx + (ARC_CENTER_X * cr + ARC_CENTER_Z * sr) * S;
      const wcz = cz + (-ARC_CENTER_X * sr + ARC_CENTER_Z * cr) * S;
      const arcStart = -rad;

      addArcWalls(
        walls,
        wcx,
        wcz,
        arcStart,
        OUTER_R,
        OUTER_SEG,
        OUTER_SEG_HALF_LEN,
        hThick,
        hHeight,
        ARC_SPAN,
        S,
      );
      addArcWalls(
        walls,
        wcx,
        wcz,
        arcStart,
        INNER_R,
        INNER_SEG,
        INNER_SEG_HALF_LEN,
        hThick,
        hHeight,
        ARC_SPAN,
        S,
      );
    }
  }

  return walls;
}

function addArcWalls(
  walls,
  wcx,
  wcz,
  arcStart,
  radius,
  numSeg,
  segHalfLen,
  hThick,
  hHeight,
  arcSpan,
  scale,
) {
  for (let i = 0; i < numSeg; i++) {
    const aMid = arcStart + ((i + 0.5) / numSeg) * arcSpan;
    const wx = wcx + radius * Math.cos(aMid) * scale;
    const wz = wcz + radius * Math.sin(aMid) * scale;
    const wallY = (0.5 + 1.5) * scale - 0.5;
    const halfAng = -aMid / 2;

    walls.push({
      halfExtents: [hThick, hHeight, segHalfLen],
      position: [wx, wallY, wz],
      quaternion: [0, Math.sin(halfAng), 0, Math.cos(halfAng)],
    });
  }
}
