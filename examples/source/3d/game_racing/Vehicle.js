import { Container3D, Model3D, Quaternion, Vector3 } from '@pixi/3d';
import { rigidBody } from 'crashcat';

import { clamp, lerp } from './MathUtils';

const LINEAR_DAMP = 0.1;
export const MAX_SPEED = 1.5;

const SPAWN = [3.5, 0.5, 5];

const _forward = new Vector3();
const _up = new Vector3(0, 1, 0);
const _xAxis = new Vector3(1, 0, 0);
const _zAxis = new Vector3(0, 0, 1);
const _q = new Quaternion();
const _qSteer = new Quaternion();
const _qSpin = new Quaternion();
const _qPitch = new Quaternion();
const _qRoll = new Quaternion();
const _qBodyTmp = new Quaternion();

function lerpAngle(a, b, t) {
  let diff = b - a;

  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;

  return a + diff * t;
}

export class Vehicle {
  container;

  bodyNode = null;
  wheels = [];
  wheelFL = null;
  wheelFR = null;
  wheelBL = null;
  wheelBR = null;

  _wheelSpinAngle = [0, 0, 0, 0];
  _wheelSteerAngle = { fl: 0, fr: 0 };
  _bodyPitch = 0;
  _bodyRoll = 0;
  _bodyInitQuat = new Quaternion();

  linearSpeed = 0;
  angularSpeed = 0;
  acceleration = 0;
  yaw = 0;

  spherePos = new Vector3(SPAWN[0], SPAWN[1], SPAWN[2]);
  sphereVel = new Vector3();
  modelVelocity = new Vector3();
  _prevModelPos = new Vector3();

  inputX = 0;
  inputZ = 0;
  driftIntensity = 0;

  physics;

  constructor(source, physics) {
    this.physics = physics;

    this.container = new Container3D();

    const root = new Model3D(source);

    root.scale.set(0.5, 0.5, 0.5);
    this.container.addChild(root);

    this.bodyNode = root.getChildByLabel('body', true);

    if (this.bodyNode) this.bodyNode.quaternion.copyTo(this._bodyInitQuat);

    const wheelFL = root.getChildByLabel('wheel-front-left', true);
    const wheelFR = root.getChildByLabel('wheel-front-right', true);
    const wheelBL = root.getChildByLabel('wheel-back-left', true);
    const wheelBR = root.getChildByLabel('wheel-back-right', true);

    this.wheelFL = wheelFL;
    this.wheelFR = wheelFR;
    this.wheelBL = wheelBL;
    this.wheelBR = wheelBR;

    if (wheelFL) this.wheels.push(wheelFL);
    if (wheelFR) this.wheels.push(wheelFR);
    if (wheelBL) this.wheels.push(wheelBL);
    if (wheelBR) this.wheels.push(wheelBR);

    this.container.position.set(SPAWN[0], SPAWN[1] - 0.5, SPAWN[2]);
    this._prevModelPos.set(SPAWN[0], 0, SPAWN[2]);
  }

