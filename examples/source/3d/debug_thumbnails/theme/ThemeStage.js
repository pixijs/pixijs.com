/**
 * The light and dark set a themed example stands on: a checker floor that takes real shadows and melts into fog,
 * a backdrop that meets the fog at the horizon, and each theme's fill, key and form lights
 *
 * It needs no post pass: the backdrop is the view's hemisphere background, so any View3D can stand on it.
 */

import {
  Box,
  DirectionalLight,
  linearToSrgb,
  Material3D,
  Matrix4,
  Mesh3D,
  PlaneGeometry,
  SpotLight,
  Vector3,
} from '@pixi/3d';
import { Assets, Matrix, Texture } from 'pixi.js';

import { setClayDarkness } from './clay';
import { setHelperDarkness } from './helpers';
import { mixColor, screenColor, THEMES } from './palette';

/** Scratch for {@link ThemeStage.shadowOverFloor}'s refit */
const _casterBox = new Box();
const _world = new Matrix4();
const _toward = new Vector3();
const _corner = new Vector3();

/** A hemisphere with every field set, so the stage can fade it */

/** How each theme lights the floor: a hemisphere fill, a shadowing key, and a form light that models shapes */
const LIGHTING = {
  // A lavender-white sky over lavender, so shadows cool towards lavender rather than grey.
  light: { sky: 0xf1edff, ground: 0x63529f, fill: 0.95, key: 2.2, form: 0 },
  // A dim plum night that leaves the floor to the key, the form light and the spotlight. A cube map in place of
  // the fill lights the same on both themes.
  dark: { sky: 0xb3a4d8, ground: 0x140a1c, fill: 0.5, key: 0.9, form: 1.4 },
};

/** The kit's reflection cube map: a sunset over the sea in greyscale, so a metal tints it with its own colour */
const REFLECTIONS_URL =
  'https://pixijs.com/assets/3d/venice-sunset-grey/venice-sunset-grey.cubemap';

/** Where the key hangs above the floor's origin; only its direction counts */
const KEY_POSITION = { x: -4, y: 12, z: 7 };

const CHECKER_SIZE = 128;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Paints a 2 × 2 checker in white and a grey `level`, 0 to 255; the floor material's colour tints it */
function paintChecker(ctx, level) {
  const half = CHECKER_SIZE / 2;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, CHECKER_SIZE, CHECKER_SIZE);
  ctx.fillStyle = `rgb(${level}, ${level}, ${level})`;
  ctx.fillRect(half, 0, half, half);
  ctx.fillRect(0, half, half, half);
}

/**
 * Sets a hemisphere background that shows `sky` straight up and `haze` at the horizon
 *
 * The background is `mix(ground, sky, dot(dir, up) * 0.5 + 0.5)` in linear light, so the horizon sits halfway
 * between the two; the ground is whatever puts that halfway point on the haze, where the fogged floor ends.
 */
function writeBackdrop(backdrop, haze, sky) {
  let skyColor = 0;
  let groundColor = 0;

  for (let shift = 16; shift >= 0; shift -= 8) {
    // The linear values the view's gamma-2.2 encode shows as these colours.
    const h = Math.pow(((haze >> shift) & 255) / 255, 2.2);
    const s = Math.pow(((sky >> shift) & 255) / 255, 2.2);
    const g = Math.min(1, Math.max(0, 2 * h - s));

    skyColor |= Math.round(linearToSrgb(s) * 255) << shift;
    groundColor |= Math.round(linearToSrgb(g) * 255) << shift;
  }

  backdrop.skyColor = skyColor;
  backdrop.groundColor = groundColor;
}

/**
 * Loads the kit's reflection cube map, for {@link ThemeStageOptions#reflections}
 *
 * A `.cubemap` file is JSON naming six face images, which `Assets` loads as one `CubeTexture`.
 * {@link releaseReflections} unloads it.
 */
export function loadReflections() {
  return Assets.load(REFLECTIONS_URL);
}

/** Unloads the cube map {@link loadReflections} loaded, once no stage uses it */
export async function releaseReflections() {
  await Assets.unload(REFLECTIONS_URL);
}

/**
 * Lights a view and gives it a floor in the light or dark theme
 *
 * It sets the view's environment, background and fog to its own objects and fades them with the theme; pass
 * `reflections` for a cube map environment, if a material needs reflections, which lights the same on both themes. It also sets
 * `toneMapping` to `'none'`, which the palette's colours are picked for, and `shadowFilter` to `'pcf-high'`, the
 * soft shadow edges of the look; set it back to `'pcf'` after it to save shadow reads on a busy mobile scene.
 */
