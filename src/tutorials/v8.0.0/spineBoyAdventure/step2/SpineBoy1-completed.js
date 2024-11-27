import { Spine } from '@esotericsoftware/spine-pixi-v8';
import { Container } from 'pixi.js';

// Class for handling the character Spine and its animations.
export class SpineBoy
{
    constructor()
    {
        // Create the main view.
        this.view = new Container();

        // Create the Spine instance using the preloaded Spine asset aliases.
        this.spine = Spine.from({
            skeleton: 'spineSkeleton',
            atlas: 'spineAtlas',
        });

        // Add the spine to the main view.
        this.view.addChild(this.spine);
    }
}
