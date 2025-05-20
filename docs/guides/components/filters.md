---
sidebar_position: 7
---

# Filters / Blend Modes

PixiJS filters allow you to apply post-processing visual effects to any scene object and its children. Filters can be used for effects such as blurring, color adjustments, noise, or custom shader-based operations.

```ts
import { Sprite, BlurFilter } from 'pixi.js';

// Apply the filter
sprite.filters = [new BlurFilter({ strength: 8 })];
```

---

## Applying Filters

Applying filters is straightforward. You can assign a filter instance to the `filters` property of any scene object, such as `Sprite`, `Container`, or `Graphics`.
You can apply multiple filters by passing an array of filter instances.

```ts
import { BlurFilter, NoiseFilter } from 'pixi.js';

sprite.filters = new BlurFilter({ strength: 5 });

sprite.filters = [
    new BlurFilter({ strength: 4 }),
    new NoiseFilter({ noise: 0.2 }),
];
```
:::info
Order matters — filters are applied in sequence.
:::

---

## Advanced Blend Modes

PixiJS v8 introduces advanced blend modes for filters, allowing for more complex compositing effects. These blend modes can be used to create unique visual styles and effects.
To use advanced modes like `HARD_LIGHT`, you must manually import the advanced blend mode extension:

```ts
import 'pixi.js/advanced-blend-modes';
import { HardMixBlend } from 'pixi.js';

sprite.filters = [new HardMixBlend()];
```

---

## Built-In Filters Overview

PixiJS v8 provides a variety of filters out of the box:

| Filter Class         | Description                                        |
| -------------------- | -------------------------------------------------- |
| `AlphaFilter`        | Applies transparency to an object.                 |
| `BlurFilter`         | Gaussian blur.                                     |
| `ColorMatrixFilter`  | Applies color transformations via a matrix.        |
| `DisplacementFilter` | Distorts an object using another texture.          |
| `NoiseFilter`        | Adds random noise for a grainy effect.             |

:::info
To explore more community filters, see [pixi-filters](https://pixijs.io/filters/docs/).
:::

**Blend Filters**: Used for custom compositing modes

| Filter Class         | Description                                        |
| -------------------- | -------------------------------------------------- |
| `ColorBurnBlend`     | Darkens the base color to reflect the blend color. |
| `ColorDodgeBlend`    | Brightens the base color.                          |
| `DarkenBlend`        | Retains the darkest color components.              |
| `DivideBlend`        | Divides the base color by the blend color.         |
| `HardMixBlend`       | High-contrast blend.                               |
| `LinearBurnBlend`    | Darkens using linear formula.                      |
| `LinearDodgeBlend`   | Lightens using linear formula.                     |
| `LinearLightBlend`   | Combination of linear dodge and burn.              |
| `PinLightBlend`      | Selective replacement of colors.                   |
| `SubtractBlend`      | Subtracts the blend color from base.               |

---

## Creating a Custom Filter

To define a custom filter in PixiJS v8, you use `Filter.from()` with shader programs and GPU resources.

```ts
import { Filter, GlProgram, Texture } from 'pixi.js';

const vertex = `
  in vec2 aPosition;
  out vec2 vTextureCoord;

  uniform vec4 uInputSize;
  uniform vec4 uOutputFrame;
  uniform vec4 uOutputTexture;

  vec4 filterVertexPosition( void )
  {
      vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;

      position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
      position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

      return vec4(position, 0.0, 1.0);
  }

  vec2 filterTextureCoord( void )
  {
      return aPosition * (uOutputFrame.zw * uInputSize.zw);
  }

  void main(void)
  {
      gl_Position = filterVertexPosition();
      vTextureCoord = filterTextureCoord();
  }
`;

const fragment = `
  in vec2 vTextureCoord;
  in vec4 vColor;

  uniform sampler2D uTexture;
  uniform float uTime;

  void main(void)
  {
      vec2 uvs = vTextureCoord.xy;

      vec4 fg = texture2D(uTexture, vTextureCoord);


      fg.r = uvs.y + sin(uTime);


      gl_FragColor = fg;

  }
`;

const customFilter = new Filter({
    glProgram: new GlProgram({
        fragment,
        vertex,
    }),
    resources: {
        timeUniforms: {
            uTime: { value: 0.0, type: 'f32' },
        },
    },
});


// Apply the filter
sprite.filters = [customFilter];

// Update uniform
app.ticker.add((ticker) => {
    filter.resources.timeUniforms.uniforms.uTime += 0.04 * ticker.deltaTime;
});
```

:::info **Tip**
Shaders must be WebGL- or WebGPU-compatible. For dual-renderer support, include a `gpuProgram`.
:::

---

## API Reference

- [Overview](https://pixijs.download/release/docs/filters.html)
- [Filter](https://pixijs.download/release/docs/filters.Filter.html)