export class ThemeStage {
  /** The checker floor; set its `eventMode` to pick taps on it */
  floor;
  floorMaterial;
  /** The shadow-casting key, above and in front of the floor; out of the view with `lights: false` */
  key;
  /**
   * A shadowless light from the upper left that models shapes on the dark theme; out of the view with `lights: false`
   * or `form: false`
   */
  form;
  /** The dark theme's spotlight, if asked for */
  spot;
  /** The fill light, which is the view's environment unless `reflections` replaces it; theme changes write over it */
  fill;
  /** The view's background; theme changes write over it */
  backdrop;
  /** The view's linear fog; set its `near` and `far` freely, theme changes write its colour */
  fog;

  _view;
  _reflections;
  _checker;
  _checkerCanvas;
  _spotIntensity = 0;
  _darkness = -1;
  _target = 0;
  _checkLevel = -1;
  _fadeFrom = 0;
  _fadeAge = 0;
  _fadeTime = 0;
  _destroyed = false;
  _shadowRegions = [];
  _shadowBox = null;

  constructor(view3d, options = {}) {
    const {
      at = 0,
      size = 160,
      check = 1,
      roughness = 0.85,
      fog = { near: 12, far: 40 },
      lights = true,
    } = options;
    const repeats = size / (2 * check);
    // A check corner sits under the origin.
    const offset = -((repeats / 2) % 1);
    const canvas = document.createElement('canvas');

    canvas.width = canvas.height = CHECKER_SIZE;
    this._view = view3d;
    this._reflections = options.reflections ?? null;
    this._checkerCanvas = canvas;
    // Mipmapped and anisotropic, since the floor is mostly seen at a grazing angle.
    this._checker = Texture.from({
      resource: canvas,
      addressMode: 'repeat',
      autoGenerateMipmaps: true,
      maxAnisotropy: 8,
    });
    this.floorMaterial = new Material3D({
      baseColorTexture: this._checker,
      roughness,
      metallic: 0,
      specular: { factor: 0.2 },
      uvTransform: new Matrix()
        .scale(repeats, repeats)
        .translate(offset, offset),
    });
    this.floor = new Mesh3D({
      label: 'themeFloor',
      geometry: new PlaneGeometry({ width: size, height: size }),
      material: this.floorMaterial,
      castShadow: false,
      receiveShadow: true,
    });
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = at;

    // No shadow box, so the engine fits one round the shadow casters every frame and spends the whole map on them.
    // Its default biases follow that box's texel size.
    this.key = new DirectionalLight({
      label: 'themeKey',
      color: 0xfff6f2,
      castShadow: true,
    });
    this.key.position.set(KEY_POSITION.x, at + KEY_POSITION.y, KEY_POSITION.z);
    this.form = new DirectionalLight({ label: 'themeForm', color: 0xfff4fb });
    this.form.position.set(-7, at + 9, 6);
    view3d.root.addChild(this.floor);
    if (lights) view3d.root.addChild(this.key);
    if (lights && options.form !== false) view3d.root.addChild(this.form);
    this.key.lookAt({ x: 0, y: at, z: 0 });
    this.form.lookAt({ x: 0, y: at, z: 0 });

    const spot = options.spotlight === true ? {} : options.spotlight || null;

    this.spot = null;
    if (spot) {
      const target = spot.target ?? { x: 0, y: at, z: 0 };
      const position = spot.position ?? { x: 0, y: at + 7.5, z: 2.5 };

      this._spotIntensity = spot.intensity ?? 70;
      this.spot = new SpotLight({
        label: 'themeSpot',
        color: 0xfff1f5,
        coneAngle: spot.coneAngle ?? 24,
        penumbra: 0.45,
        castShadow: true,
      });
      this.spot.position.set(position.x, position.y, position.z);
      view3d.root.addChild(this.spot);
      this.spot.lookAt(target);
    }

    this.fill = { skyColor: 0, groundColor: 0, intensity: 0 };
    this.backdrop = { skyColor: 0, groundColor: 0, intensity: 1 };
    this.fog = { type: 'linear', color: 0, near: fog.near, far: fog.far };
    this._target = options.theme === 'dark' ? 1 : 0;
    this._apply(this._target);

    view3d.toneMapping = 'none';
    view3d.shadowFilter = 'pcf-high';
    view3d.environment = this._reflections ?? this.fill;
    view3d.background = this.backdrop;
    // Set once: a new fog object with another curve recompiles every material.
    view3d.fog = this.fog;
  }

  /** The theme the stage shows, or is fading to */
  get theme() {
    return this._target < 0.5 ? 'light' : 'dark';
  }

  /**
   * How far between the light theme (0) and the dark one (1) the stage is
   *
   * Set it every frame for a day-night cycle of your own; it stops a running {@link ThemeStage#setTheme} fade.
   */
  get darkness() {
    return this._darkness;
  }
  set darkness(value) {
    this._fadeTime = 0;
    this._target = value;
    this._apply(value);
  }

  /**
   * Switches to a theme, at once or over `seconds`
   *
   * A fade advances in {@link ThemeStage#update} and starts from wherever a running one has got to.
   */
  setTheme(theme, seconds = 0) {
    this._target = theme === 'dark' ? 1 : 0;
    this._fadeFrom = this._darkness;
    this._fadeAge = 0;
    this._fadeTime = seconds;
    if (seconds <= 0) this._apply(this._target);
  }

