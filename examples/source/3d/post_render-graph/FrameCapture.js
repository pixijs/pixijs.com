/**
 * `FrameCopy` and `FrameCapture`, passes that copy the frame as it stands into a texture you keep
 *
 * The view runs in composite mode, so its scene passes draw into `graph.sceneColor`, a texture, rather than straight
 * to the screen. Any pass can read that texture, and what it reads is the frame so far: everything the passes before
 * it drew, nothing after. `FrameCopy` holds the texture and makes the `FullscreenPass` that fills it, for a graph
 * builder to append anywhere; `FrameCapture` is a `Pass3D` that adds one at its stage.
 */

import { FullscreenPass, Pass3D } from '@pixi/3d';

import { RenderTexture, UniformGroup } from 'pixi.js';

/** The share of the frame's height the copy keeps at most, round its middle, where the orbit holds the logo */
const CROP_HEIGHT = 0.48;
/** The share of the frame's width it keeps at most, for a tall frame; the portrait fit keeps the logo to about half */
const CROP_WIDTH = 0.7;

/** `uCrop` is the part of the frame the copy keeps, in the frame's UV: its corner, then its size */
const COPY_FRAGMENT = {
  gpu: /* wgsl */ `
fn effect(uv: vec2<f32>) -> vec4<f32> {
  return sampleColor(fx.uCrop.xy + uv * fx.uCrop.zw);
}
`,
  gl: /* glsl */ `
vec4 effect(vec2 uv) {
  return sampleColor(uCrop.xy + uv * uCrop.zw);
}
`,
};

/** A copy of the middle of the frame, as it stands when its pass runs, in a texture that outlives every graph */
export class FrameCopy {
  /** What the copy lands in, sized by {@link FrameCopy#resize} */
  texture = RenderTexture.create({ width: 1, height: 1 });
  _uniforms = new UniformGroup({
    uCrop: { value: new Float32Array([0, 0, 1, 1]), type: 'vec4<f32>' },
  });
  /** The crop's size, as shares of the frame's width and height, round its middle */
  _crop = { width: 1, height: 1 };

  /**
   * The pass that makes the copy. It reads `graph.sceneColor`, the frame so far, and writes the texture, which the
   * graph imports. A pass that writes an imported texture always runs, since the graph can't see who reads it.
   */
  createPass(graph, renderer) {
    return new FullscreenPass({
      renderer,
      // The name the graph lists the pass under, in its debug tools.
      label: 'frameCopy',
      fragment: COPY_FRAGMENT,
      uniforms: this._uniforms,
      reads: { color: graph.sceneColor },
      writes: graph.importColor(() => this.texture),
    });
  }

  /**
   * Sizes the texture to a picture `width` × `height` px, and crops the middle of the frame to that shape, so nothing
   * stretches. `frameAspect` is the frame's width over its height: the view's.
   */
  resize(width, height, resolution, frameAspect) {
    const aspect = width / height;
    const cropHeight = Math.min(
      CROP_HEIGHT,
      (CROP_WIDTH * frameAspect) / aspect,
    );

    this.texture.source.resize(width, height, resolution);
    this._crop.width = (cropHeight * aspect) / frameAspect;
    this._crop.height = cropHeight;
    this._writeCrop();
  }

  destroy() {
    this.texture.destroy(true);
  }

  /** Writes the crop as a corner and a size in the frame's UV */
  _writeCrop() {
    const { width, height } = this._crop;
    const lanes = this._uniforms.uniforms.uCrop;

    lanes[0] = 0.5 - width / 2;
    lanes[1] = 0.5 - height / 2;
    lanes[2] = width;
    lanes[3] = height;
    this._uniforms.update();
  }
}

/** The stages a copy can read the frame at: before the opaque scene, the frame holds nothing yet */

/** A `Pass3D` that copies the frame as it stands at its stage */
export class FrameCapture extends Pass3D {
  stage;
  /** The copy and its texture, kept across every graph rebuild */
  copy = new FrameCopy();

  constructor({ stage }) {
    super();
    this.stage = stage;
  }

  build(graph, ctx) {
    graph.addPass(this.copy.createPass(graph, ctx.renderer));
  }

  destroy() {
    this.copy.destroy();
  }
}
