import { Vector3 } from '@pixi/3d';
import { ConeShape, ParticleSystem3D } from '@pixi/3d/extras';

// Sizes are matched to the racer this demo was ported from, whose point
// sprites had a pixel size decoupled from the field of view. PixiJS 3D particles
// are world-space diameters, so the base size is tan(fov/2) at the racing
// camera's 40°: the same pixel footprint, with proper FOV behaviour on top.
const BASE_SIZE = Math.tan((40 * Math.PI) / 180 / 2); // ≈ 0.364

const EMIT_THRESHOLD = 0.7;
const PER_WHEEL = 3;
const Y_OFFSET = 0.05;

const _wheelPos = new Vector3();

/**
 * Drift smoke. One {@link ParticleSystem3D} shared by both rear wheels — a
 * single draw call and a single streaming buffer — with the puffs left behind
 * in world space as the car drives away from them.
 *
 * Emission is manual: the car only smokes while it's actually sliding, so
 * `emitRate` stays at 0 and the drift check spawns at each wheel instead. The
 * cone shape supplies the scatter around the given point.
 */
export class SmokeTrails {
  _system;

  constructor(parent, smokeTexture) {
    this._system = new ParticleSystem3D({
      texture: smokeTexture,
      capacity: 1280,
      // Driven from the game's own loop, alongside the physics step.
      autoUpdate: false,
      emitRate: 0,
      shape: new ConeShape({ angle: 25, radius: 0.09 }),
      life: 2.5,
      speed: [0.5, 1],
      size: [BASE_SIZE * 0.25, BASE_SIZE * 0.5],
      sizeEnd: [BASE_SIZE * 1.5, BASE_SIZE * 3],
      alpha: 0.25,
      alphaEnd: 0,
      // Light, slightly cool grey — reads as smog dust against the racing
      // scene's warm-grey background.
      color: 0xb8bcc4,
      drag: 1,
    });

    parent.addChild(this._system);
  }

  update(ticker, vehicle) {
    if (vehicle.driftIntensity > EMIT_THRESHOLD) {
      const groundY = vehicle.container.position.y + Y_OFFSET;

      for (const wheel of [vehicle.wheelBL, vehicle.wheelBR]) {
        if (!wheel) continue;

        wheel.worldTransform.extractPosition(_wheelPos);
        _wheelPos.y = groundY;

        this._system.spawn(PER_WHEEL, { position: _wheelPos });
      }
    }

    this._system.update(ticker);
  }
}
