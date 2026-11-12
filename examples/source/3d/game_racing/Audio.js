import { sound } from './manifest';
import { clamp, lerp } from './MathUtils';

const NUM_GEARS = 3;
const UPSHIFT_RPM = 0.92;
const DOWNSHIFT_RPM = 0.35;
const SHIFT_COOLDOWN = 0.35;

const PITCH_LOW = [1.05, 1.25, 1.4];
const PITCH_HIGH = [3.5, 2.9, 2.3];

const FILTER_CUTOFF_MIN = 700;
const FILTER_CUTOFF_MAX = 7000;

function remap(value, inMin, inMax, outMin, outMax) {
  return outMin + ((outMax - outMin) * (value - inMin)) / (inMax - inMin);
}

export class GameAudio {
  _ctx;
  _engine;
  _engineLayer;
  _skid;
  _impactBuffers = [];
  _impactIndex = 0;

  _ready = false;
  _unlocked = false;
  _started = false;

  _rpm = 0;
  _gear = 0;
  _shiftCooldown = 0;

  constructor() {
    const Ctx = window.AudioContext || window.webkitAudioContext;

    this._ctx = new Ctx();

    this._engine = this._makeVoice(true);
    this._engineLayer = this._makeVoice(false);
    this._skid = this._makeVoice(false);
  }

  _makeVoice(withFilter) {
    const gain = this._ctx.createGain();

    gain.gain.value = 0;

    let filter = null;
    let head = gain;

    if (withFilter) {
      filter = this._ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.value = 0.7;
      filter.frequency.value = FILTER_CUTOFF_MIN;
      gain.connect(filter);
      head = filter;
    }

    head.connect(this._ctx.destination);

    return {
      source: null,
      gain,
      filter,
      buffer: null,
      currentVolume: 0,
      currentPitch: 1,
    };
  }

  async load() {
    const [engineBuf, skidBuf, impactBuf] = await Promise.all([
      this._fetchBuffer(sound('racing.engine')),
      this._fetchBuffer(sound('racing.skid')),
      this._fetchBuffer(sound('racing.impact')),
    ]);

    this._engine.buffer = engineBuf;
    this._engineLayer.buffer = engineBuf;
    this._skid.buffer = skidBuf;

    for (let i = 0; i < 3; i++) this._impactBuffers.push(impactBuf);

    this._ready = true;
    if (this._unlocked) this._start();
  }

  async _fetchBuffer(url) {
    const res = await fetch(url);
    const arr = await res.arrayBuffer();

    return this._ctx.decodeAudioData(arr);
  }

  unlock() {
    if (this._unlocked) return;
    this._unlocked = true;

    if (this._ctx.state === 'suspended') {
      void this._ctx.resume();
    }

    if (this._ready) this._start();
  }

  _start() {
    if (this._started) return;
    this._started = true;

    this._startVoice(this._engine);
    this._startVoice(this._engineLayer);
    this._startVoice(this._skid);
  }

  _startVoice(voice) {
    if (!voice.buffer) return;

    const src = this._ctx.createBufferSource();

    src.buffer = voice.buffer;
    src.loop = true;
    src.playbackRate.value = 1;
    src.connect(voice.gain);
    src.start();
    voice.source = src;
  }

  update(dt, speed, throttle, driftIntensity) {
    if (!this._started) return;

    const absSpeed = clamp(Math.abs(speed), 0, 1);
    const load = clamp(Math.max(0, throttle), 0, 1);

    const gearWindow = 1 / NUM_GEARS;
    const gearStart = this._gear * gearWindow;
    const inGear = clamp((absSpeed - gearStart) / gearWindow, 0, 1);

    let targetRpm = inGear * 0.85 + load * 0.2;

    targetRpm = clamp(targetRpm, 0, 1.05);

    const riseRate = 4;
    const fallRate = 4;
    const rate = targetRpm > this._rpm ? riseRate * (0.3 + load) : fallRate;

    this._rpm = lerp(this._rpm, targetRpm, Math.min(1, dt * rate));

    this._shiftCooldown = Math.max(0, this._shiftCooldown - dt);

    if (this._shiftCooldown === 0) {
      if (this._rpm > UPSHIFT_RPM && this._gear < NUM_GEARS - 1 && load > 0.1) {
        this._gear++;
        this._rpm = 0.45;
        this._shiftCooldown = SHIFT_COOLDOWN;
      } else if (this._rpm < DOWNSHIFT_RPM && this._gear > 0) {
        this._gear--;
        this._rpm = 0.78;
        this._shiftCooldown = SHIFT_COOLDOWN;
      }
    }

    const targetVol = remap(absSpeed + load * 0.5, 0, 1.5, 0.02, 0.25);

    this._engine.currentVolume = lerp(
      this._engine.currentVolume,
      targetVol,
      dt * 5,
    );
    this._engine.gain.gain.value = this._engine.currentVolume;
    this._engineLayer.currentVolume = this._engine.currentVolume * 0.4;
    this._engineLayer.gain.gain.value = this._engineLayer.currentVolume;

    const pitch = lerp(
      PITCH_LOW[this._gear],
      PITCH_HIGH[this._gear],
      this._rpm,
    );

    if (this._engine.source) this._engine.source.playbackRate.value = pitch;
    if (this._engineLayer.source)
      this._engineLayer.source.playbackRate.value = pitch * 0.5;

    if (this._engine.filter) {
      const targetCutoff = remap(
        load,
        0,
        1,
        FILTER_CUTOFF_MIN,
        FILTER_CUTOFF_MAX,
      );

      this._engine.filter.frequency.setTargetAtTime(
        targetCutoff,
        this._ctx.currentTime,
        0.05,
      );
    }

    let skidVol = 0;

    if (driftIntensity > 0.5) {
      skidVol = remap(clamp(driftIntensity, 0.5, 2.5), 0.5, 2.5, 0.05, 0.3);
    }

    this._skid.currentVolume = lerp(this._skid.currentVolume, skidVol, dt * 10);
    this._skid.gain.gain.value = this._skid.currentVolume;

    const skidPitch = clamp(Math.abs(speed), 1, 3);

    this._skid.currentPitch = lerp(this._skid.currentPitch, skidPitch, 0.1);
    if (this._skid.source)
      this._skid.source.playbackRate.value = this._skid.currentPitch;
  }

  playImpact(impactVelocity) {
    if (!this._unlocked || this._impactBuffers.length === 0) return;

    const buffer = this._impactBuffers[this._impactIndex];

    this._impactIndex = (this._impactIndex + 1) % this._impactBuffers.length;

    const src = this._ctx.createBufferSource();

    src.buffer = buffer;

    const gain = this._ctx.createGain();
    const volume = clamp(remap(impactVelocity, 0, 6, 0.01, 1.0), 0.01, 1.0);

    gain.gain.value = volume;
    src.connect(gain);
    gain.connect(this._ctx.destination);
    src.start();
  }
}
