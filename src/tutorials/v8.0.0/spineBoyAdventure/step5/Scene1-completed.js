import { Container, Sprite, Texture, TilingSprite } from 'pixi.js';

// Class for handling the environment.
export class Scene {
  constructor(width, height) {
    // Create a main view that holds all layers.
    this.view = new Container();

    // Create the stationary sky that fills the entire screen.
    this.sky = Sprite.from('sky');
    this.sky.anchor.set(0, 1);
    this.sky.width = width;
    this.sky.height = height;

    // Create textures for the background, mid-ground, and platform.
    const backgroundTexture = Texture.from('background');
    const midgroundTexture = Texture.from('midground');
    const platformTexture = Texture.from('platform');

    // Calculate the ideal platform height depending on the passed-in screen height.
    const maxPlatformHeight = platformTexture.height;
    const platformHeight = Math.min(maxPlatformHeight, height * 0.4);

    // Calculate the scale to be apply to all tiling textures for consistency.
    const scale = (this.scale = platformHeight / maxPlatformHeight);

    const baseOptions = {
      tileScale: { x: scale, y: scale },
      anchor: { x: 0, y: 1 },
      applyAnchorToTexture: true,
    };

    // Create the tiling sprite layers.
    this.background = new TilingSprite({
      texture: backgroundTexture,
      width,
      height: backgroundTexture.height * scale,
      ...baseOptions,
    });
    this.midground = new TilingSprite({
      texture: midgroundTexture,
      width,
      height: midgroundTexture.height * scale,
      ...baseOptions,
    });
    this.platform = new TilingSprite({
      texture: platformTexture,
      width,
      height: platformHeight,
      ...baseOptions,
    });

    // Calculate the floor height for external referencing.
    this.floorHeight = platformHeight * 0.43;

    // Position the backdrop layers.
    this.background.y = this.midground.y = -this.floorHeight;

    // Add all layers to the main view.
    this.view.addChild(this.sky, this.background, this.midground, this.platform);
  }
}
