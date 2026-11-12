export class Controls {
  _keys = Object.create(null);
  _joystick;

  constructor(joystick = null) {
    this._joystick = joystick;

    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
  }

  destroy() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
  }

  update() {
    let x = 0;
    let z = 0;

    if (this._keys.KeyA || this._keys.ArrowLeft) x -= 1;
    if (this._keys.KeyD || this._keys.ArrowRight) x += 1;
    if (this._keys.KeyW || this._keys.ArrowUp) z += 1;
    if (this._keys.KeyS || this._keys.ArrowDown) z -= 1;

    const pads =
      navigator.getGamepads && !navigator.userAgent.includes('Firefox')
        ? navigator.getGamepads()
        : [];

    for (const gp of pads) {
      if (!gp) continue;

      const stickX = gp.axes[0];

      if (Math.abs(stickX) > 0.15) x = stickX;

      const rt = gp.buttons[7]?.value ?? 0;
      const lt = gp.buttons[6]?.value ?? 0;

      if (rt > 0.1 || lt > 0.1) z = rt - lt;

      break;
    }

    let touchActive = false;

    if (this._joystick && this._joystick.touchActive) {
      const jx = this._joystick.dirX;
      const jy = this._joystick.dirY;
      const mag = Math.sqrt(jx * jx + jy * jy);

      if (mag > 0.15) {
        x = ((jx + jy) * Math.SQRT1_2) / mag;
        z = ((-jx + jy) * Math.SQRT1_2) / mag;
        touchActive = true;
      }
    }

    return { x, z, touchActive };
  }

  _onKeyDown = (e) => {
    this._keys[e.code] = true;
  };

  _onKeyUp = (e) => {
    this._keys[e.code] = false;
  };
}
