import { Vector3 } from '@pixi/3d';

const _desired = new Vector3();
const _delta = new Vector3();
const _lookPoint = new Vector3();

export class FollowCamera {
  camera;

  offset = new Vector3(9.27, 9.18, 9.27);

  camRightXZ = new Vector3();
  camForwardXZ = new Vector3();

  leadFactor = 3.0;
  cameraSmoothing = 2.0;
  deadzoneRadius = 5.0;
  screenShiftUp = 1.0;

  _smoothedDesired = new Vector3();
  _initialized = false;

  constructor(camera) {
    this.camera = camera;
    this.camera.fov = 40;
    this.camera.near = 0.1;
    this.camera.far = 200;

    this.camera.position.copyFrom(this.offset);

    this.camRightXZ.set(this.offset.z, 0, -this.offset.x).normalize();
    this.camForwardXZ.set(-this.offset.x, 0, -this.offset.z).normalize();
  }

  update(dt, target, velocity) {
    const radius = this.deadzoneRadius;
    const radiusSq = radius * radius;

    let leadX =
      (velocity.x * this.camRightXZ.x +
        velocity.y * this.camRightXZ.y +
        velocity.z * this.camRightXZ.z) *
      this.leadFactor;
    let leadY =
      (velocity.x * this.camForwardXZ.x +
        velocity.y * this.camForwardXZ.y +
        velocity.z * this.camForwardXZ.z) *
      this.leadFactor;

    const leadLenSq = leadX * leadX + leadY * leadY;

    if (leadLenSq > radiusSq) {
      const k = radius / Math.sqrt(leadLenSq);

      leadX *= k;
      leadY *= k;
    }

    _desired
      .copyFrom(target)
      .addScaledVector(this.camRightXZ, leadX)
      .addScaledVector(this.camForwardXZ, leadY);

    const alpha = this._initialized
      ? 1 - Math.exp(-dt * this.cameraSmoothing)
      : 1;
    const inv = 1 - alpha;

    this._smoothedDesired.x =
      this._smoothedDesired.x * inv + _desired.x * alpha;
    this._smoothedDesired.y =
      this._smoothedDesired.y * inv + _desired.y * alpha;
    this._smoothedDesired.z =
      this._smoothedDesired.z * inv + _desired.z * alpha;
    this._initialized = true;

    _delta.set(
      target.x - this._smoothedDesired.x,
      target.y - this._smoothedDesired.y,
      target.z - this._smoothedDesired.z,
    );

    const offsetX =
      _delta.x * this.camRightXZ.x +
      _delta.y * this.camRightXZ.y +
      _delta.z * this.camRightXZ.z;
    const offsetY =
      _delta.x * this.camForwardXZ.x +
      _delta.y * this.camForwardXZ.y +
      _delta.z * this.camForwardXZ.z;
    const offsetLenSq = offsetX * offsetX + offsetY * offsetY;

    if (offsetLenSq > radiusSq) {
      const offsetLen = Math.sqrt(offsetLenSq);
      const k = (offsetLen - radius) / offsetLen;

      this._smoothedDesired.addScaledVector(this.camRightXZ, offsetX * k);
      this._smoothedDesired.addScaledVector(this.camForwardXZ, offsetY * k);
    }

    _lookPoint
      .copyFrom(this._smoothedDesired)
      .addScaledVector(this.camForwardXZ, -this.screenShiftUp);

    this.camera.position.set(
      _lookPoint.x + this.offset.x,
      _lookPoint.y + this.offset.y,
      _lookPoint.z + this.offset.z,
    );
    this.camera.lookAt(_lookPoint);
  }
}
