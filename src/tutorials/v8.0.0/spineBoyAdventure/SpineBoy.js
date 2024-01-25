import { Spine } from '@pixi/spine-pixi';
import { Container } from 'pixi.js';

const animationMap = {
    idle: {
        name: 'idle',
        loop: true,
        mixDuration: 0.2,
    },
    walk: {
        name: 'walk',
        loop: true,
        mixDuration: 0.2,
    },
    run: {
        name: 'run',
        loop: true,
        mixDuration: 0.2,
    },
    jump: {
        name: 'jump',
        loop: false,
        mixDuration: 0.2,
        timeScale: 1.5,
    },
    hover: {
        name: 'hoverboard',
        loop: true,
        mixDuration: 0.2,
    },
    spawn: {
        name: 'portal',
        loop: false,
        mixDuration: 0.2,
    },
};

export class SpineBoy
{
    constructor()
    {
        this.state = {
            walk: false,
            run: false,
            hover: false,
            jump: false,
        };

        this.view = new Container();
        this.directionalView = new Container();

        this.spine = Spine.from({
            skeleton: 'spineSkeleton',
            atlas: 'spineAtlas',
        });

        this.spine.scale.set(0.25);

        this.directionalView.addChild(this.spine);
        this.view.addChild(this.directionalView);
    }

    spawn()
    {
        const { name } = animationMap.spawn;

        this.spine.state.setAnimation(0, name);
    }

    playAnimation({ name, loop = false, track = 0, mixDuration = 0, timeScale = 1 })
    {
        if (this.currentAnimation === name) return;
        const trackEntry = name
            ? this.spine.state.setAnimation(track, name, loop)
            : this.spine.state.setEmptyAnimation(track, mixDuration);

        trackEntry.mixDuration = mixDuration;
        trackEntry.timeScale = timeScale;
    }

    queueAnimation({ name, loop = false, track = 0, mixDuration = 0, timeScale = 1, delay = 0 })
    {
        const trackEntry = name
            ? this.spine.state.addAnimation(track, name, loop, delay)
            : this.spine.state.addEmptyAnimation(track, mixDuration, delay);

        trackEntry.mixDuration = mixDuration;
    }

    update(time)
    {
        const delta = time.deltaTime;

        if (this.state.jump)
        {
            this.state.hover = false;
            this.playAnimation(animationMap.jump);
        }

        if (this.isAnimationPlaying(animationMap.jump)) return;

        if (this.state.hover) this.playAnimation(animationMap.hover);
        else if (this.state.run) this.playAnimation(animationMap.run);
        else if (this.state.walk) this.playAnimation(animationMap.walk);
        else this.playAnimation(animationMap.idle);
    }

    isSpawning()
    {
        return this.isAnimationPlaying(animationMap.spawn);
    }

    isAnimationPlaying({ name })
    {
        return this.currentAnimation === name && !this.spine.state.getCurrent(0).isComplete();
    }

    get currentAnimation()
    {
        return this.spine.state.getCurrent(0)?.animation.name;
    }

    get direction()
    {
        return this.directionalView.scale.x > 0 ? 1 : -1;
    }

    set direction(value)
    {
        this.directionalView.scale.x = value;
    }
}
