import { Container, Sprite, Texture, TilingSprite } from 'pixi.js';

export class Scene
{
    constructor(width, height)
    {
        this.view = new Container();

        this.sky = Sprite.from('sky');
        this.sky.anchor.set(0, 1);
        this.sky.width = width;
        this.sky.height = height;

        const backgroundTexture = Texture.from('background');
        const midgroundTexture = Texture.from('midground');
        const platformTexture = Texture.from('platform');

        const maxPlatformHeight = platformTexture.height;
        const platformHeight = Math.min(maxPlatformHeight, height * 0.4);
        const scale = platformHeight / maxPlatformHeight;

        this.background = new TilingSprite({
            texture: backgroundTexture,
            width,
            height: backgroundTexture.height * scale,
            anchor: { x: 0, y: 1 },
            applyAnchorToTexture: true,
            tileScale: { x: scale, y: scale },
        });
        this.midground = new TilingSprite({
            texture: midgroundTexture,
            width,
            height: midgroundTexture.height * scale,
            anchor: { x: 0, y: 1 },
            applyAnchorToTexture: true,
            tileScale: { x: scale, y: scale },
        });
        this.platform = new TilingSprite({
            texture: platformTexture,
            width,
            height: platformHeight,
            anchor: { x: 0, y: 1 },
            applyAnchorToTexture: true,
            tileScale: { x: scale, y: scale },
        });

        this.floorHeight = platformHeight * 0.43;
        this.background.y = this.midground.y = -this.floorHeight;

        this.view.addChild(this.sky, this.background, this.midground, this.platform);
    }

    get positionX()
    {
        return this.platform.tilePosition.x;
    }

    set positionX(value)
    {
        this.background.tilePosition.x = value * 0.1;
        this.midground.tilePosition.x = value * 0.25;
        this.platform.tilePosition.x = value;
    }
}
