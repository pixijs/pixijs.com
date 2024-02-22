import collisionDetection from '!!raw-loader!./advanced/collisionDetection.js';
import mouseTrail from '!!raw-loader!./advanced/mouseTrail.js';
import scratchCard from '!!raw-loader!./advanced/scratchCard.js';
import screenShot from '!!raw-loader!./advanced/screenShot.js';
import slots from '!!raw-loader!./advanced/slots.js';
import spinners from '!!raw-loader!./advanced/spinners.js';
import starWarp from '!!raw-loader!./advanced/starWarp.js';

import async from '!!raw-loader!./assets/async.js';
import background from '!!raw-loader!./assets/background.js';
import bundle from '!!raw-loader!./assets/bundle.js';
import multiple from '!!raw-loader!./assets/multiple.js';
import promise from '!!raw-loader!./assets/promise.js';

import blendModes from '!!raw-loader!./basic/blendModes.js';
import cacheAsBitmap from '!!raw-loader!./basic/cacheAsBitmap.js';
import container from '!!raw-loader!./basic/container.js';
import particleContainer from '!!raw-loader!./basic/particleContainer.js';
import simplePlane from '!!raw-loader!./basic/simplePlane.js';
import tinting from '!!raw-loader!./basic/tinting.js';
import transparentBackground from '!!raw-loader!./basic/transparentBackground.js';

import click from '!!raw-loader!./events/click.js';
import customHitarea from '!!raw-loader!./events/customHitarea.js';
import customMouseIcon from '!!raw-loader!./events/customMouseIcon.js';
import dragging from '!!raw-loader!./events/dragging.js';
import hitTestingWithSpatialHash from '!!raw-loader!./events/hitTestingWithSpatialHash.js';
import interactivity from '!!raw-loader!./events/interactivity.js';
import logger from '!!raw-loader!./events/logger.js';
import nestedBoundaryWithProjection from '!!raw-loader!./events/nestedBoundaryWithProjection.js';
import pointerTracker from '!!raw-loader!./events/pointerTracker.js';
import slider from '!!raw-loader!./events/slider.js';

import custom from '!!raw-loader!./filtersAdvanced/custom.js';
import mouseBlending from '!!raw-loader!./filtersAdvanced/mouseBlending.js';
import shaderToyFilterRenderTexture from '!!raw-loader!./filtersAdvanced/shaderToyFilterRenderTexture.js';

import blur from '!!raw-loader!./filtersBasic/blur.js';
import colorMatrix from '!!raw-loader!./filtersBasic/colorMatrix.js';
import displacementMapCrawlies from '!!raw-loader!./filtersBasic/displacementMapCrawlies.js';
import displacementMapFlag from '!!raw-loader!./filtersBasic/displacementMapFlag.js';

import advanced from '!!raw-loader!./graphics/advanced.js';
import dynamic from '!!raw-loader!./graphics/dynamic.js';
import simple from '!!raw-loader!./graphics/simple.js';

import filter from '!!raw-loader!./masks/filter.js';
import graphics from '!!raw-loader!./masks/graphics.js';
import sprite from '!!raw-loader!./masks/sprite.js';

import instancedGeometry from '!!raw-loader!./meshAndShaders/instancedGeometry.js';
import interleavingGeometry from '!!raw-loader!./meshAndShaders/interleavingGeometry.js';
import mergingGeometry from '!!raw-loader!./meshAndShaders/mergingGeometry.js';
import multiPassShaderGeneratedMesh from '!!raw-loader!./meshAndShaders/multiPassShaderGeneratedMesh.js';
import shaderToyMesh from '!!raw-loader!./meshAndShaders/shaderToyMesh.js';
import sharedShader from '!!raw-loader!./meshAndShaders/sharedShader.js';
import sharingGeometry from '!!raw-loader!./meshAndShaders/sharingGeometry.js';
import texturedMeshAdvanced from '!!raw-loader!./meshAndShaders/texturedMeshAdvanced.js';
import texturedMeshBasic from '!!raw-loader!./meshAndShaders/texturedMeshBasic.js';
import triangleColor from '!!raw-loader!./meshAndShaders/triangleColor.js';
import triangleTextured from '!!raw-loader!./meshAndShaders/triangleTextured.js';
import triangle from '!!raw-loader!./meshAndShaders/triangle.js';
import uniforms from '!!raw-loader!./meshAndShaders/uniforms.js';

import offscreenCanvasBasic from '!!raw-loader!./offscreenCanvas/basic.js';
import webWorker from '!!raw-loader!./offscreenCanvas/webWorker.js';

import animatedSpriteAnimationSpeed from '!!raw-loader!./sprite/animatedSpriteAnimationSpeed.js';
import animatedSpriteExplosion from '!!raw-loader!./sprite/animatedSpriteExplosion.js';
import animatedSpriteJet from '!!raw-loader!./sprite/animatedSpriteJet.js';
import spriteBasic from '!!raw-loader!./sprite/basic.js';
import textureSwap from '!!raw-loader!./sprite/textureSwap.js';
import tilingSprite from '!!raw-loader!./sprite/tilingSprite.js';
import video from '!!raw-loader!./sprite/video.js';

