import { Application, Container, EventBoundary, Graphics, Matrix, Rectangle, Sprite, Text } from 'pixi.js';

// This example shows how you can setup a nested boundary to propagate events
// into a disjoint scene graph. Here, a camera is used to project an different
// world onto the canvas.

// A projector renders it's content using projection. The transforms in
// the contents scene graph don't change if you move the camera. To achieve
// this, the content is not added as a "child" to the projector; however, this
// means events won't propagate into the content by default.
//
// To solve this, we nest our own EventBoundary, and connect it using
// addEventListener!
class Projector extends Container
{
    constructor()
    {
        super();

        // The content root to be rendered by this camera.
        this.content = new Container();

        // Temporary matrix to store the original projection transform.
        this.originalTransform = new Matrix();

        // The event boundary that'll map events downstream into the content
        // scene.
        this.boundary = new EventBoundary(this.content);

        // Override copyMouseData to apply inverse worldTransform on
        // global coords
        this.boundary.copyMouseData = (from, to) =>
        {
            // Apply default implementation first
            EventBoundary.prototype.copyMouseData.call(this.boundary, from, to);

            // Then bring global coords into content's world
            this.worldTransform.applyInverse(to.global, to.global);
        };

        // Propagate these events down into the content's scene graph!
        ['pointerdown', 'pointerup', 'pointermove', 'pointerover', 'pointerout', 'wheel'].forEach((event) =>
        {
            this.addEventListener(event, (e) => this.boundary.mapEvent(e));
        });

        this.eventMode = 'static';
    }

    // Pass through cursor
    get cursor()
    {
        return this.boundary.cursor;
    }

    // eslint-disable-next-line class-methods-use-this
    set cursor(value)
    {
        throw new Error('The camera\'s cursor is derived from its content!');
    }

    // Pass through calculateBounds
    calculateBounds()
    {
        const contentBounds = this.content.getBounds();

        this._bounds.addFrameMatrix(
            this.worldTransform,
            contentBounds.x,
            contentBounds.y,
            contentBounds.width,
            contentBounds.height,
        );
    }

    // Pass through containsPoint
    containsPoint(point)
    {
        return !!this.boundary.hitTest(point.x, point.y);
    }

    // Render content with projection
    render(renderer)
    {
        renderer.batch.flush();

        const projectionSystem = renderer.projection;
        const renderTextureSystem = renderer.renderTexture;

        projectionSystem.transform = projectionSystem.transform || new Matrix();
        projectionSystem.transform.copyTo(this.originalTransform);
        projectionSystem.transform.append(this.worldTransform);
        projectionSystem.update(null, null, 1, !renderTextureSystem.current);

        this.content.render(renderer);

        renderer.batch.flush();

        projectionSystem.transform.copyFrom(this.originalTransform);
        projectionSystem.update(null, null, 1, !renderTextureSystem.current);
    }

    // updateTransform also updates content's transform
    updateTransform()
    {
        super.updateTransform();

        this.content.enableTempParent();
        this.content.updateTransform();
        this.content.disableTempParent(null);
    }
}

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ antialias: true, background: '#1099bb', resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // The projector
    const projector = app.stage.addChild(new Projector());

    // Add coordinate axes!
    projector.content.addChild(
        new Graphics()
            .moveTo(0, -300)
            .lineTo(0, 600)
            .moveTo(-100, 0)
            .lineTo(700, 0)
            .stroke({ color: 0, alpha: 0.2, width: 2 }),
    );

    // Construct the star Graphics
    const stars = [1, 2, 3].map((i) =>
        new Graphics().star(0, 0, 18 / i, (100 * i) / 2).fill({ color: 0xffffff, alpha: 0.75 }),
    );

    // Place the stars
    stars[0].x = 0;
    stars[1].x = 200;
    stars[2].x = 500;

    // Add stars to the projector
    projector.content.addChild(...stars);

    // Make projection x+100, y+300
    projector.x = 100;
    projector.y = 300;
    projector.content.hitArea = new Rectangle(-100, -300, app.screen.width, app.screen.height);
    // Make hit-area cover the whole screen so we can capture
    // pointermove everywhere!
    projector.hitArea = projector.content.hitArea;
    projector.content.eventMode = 'static';

    // Make stars interactive & add wheel handlers
    stars.forEach((star) =>
    {
        // Make star interactive
        star.eventMode = 'static';

        // Set initial cursor
        star.cursor = 'zoom-in';

        // Add wheel rotation feedback
        star.addEventListener('wheel', (e) =>
        {
            const scroll = Math.sign(e.deltaY) * Math.min(15, Math.abs(e.deltaY));

            star.rotation += scroll / 100;
        });

        // Add click zoom-in/zoom-out handler
        star.addEventListener('click', (e) =>
        {
            if (star.scale.x === 1)
            {
                star.scale.set(1.33);
                star.cursor = 'zoom-out';
            }
            else
            {
                star.scale.set(1);
                star.cursor = 'zoom-in';
            }
        });
    });

    const coordinates = new Text({
        text: 'Global: (0, 0)\nScreen: (0, 0)',
        style: {
            fontSize: 16,
            fontFamily: 'Roboto',
            fill: '#272d37',
        },
    });

    coordinates.x = 110;
    coordinates.y = 550;

    app.stage.addChild(coordinates);

    projector.content.addEventListener('pointermove', (e) =>
    {
        const global = `(${e.global.x | 0}, ${e.global.y | 0})`;
        const screen = `(${e.screen.x | 0}, ${e.screen.y | 0})`;

        coordinates.text = `Global: ${global}\nScreen: ${screen}`;
    });

    const description = new Text({
        text:
            'The (0, 0) world coordinates for the content is located at the center of the first star!'
            + '\n  * Mouse wheel over stars to rotate them'
            + '\n  * Click to zoom in or out',
        style: {
            fontSize: 16,
            fontFamily: 'Roboto',
            fill: '#272d37',
        },
    });

    description.position.set(110, 12);

    app.stage.addChild(description);
})();
