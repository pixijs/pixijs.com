import {
  addBroadphaseLayer,
  addObjectLayer,
  box,
  createWorld,
  createWorldSettings,
  enableCollision,
  MotionQuality,
  MotionType,
  registerAll,
  rigidBody,
  sphere,
  updateWorld,
} from 'crashcat';

let _registered = false;

export class PhysicsWorld {
  world;
  sphereBody;
  OL_STATIC;
  listener = undefined;

  constructor(spawn) {
    if (!_registered) {
      registerAll();
      _registered = true;
    }

    const settings = createWorldSettings();

    settings.gravity = [0, -9.81, 0];

    const BPL_MOVING = addBroadphaseLayer(settings);
    const BPL_STATIC = addBroadphaseLayer(settings);
    const OL_MOVING = addObjectLayer(settings, BPL_MOVING);
    const OL_STATIC = addObjectLayer(settings, BPL_STATIC);

    enableCollision(settings, OL_MOVING, OL_STATIC);
    enableCollision(settings, OL_MOVING, OL_MOVING);

    this.world = createWorld(settings);
    this.OL_STATIC = OL_STATIC;

    this.sphereBody = rigidBody.create(this.world, {
      shape: sphere.create({ radius: 0.5 }),
      motionType: MotionType.DYNAMIC,
      objectLayer: OL_MOVING,
      position: [spawn.x, spawn.y, spawn.z],
      mass: 1000.0,
      friction: 5.0,
      restitution: 0.1,
      linearDamping: 0.1,
      angularDamping: 4.0,
      gravityFactor: 1.5,
      motionQuality: MotionQuality.LINEAR_CAST,
    });
  }

  addStaticGround(position, halfExtents) {
    rigidBody.create(this.world, {
      shape: box.create({ halfExtents }),
      motionType: MotionType.STATIC,
      objectLayer: this.OL_STATIC,
      position,
      friction: 5.0,
      restitution: 0.0,
    });
  }

  addStaticBox(spec) {
    rigidBody.create(this.world, {
      shape: box.create({ halfExtents: spec.halfExtents }),
      motionType: MotionType.STATIC,
      objectLayer: this.OL_STATIC,
      position: spec.position,
      quaternion: spec.quaternion,
      friction: 0.0,
      restitution: 0.1,
    });
  }

  step(dt) {
    updateWorld(this.world, this.listener, dt);
  }
}