import bitmapText from '!!raw-loader!./text/bitmapText.js';
import fromFont from '!!raw-loader!./text/fromFont.js';
import pixiText from '!!raw-loader!./text/pixiText.js';
import webFont from '!!raw-loader!./text/webFont.js';

import gradientBasic from '!!raw-loader!./textures/gradientBasic.js';
import gradientResource from '!!raw-loader!./textures/gradientResource.js';
import renderTextureAdvanced from '!!raw-loader!./textures/renderTextureAdvanced.js';
import renderTextureBasic from '!!raw-loader!./textures/renderTextureBasic.js';
import textureRotate from '!!raw-loader!./textures/textureRotate.js';
import type { Option } from '@site/src/components/Select';

// Defines order of examples in documentation and playground dropdown, it's defined
// separately here so it can be used in runtime code and in the md generation script
import examplesData from './examplesData.json';
import { camelCaseToSentenceCase } from '@site/src/utils/utils';
import type { CategoryDataType, ExampleDataEntry, ExamplesDataType, ExamplesJsonType, ExamplesSourceType } from '..';

const examplesSource: ExamplesSourceType = {
    basic: {
        blendModes,
        cacheAsBitmap,
        container,
        particleContainer,
        simplePlane,
        tinting,
        transparentBackground,
    },
    sprite: {
        animatedSpriteAnimationSpeed,
        animatedSpriteExplosion,
        animatedSpriteJet,
        basic: spriteBasic,
        textureSwap,
        tilingSprite,
        video,
    },
    text: {
        bitmapText,
        fromFont,
        pixiText,
        webFont,
    },
    graphics: {
        advanced,
        dynamic,
        simple,
    },
    events: {
        click,
        customHitarea,
        customMouseIcon,
        dragging,
        hitTestingWithSpatialHash,
        interactivity,
        logger,
        nestedBoundaryWithProjection,
        pointerTracker,
        slider,
    },
    masks: {
        filter,
        graphics,
        sprite,
    },
    textures: {
        gradientBasic,
        gradientResource,
        renderTextureAdvanced,
        renderTextureBasic,
        textureRotate,
    },
    assets: {
        async,
        background,
        bundle,
        multiple,
        promise,
    },
    offscreenCanvas: {
        basic: offscreenCanvasBasic,
        webWorker,
    },
    filtersBasic: {
        blur,
        colorMatrix,
        displacementMapCrawlies,
        displacementMapFlag,
    },
    filtersAdvanced: {
        custom,
        mouseBlending,
        shaderToyFilterRenderTexture,
    },
    advanced: {
        collisionDetection,
        mouseTrail,
        scratchCard,
        screenShot,
        slots,
        spinners,
        starWarp,
    },
    meshAndShaders: {
        instancedGeometry,
        interleavingGeometry,
        mergingGeometry,
        multiPassShaderGeneratedMesh,
        shaderToyMesh,
        sharedShader,
        sharingGeometry,
        texturedMeshAdvanced,
        texturedMeshBasic,
        triangleColor,
        triangleTextured,
        triangle,
        uniforms,
    },
};

const normalizeExampleDataEntry = (categoryExample: ExampleDataEntry | string): Required<ExampleDataEntry> =>
{
    const defaults = {
        hide: false,
        usesWebWorkerLibrary: false,
    };

    if (typeof categoryExample === 'string')
    {
        return {
            ...defaults,
            name: categoryExample,
        };
    }

    return {
        ...defaults,
        ...categoryExample,
    };
};

const entries = Object.entries(examplesData as ExamplesJsonType).reduce(
    (directoryAcc, [categoryKey, categoryExamples]) => ({
        ...directoryAcc,
        [categoryKey]: categoryExamples.reduce((categoryAcc, categoryExampleOrString) =>
        {
            const categoryExample = normalizeExampleDataEntry(categoryExampleOrString);
            const { name: categoryName, hide, usesWebWorkerLibrary } = categoryExample;

            return {
                ...categoryAcc,
                [categoryName]: {
                    source: examplesSource[categoryKey][categoryName],
                    hide,
                    usesWebWorkerLibrary,
                },
            };
        }, {} as CategoryDataType),
    }),
    {} as ExamplesDataType,
);

const options = Object.entries(examplesData as ExamplesJsonType).map(([folderKey, folderEntries]) =>
{
    const options = folderEntries.reduce((acc, exampleDataEntry) =>
    {
        const { name: exampleKey, hide } = normalizeExampleDataEntry(exampleDataEntry);

        if (hide)
        {
            return acc;
        }

        return acc.concat({
            value: `${folderKey}.${exampleKey}`,
            label: camelCaseToSentenceCase(exampleKey),
        });
    }, [] as Option[]);

    return {
        label: camelCaseToSentenceCase(folderKey),
        options,
    };
});

export default { entries, options };