  update(dt, input) {
    this.inputX = input.x;
    this.inputZ = input.z;

    if (input.touchActive && (this.inputX !== 0 || this.inputZ !== 0)) {
      const targetAngle = Math.atan2(this.inputX, this.inputZ);
      const slerpT = 1 - Math.exp(-3 * dt);

      this.yaw = lerpAngle(this.yaw, targetAngle, slerpT);

      _forward.set(Math.sin(this.yaw), 0, Math.cos(this.yaw));
      const cross = _forward.x * this.inputZ - _forward.z * this.inputX;

      this.inputX = clamp(-cross * 2, -1, 1);
      this.linearSpeed = lerp(this.linearSpeed, MAX_SPEED, dt * 1.5);
    } else {
      let direction = Math.sign(this.linearSpeed);

      if (direction === 0)
        direction = Math.abs(this.inputZ) > 0.1 ? Math.sign(this.inputZ) : 1;

      const steeringGrip = clamp(Math.abs(this.linearSpeed), 0.2, 1.0);
      const targetAngular = -this.inputX * steeringGrip * 4 * direction;

      this.angularSpeed = lerp(this.angularSpeed, targetAngular, dt * 4);
      this.yaw += this.angularSpeed * dt;

      const targetSpeed = this.inputZ;

      if (targetSpeed < 0 && this.linearSpeed > 0.01) {
        this.linearSpeed = lerp(this.linearSpeed, 0, dt * 8);
      } else if (targetSpeed < 0) {
        this.linearSpeed = lerp(this.linearSpeed, targetSpeed / 2, dt * 2);
      } else {
        this.linearSpeed = lerp(
          this.linearSpeed,
          targetSpeed * MAX_SPEED,
          dt * 1.5,
        );
      }
    }

    this.linearSpeed *= Math.max(0, 1 - LINEAR_DAMP * dt);

    // Drive: spin the rolling sphere about the truck's right vector (world X
    // turned by yaw), as the three.js port does.
    const rightX = Math.cos(this.yaw);
    const rightZ = -Math.sin(this.yaw);
    const drive = this.linearSpeed * 100 * dt;
    const body = this.physics.sphereBody;
    const angvel = body.motionProperties.angularVelocity;

    rigidBody.setAngularVelocity(this.physics.world, body, [
      angvel[0] + rightX * drive,
      angvel[1],
      angvel[2] + rightZ * drive,
    ]);

    this.spherePos.set(body.position[0], body.position[1], body.position[2]);

    const linvel = body.motionProperties.linearVelocity;

    this.sphereVel.set(linvel[0], linvel[1], linvel[2]);

    this.acceleration = lerp(
      this.acceleration,
      this.linearSpeed + 0.25 * this.linearSpeed * Math.abs(this.linearSpeed),
      dt,
    );

    if (this.spherePos.y < -10) {
      rigidBody.setPosition(this.physics.world, body, SPAWN, false);
      rigidBody.setLinearVelocity(this.physics.world, body, [0, 0, 0]);
      rigidBody.setAngularVelocity(this.physics.world, body, [0, 0, 0]);
      this.spherePos.set(SPAWN[0], SPAWN[1], SPAWN[2]);
      this.sphereVel.set(0, 0, 0);
      this.linearSpeed = 0;
      this.angularSpeed = 0;
      this.acceleration = 0;
      this.yaw = 0;
    }

    this.container.position.set(
      this.spherePos.x,
      this.spherePos.y - 0.5,
      this.spherePos.z,
    );

    _q.setFromAxisAngle(_up, this.yaw);
    this.container.quaternion.copyFrom(_q);

    if (dt > 0) {
      this.modelVelocity.set(
        (this.container.position.x - this._prevModelPos.x) / dt,
        (this.container.position.y - this._prevModelPos.y) / dt,
        (this.container.position.z - this._prevModelPos.z) / dt,
      );
      this._prevModelPos.set(
        this.container.position.x,
        this.container.position.y,
        this.container.position.z,
      );
    }

    this._updateBody(dt);
    this._updateWheels(dt);

    this.driftIntensity =
      Math.abs(this.linearSpeed - this.acceleration) +
      Math.abs(this._bodyRoll) * 2;
  }

  _updateBody(dt) {
    if (!this.bodyNode) return;

    this._bodyPitch = lerpAngle(
      this._bodyPitch,
      -(this.linearSpeed - this.acceleration) / 6,
      dt * 10,
    );
    this._bodyRoll = lerpAngle(
      this._bodyRoll,
      -(this.inputX / 5) * this.linearSpeed,
      dt * 5,
    );

    _qPitch.setFromAxisAngle(_xAxis, this._bodyPitch);
    _qRoll.setFromAxisAngle(_zAxis, this._bodyRoll);
    _qBodyTmp.copyFrom(this._bodyInitQuat).multiply(_qPitch).multiply(_qRoll);
    this.bodyNode.quaternion.copyFrom(_qBodyTmp);

    this.bodyNode.position.y = lerp(this.bodyNode.position.y, 0.3, dt * 5);
  }

  _updateWheels(dt) {
    for (let i = 0; i < this.wheels.length; i++) {
      this._wheelSpinAngle[i] += this.acceleration;
    }

    const targetSteer = -this.inputX / 1.5;

    if (this.wheelFL) {
      this._wheelSteerAngle.fl = lerpAngle(
        this._wheelSteerAngle.fl,
        targetSteer,
        dt * 10,
      );
      this._applyWheelTransform(
        this.wheelFL,
        this._wheelSpinAngle[0],
        this._wheelSteerAngle.fl,
      );
    }
    if (this.wheelFR) {
      this._wheelSteerAngle.fr = lerpAngle(
        this._wheelSteerAngle.fr,
        targetSteer,
        dt * 10,
      );
      this._applyWheelTransform(
        this.wheelFR,
        this._wheelSpinAngle[1],
        this._wheelSteerAngle.fr,
      );
    }
    if (this.wheelBL) {
      this._applyWheelTransform(this.wheelBL, this._wheelSpinAngle[2], 0);
    }
    if (this.wheelBR) {
      this._applyWheelTransform(this.wheelBR, this._wheelSpinAngle[3], 0);
    }
  }

  _applyWheelTransform(wheel, spin, steer) {
    _qSteer.setFromAxisAngle(_up, steer);
    _qSpin.setFromAxisAngle(_xAxis, spin);
    _qSteer.multiply(_qSpin);
    wheel.quaternion.copyFrom(_qSteer);
  }
}