  /**
   * Keeps the key's shadow box over the view's shadow casters and the floor their shadows fall on, refitted on every
   * `update`
   *
   * It works around an engine bug: in the box the engine fits by itself, floor past the caster furthest from the key
   * reads as lit, so a shadow that reaches it is cut off along a line. Each visible mesh with `castShadow` is measured
   * by its geometry's bounds; pass world boxes for instances, which reach past the one shape their geometry holds.
   * @param regions - World boxes the instanced casters stay inside
   */
  shadowOverFloor(...regions) {
    this._shadowRegions = regions;
    this._shadowBox ??= new Box();
    this.key.shadow.bounds = this._shadowBox;
    this._fitShadowBox();
  }

  /** Advances a running theme fade and refits the shadow box; call it every tick with seconds since the last */
  update(dt) {
    if (this._shadowBox) this._fitShadowBox();
    if (this._fadeAge >= this._fadeTime) return;
    this._fadeAge = Math.min(this._fadeTime, this._fadeAge + dt);

    const t = this._fadeAge / this._fadeTime;

    this._apply(lerp(this._fadeFrom, this._target, t * t * (3 - 2 * t)));
  }

  /**
   * Removes the floor and the lights, and clears the view's environment, background and fog if still the stage's
   *
   * The reflections cube map stays yours to release.
   */
  destroy() {
    if (this._destroyed) return;
    this._destroyed = true;
    this.floor.destroy({ geometry: true, material: true });
    this._checker.destroy(true);
    this.key.destroy();
    this.form.destroy();
    this.spot?.destroy();
    if (
      this._view.environment === this.fill ||
      this._view.environment === this._reflections
    ) {
      this._view.environment = null;
    }
    if (this._view.background === this.backdrop) this._view.background = null;
    if (this._view.fog === this.fog) this._view.fog = null;
  }

  /** Encloses the casters, then each corner's shadow on the floor, cast along the key's forward direction */
  _fitShadowBox() {
    const box = this._shadowBox.makeEmpty();

    for (const region of this._shadowRegions) box.union(region);
    this._encloseCasters(this._view.root, box);
    if (box.isEmpty()) return;

    const floorY = this.floor.position.y;
    const down = this.key.getGlobalTransform(_world).extractForward(_toward);
    const { min, max } = _casterBox.copyFrom(box);

    for (let i = 0; i < 8; i++) {
      _corner.set(
        i & 1 ? max.x : min.x,
        i & 2 ? max.y : min.y,
        i & 4 ? max.z : min.z,
      );
      const reach = (_corner.y - floorY) / -down.y;

      box.expandByPoint({
        x: _corner.x + down.x * reach,
        y: floorY,
        z: _corner.z + down.z * reach,
      });
    }
  }

  /** Grows `box` by the world bounds of every visible shadow-casting mesh under `node` */
  _encloseCasters(node, box) {
    if (!node.visible) return;
    if (node instanceof Mesh3D && node.castShadow) {
      box.union(
        node.geometry.bounds3D.applyMatrix4(
          node.getGlobalTransform(_world),
          _casterBox,
        ),
      );
    }
    for (const child of node.children) this._encloseCasters(child, box);
  }

  _apply(t) {
    if (t === this._darkness) return;
    this._darkness = t;

    const light = THEMES.light;
    const dark = THEMES.dark;
    const haze = mixColor(light.haze, dark.haze, t);
    const level = Math.round(255 * lerp(light.check, dark.check, t));

    this.fill.skyColor = mixColor(LIGHTING.light.sky, LIGHTING.dark.sky, t);
    this.fill.groundColor = mixColor(
      LIGHTING.light.ground,
      LIGHTING.dark.ground,
      t,
    );
    this.fill.intensity = lerp(LIGHTING.light.fill, LIGHTING.dark.fill, t);
    this.key.intensity = lerp(LIGHTING.light.key, LIGHTING.dark.key, t);
    this.form.intensity = lerp(LIGHTING.light.form, LIGHTING.dark.form, t);
    this.form.visible = this.form.intensity > 0.001;
    if (this.spot) {
      this.spot.intensity = this._spotIntensity * t;
      this.spot.visible = t > 0.001;
    }
    this.fog.color = screenColor(haze);
    writeBackdrop(this.backdrop, haze, mixColor(light.sky, dark.sky, t));
    this.floorMaterial.baseColor = mixColor(light.floor, dark.floor, t);
    // Repainted only while a fade moves it: a few small uploads per theme change.
    if (level !== this._checkLevel) {
      this._checkLevel = level;
      paintChecker(this._checkerCanvas.getContext('2d'), level);
      this._checker.source.update();
    }
    setClayDarkness(t);
    setHelperDarkness(t);
  }
}
