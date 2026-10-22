import { Container, Sprite, Texture } from 'pixi.js';
import { SILHOUETTE_REACH } from './kinds';
import { SILHOUETTES } from './silhouette';

import type { FieldTheme } from './clay';
import type { ShapeKind } from './kinds';

/** Texels across a baked shadow, and how far the blur spreads, in the units a shape's geometry is authored in */
const TEXTURE_SIZE = 128;
const BLUR = 0.2;
/** From the middle of the texture to its edge: the outline's own reach and room for the blur to die away */
const TEXTURE_REACH = SILHOUETTE_REACH + BLUR * 3;

/** Keep in step with `.shade` in `ui/Clay`, which casts the same shadow under a clay image */
const SHADE: Record<FieldTheme, { color: number; alpha: number; drop: number; dropBySize: number }> = {
  light: { color: 0x3c2878, alpha: 0.18, drop: 6, dropBySize: 0.08 },
  dark: { color: 0x04020c, alpha: 0.45, drop: 7, dropBySize: 0.09 },
};

/** A shadow spreads and thins as its shape stands higher off the surface */
const SPREAD = 0.14;
const THIN = 0.22;

export interface Shadows {
  readonly view: Container;
  setTheme(theme: FieldTheme): void;
  /**
   * Lays one shape's shadow: the shape's centre and pixels per unit, the side of its poster square, its roll, and
   * how high it stands off the surface, 0 lying on it (no shadow) and 1 where the poster's clay stands
   */
  cast(index: number, x: number, y: number, radius: number, size: number, roll: number, height: number): void;
  destroy(): void;
}

/** A kind's flat outline, blurred: drawn off the canvas so that only the shadow it casts lands on it */
function createShadowTexture(kind: ShapeKind): Texture {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const scale = TEXTURE_SIZE / 2 / TEXTURE_REACH;

  canvas.width = TEXTURE_SIZE;
  canvas.height = TEXTURE_SIZE;
  if (context) {
    context.shadowColor = '#fff';
    context.shadowBlur = BLUR * scale * 2;
    context.shadowOffsetX = TEXTURE_SIZE;
    context.setTransform(scale, 0, 0, scale, -TEXTURE_SIZE / 2, TEXTURE_SIZE / 2);
    context.fill(new Path2D(SILHOUETTES[kind]), 'evenodd');
  }

  return Texture.from(canvas);
}

/**
 * The soft shadow under each shape, painted on the backdrop: the shape's outline, blurred, dropped straight down
 * as far as its size and height ask. The same shadow the site's clay images cast, so a poster image hands over to
 * its live shape without the shadow moving.
 */
export function createShadows(kinds: readonly ShapeKind[], theme: FieldTheme): Shadows {
  const view = new Container();
  const textures = new Map<ShapeKind, Texture>();
  const sprites = kinds.map((kind) => {
    const texture = textures.get(kind) ?? createShadowTexture(kind);
    const sprite = new Sprite({ texture, anchor: 0.5, visible: false });

    textures.set(kind, texture);
    view.addChild(sprite);

    return sprite;
  });
  let shade = SHADE[theme];

  return {
    view,
    setTheme(next: FieldTheme) {
      shade = SHADE[next];
      for (const sprite of sprites) sprite.tint = shade.color;
    },
    cast(index, x, y, radius, size, roll, height) {
      const sprite = sprites[index];

      sprite.visible = height > 0.01;
      if (!sprite.visible) return;
      sprite.position.set(x, y + (shade.drop + shade.dropBySize * size) * height);
      sprite.scale.set(((radius * TEXTURE_REACH * 2) / TEXTURE_SIZE) * (1 + SPREAD * (height - 1)));
      sprite.rotation = -roll;
      sprite.alpha = shade.alpha * Math.min(1, height * 2) * (1 - THIN * Math.max(0, height - 1));
    },
    destroy() {
      for (const texture of textures.values()) texture.destroy(true);
    },
  };
}
