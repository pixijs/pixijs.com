import { BitmapFont, BitmapText, Container, Graphics } from 'pixi.js';

const STORAGE_PREFIX = 'racing.bestLap.';
const HUD_FONT = 'racing-hud';

let _fontInstalled = false;

function ensureFont() {
  if (_fontInstalled) return;
  _fontInstalled = true;

  // Single rasterization shared by every HUD glyph. `chars` is restricted to
  // exactly the characters the timer can produce, so the atlas is tiny.
  BitmapFont.install({
    name: HUD_FONT,
    style: {
      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      fontWeight: '600',
      fill: 0xffffff,
    },
    chars: '0123456789:.LAPSTBE ',
    resolution: 2,
  });
}

function loadBest(key) {
  try {
    const v = localStorage.getItem(key);
    const n = v !== null ? Number(v) : NaN;

    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function saveBest(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // Storage may be unavailable (e.g. private browsing); silently ignore.
  }
}

function formatTime(t) {
  if (t === null || t === undefined) return '0:00.00';

  const m = Math.floor(t / 60);
  const s = t - m * 60;

  return `${m}:${s.toFixed(2).padStart(5, '0')}`;
}

export class LapTimer {
  container;

  _track;
  _storageKey = `${STORAGE_PREFIX}default`;

  _lap = 1;
  _bestLap;
  _lastLap = null;
  _currentLapTime = 0;
  _running = false;

  _prevForwardProj = null;
  _visited = new Set();

  _flashTime = 0;
  _flashColor = 0xffffff;

  _lapText;
  _currentText;
  _lastText;
  _bestText;
  _bg;

  constructor(track) {
    ensureFont();

    this._track = track;
    this._bestLap = loadBest(this._storageKey);

    this.container = new Container();
    this.container.x = 12;
    this.container.y = 12;

    this._bg = new Graphics()
      .roundRect(0, 0, 220, 110, 12)
      .fill({ color: 0x000000, alpha: 0.5 });
    this.container.addChild(this._bg);

    const labelLap = new BitmapText({
      text: 'LAP',
      style: { fontFamily: HUD_FONT, fontSize: 11, letterSpacing: 1.4 },
    });

    labelLap.alpha = 0.7;
    labelLap.position.set(14, 12);
    this.container.addChild(labelLap);

    this._lapText = new BitmapText({
      text: '1',
      style: { fontFamily: HUD_FONT, fontSize: 13 },
    });
    this._lapText.anchor.set(1, 0);
    this._lapText.position.set(206, 12);
    this.container.addChild(this._lapText);

    this._currentText = new BitmapText({
      text: formatTime(0),
      style: { fontFamily: HUD_FONT, fontSize: 26 },
    });
    this._currentText.position.set(14, 30);
    this.container.addChild(this._currentText);

    const labelLast = new BitmapText({
      text: 'LAST',
      style: { fontFamily: HUD_FONT, fontSize: 11, letterSpacing: 1.4 },
    });

    labelLast.alpha = 0.7;
    labelLast.position.set(14, 70);
    this.container.addChild(labelLast);

    this._lastText = new BitmapText({
      text: formatTime(null),
      style: { fontFamily: HUD_FONT, fontSize: 13 },
    });
    this._lastText.anchor.set(1, 0);
    this._lastText.position.set(206, 70);
    this.container.addChild(this._lastText);

    const labelBest = new BitmapText({
      text: 'BEST',
      style: { fontFamily: HUD_FONT, fontSize: 11, letterSpacing: 1.4 },
    });

    labelBest.alpha = 0.7;
    labelBest.position.set(14, 88);
    this.container.addChild(labelBest);

    this._bestText = new BitmapText({
      text: formatTime(this._bestLap),
      style: { fontFamily: HUD_FONT, fontSize: 13 },
    });
    this._bestText.anchor.set(1, 0);
    this._bestText.position.set(206, 88);
    this.container.addChild(this._bestText);
  }

  update(dt, position, hasInput) {
    if (!this._running && !hasInput) return;
    this._running = true;

    this._currentLapTime += dt;
    this._currentText.text = formatTime(this._currentLapTime);

    const cellSize = this._track.cellSize;
    const gx = Math.floor(position.x / cellSize);
    const gz = Math.floor(position.z / cellSize);
    const key = `${gx},${gz}`;

    if (this._track.requiredCellKeys.has(key)) this._visited.add(key);

    const dx = position.x - this._track.finishCenter.x;
    const dz = position.z - this._track.finishCenter.z;

    const forwardProj =
      dx * this._track.finishForward.x + dz * this._track.finishForward.z;
    const lateralProj = Math.abs(
      dx * this._track.finishRight.x + dz * this._track.finishRight.z,
    );

    if (this._prevForwardProj !== null) {
      const onLine = lateralProj <= cellSize * 0.5;
      const noTeleport = Math.abs(forwardProj - this._prevForwardProj) < 5;
      const crossedForward = this._prevForwardProj < 0 && forwardProj >= 0;

      if (onLine && noTeleport && crossedForward) {
        if (this._visited.size === this._track.requiredCellKeys.size) {
          this._completeLap();
        }
        this._visited.clear();
      }
    }

    this._prevForwardProj = forwardProj;

    if (this._flashTime > 0) {
      this._flashTime -= dt;

      const t = Math.max(0, this._flashTime / 1.2);

      this._currentText.tint = t > 0.5 ? this._flashColor : 0xffffff;
    } else if (this._currentText.tint !== 0xffffff) {
      this._currentText.tint = 0xffffff;
    }
  }

  _completeLap() {
    const isBest =
      this._bestLap === null || this._currentLapTime < this._bestLap;

    this._lastLap = this._currentLapTime;
    if (isBest) {
      this._bestLap = this._currentLapTime;
      saveBest(this._storageKey, this._bestLap);
    }

    this._lap += 1;
    this._currentLapTime = 0;

    this._lapText.text = String(this._lap);
    this._lastText.text = formatTime(this._lastLap);
    this._bestText.text = formatTime(this._bestLap);

    this._flashTime = 1.2;
    this._flashColor = isBest ? 0x5af168 : 0xff6e6e;
  }
}
