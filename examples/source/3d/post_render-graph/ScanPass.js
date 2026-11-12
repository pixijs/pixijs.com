/**
 * `ScanPass`, a `Pass3D` that lights a ring at a set distance from the camera
 *
 * A `Pass3D` is the object you keep: it outlives every graph the view builds. Each time the view builds one, it calls
 * `build` at the stage the pass names, and the pass adds its render passes there. This one adds a single
 * `FullscreenPass` that reads the opaque depth copy and lights every pixel `radius` from the camera.
 */

import { FullscreenPass, Pass3D } from '@pixi/3d';

import { Color, UniformGroup } from 'pixi.js';

/**
 * The sky has no depth to measure, so it stays clear. `viewPos` rebuilds each pixel's position in view space from the
 * depth copy, and its length is the distance from the camera. The output is premultiplied, as pixi's `'normal'` blend
 * expects.
 */
const SCAN_FRAGMENT = {
  gpu: /* wgsl */ `
fn effect(uv: vec2<f32>) -> vec4<f32> {
  if (sampleDepth(uv) >= 1.0) { return vec4<f32>(0.0); }
  let d = length(viewPos(uv));
  let a = 1.0 - smoothstep(0.0, fx.uScanWidth * 0.5, abs(d - fx.uScanRadius));
  return vec4<f32>(fx.uScanColor * a, a);
}
`,
  gl: /* glsl */ `
vec4 effect(vec2 uv) {
  if (sampleDepth(uv) >= 1.0) return vec4(0.0);
  float d = length(viewPos(uv));
  float a = 1.0 - smoothstep(0.0, uScanWidth * 0.5, abs(d - uScanRadius));
  return vec4(uScanColor * a, a);
}
`,
};

/** A ring of light at `radius` from the camera, drawn after every scene pass */
export class ScanPass extends Pass3D {
  /**
   * The opaque depth copy this pass samples is taken after the `'afterOpaque'` passes, so `'afterTransparent'` is the
   * first stage where it exists
   */
  stage = 'afterTransparent';

  /** Kept across rebuilds: every graph's pass reads these, so a property write needs no rebuild */
  _uniforms = new UniformGroup({
    uScanRadius: { value: 0, type: 'f32' },
    uScanWidth: { value: 0, type: 'f32' },
    uScanColor: { value: new Float32Array(3), type: 'vec3<f32>' },
  });
  _color = 0;

  constructor({ color = 0x38bdf8, width = 0.5, ...options } = {}) {
    super(options);
    this.color = color;
    this.width = width;
  }

  /** The ring's distance from the camera, in world units */
  get radius() {
    return this._uniforms.uniforms.uScanRadius;
  }
  set radius(value) {
    this._write('uScanRadius', value);
  }

  /** The ring's thickness, in world units */
  get width() {
    return this._uniforms.uniforms.uScanWidth;
  }
  set width(value) {
    this._write('uScanWidth', value);
  }

  /** The ring's colour, a hex number */
  get color() {
    return this._color;
  }
  set color(value) {
    const lanes = this._uniforms.uniforms.uScanColor;
    const color = Color.shared.setValue(value);

    this._color = value;
    lanes[0] = color.red;
    lanes[1] = color.green;
    lanes[2] = color.blue;
    this._uniforms.update();
  }

  build(graph, ctx) {
    graph.addPass(
      new FullscreenPass({
        renderer: ctx.renderer,
        // The name the graph lists the pass under, in its debug tools.
        label: 'scan',
        fragment: SCAN_FRAGMENT,
        uniforms: this._uniforms,
        reads: { depth: ctx.opaqueDepth },
        // Into the scene's own colour, blended over what the passes before it drew, so a pass after it sees the ring.
        writes: graph.sceneColor,
        blendMode: 'normal',
      }),
    );
  }

  _write(name, value) {
    this._uniforms.uniforms[name] = value;
    this._uniforms.update();
  }
}
