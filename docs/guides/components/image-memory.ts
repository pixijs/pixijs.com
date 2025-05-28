import { Application, Assets, Container, Sprite } from 'pixi.js';

(async () =>
{
    const app = new Application({ background: '#000000', resizeTo: window });

    await app.init();

    document.body.appendChild(app.canvas);

    const container = new Container();

    app.stage.addChild(container);

    const getAssetUrl = (number) => `https://picsum.photos/seed/wow_${number}_texture/2048/2048.webp`;
    const NUMBER_OF_TEXTURES = 45;

    const assetUrls = Array.from({ length: NUMBER_OF_TEXTURES }, (_, i) =>
        getAssetUrl(i + 1));

    assetUrls.forEach(async (url, i) =>
    {
        const texture = await Assets.load(url);
        const sprite = new Sprite(texture);

        sprite.setSize(100, 100);

        sprite.x = (i % 5) * 100;
        sprite.y = Math.floor(i / 5) * 100;
        container.addChild(sprite);
    });
})();
