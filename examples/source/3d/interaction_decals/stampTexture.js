/** A bold ink seal with a transparent star cutout, the one texture every stamp shares */

import { CanvasSource, Texture } from 'pixi.js';

export function createStampTexture() {
  const source = new CanvasSource({
    width: 256,
    height: 256,
    autoGenerateMipmaps: true,
  });
  const ctx = source.context2D;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  for (let i = 0; i <= 96; i++) {
    const angle = (i / 96) * Math.PI * 2;
    const radius = 105 + Math.cos(angle * 12) * 5;

    ctx.lineTo(128 + Math.cos(angle) * radius, 128 + Math.sin(angle) * radius);
  }
  ctx.closePath();
  ctx.fill();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const radius = i % 2 === 0 ? 59 : 23;

    ctx.lineTo(128 + Math.cos(angle) * radius, 128 + Math.sin(angle) * radius);
  }
  ctx.closePath();
  ctx.fill();

  return new Texture({ source });
}
