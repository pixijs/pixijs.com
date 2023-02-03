---
id: "pixi_assets.Resolver"
title: "Class: Resolver"
sidebar_label: "Resolver"
custom_edit_url: null
---

[@pixi/assets](../modules/pixi_assets.md).Resolver

A class that is responsible for resolving mapping asset URLs to keys.
At its most basic it can be used for Aliases:

```js
resolver.add('foo', 'bar');
resolver.resolveUrl('foo') // => 'bar'
```

It can also be used to resolve the most appropriate asset for a given URL:

```js
resolver.prefer({
    params: {
        format: 'webp',
        resolution: 2,
    }
});

resolver.add('foo', ['bar@2x.webp', 'bar@2x.png', 'bar.webp', 'bar.png']);

resolver.resolveUrl('foo') // => 'bar@2x.webp'
```
Other features include:
- Ability to process a manifest file to get the correct understanding of how to resolve all assets
- Ability to add custom parsers for specific file types
- Ability to add custom prefer rules

This class only cares about the URL, not the loading of the asset itself.

It is not intended that this class is created by developers - its part of the Asset class
This is the third major system of PixiJS' main Assets class

**`Memberof`**

PIXI

## Constructors

### constructor

• **new Resolver**()

## Accessors

### basePath

• `get` **basePath**(): `string`

#### Returns

`string`

#### Defined in

[pixijs/packages/assets/src/resolver/Resolver.ts:165](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/Resolver.ts#L165)

• `set` **basePath**(`basePath`): `void`

Set the base path to prepend to all urls when resolving

**`Example`**

```ts
resolver.basePath = 'https://home.com/';
resolver.add('foo', 'bar.ong');
resolver.resolveUrl('foo', 'bar.png'); // => 'https://home.com/bar.png'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `basePath` | `string` | the base path to use |

#### Returns

`void`

#### Defined in

[pixijs/packages/assets/src/resolver/Resolver.ts:160](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/Resolver.ts#L160)

___

### parsers

• `get` **parsers**(): [`ResolveURLParser`](../interfaces/pixi_assets.ResolveURLParser.md)[]

All the active URL parsers that help the parser to extract information and create
an asset object-based on parsing the URL itself.

Can be added using the extensions API

**`Example`**

```ts
resolver.add('foo', [
    {
        resolution: 2,
        format: 'png',
        src: 'image@2x.png',
    },
    {
        resolution:1,
        format:'png',
        src: 'image.png',
    },
]);

// With a url parser the information such as resolution and file format could extracted from the url itself:
extensions.add({
    extension: ExtensionType.ResolveParser,
    test: loadTextures.test, // test if url ends in an image
    parse: (value: string) =>
    ({
        resolution: parseFloat(settings.RETINA_PREFIX.exec(value)?.[1] ?? '1'),
        format: value.split('.').pop(),
        src: value,
    }),
});

// Now resolution and format can be extracted from the url
resolver.add('foo', [
    'image@2x.png',
    'image.png',
]);
```

#### Returns

[`ResolveURLParser`](../interfaces/pixi_assets.ResolveURLParser.md)[]

#### Defined in

[pixijs/packages/assets/src/resolver/Resolver.ts:228](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/Resolver.ts#L228)

___

### rootPath

• `get` **rootPath**(): `string`

#### Returns

`string`

#### Defined in

[pixijs/packages/assets/src/resolver/Resolver.ts:186](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/Resolver.ts#L186)

• `set` **rootPath**(`rootPath`): `void`

Set the root path for root-relative URLs. By default the `basePath`'s root is used. If no `basePath` is set, then the
default value for browsers is `window.location.origin`

**`Example`**

```ts
// Application hosted on https://home.com/some-path/index.html
resolver.basePath = 'https://home.com/some-path/';
resolver.rootPath = 'https://home.com/';
resolver.add('foo', '/bar.png');
resolver.resolveUrl('foo', '/bar.png'); // => 'https://home.com/bar.png'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rootPath` | `string` | the root path to use |

#### Returns

`void`

#### Defined in

[pixijs/packages/assets/src/resolver/Resolver.ts:181](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/Resolver.ts#L181)

## Methods

### add

▸ **add**(`keysIn`, `assetsIn`, `data?`): `void`

Tells the resolver what keys are associated with witch asset.
The most important thing the resolver does

**`Example`**

```ts
// Single key, single asset:
resolver.add('foo', 'bar.png');
resolver.resolveUrl('foo') // => 'bar.png'

// Multiple keys, single asset:
resolver.add(['foo', 'boo'], 'bar.png');
resolver.resolveUrl('foo') // => 'bar.png'
resolver.resolveUrl('boo') // => 'bar.png'

// Multiple keys, multiple assets:
resolver.add(['foo', 'boo'], ['bar.png', 'bar.webp']);
resolver.resolveUrl('foo') // => 'bar.png'

// Add custom data attached to the resolver
Resolver.add(
    'bunnyBooBooSmooth',
    'bunny{png,webp}',
    { scaleMode:SCALE_MODES.NEAREST }, // Base texture options
);

resolver.resolve('bunnyBooBooSmooth') // => { src: 'bunny.png', data: { scaleMode: SCALE_MODES.NEAREST } }
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keysIn` | `string` \| `string`[] | The keys to map, can be an array or a single key |
| `assetsIn` | `string` \| [`ResolveAsset`](../interfaces/pixi_assets.ResolveAsset.md) \| (`string` \| [`ResolveAsset`](../interfaces/pixi_assets.ResolveAsset.md))[] | The assets to associate with the key(s) |
| `data?` | `unknown` | The data that will be attached to the object that resolved object. |

#### Returns

`void`

#### Defined in

[pixijs/packages/assets/src/resolver/Resolver.ts:374](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/Resolver.ts#L374)

___

### addBundle

▸ **addBundle**(`bundleId`, `assets`): `void`

This adds a bundle of assets in one go so that you can resolve them as a group.
For example you could add a bundle for each screen in you pixi app

**`Example`**

```ts
resolver.addBundle('animals', {
    bunny: 'bunny.png',
    chicken: 'chicken.png',
    thumper: 'thumper.png',
});

const resolvedAssets = await resolver.resolveBundle('animals');
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bundleId` | `string` | The id of the bundle to add |
| `assets` | [`ResolverAssetsObject`](../modules/pixi_assets.md#resolverassetsobject) \| [`ResolverAssetsArray`](../modules/pixi_assets.md#resolverassetsarray) | A record of the asset or assets that will be chosen from when loading via the specified key |

#### Returns

`void`

#### Defined in

[pixijs/packages/assets/src/resolver/Resolver.ts:301](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/Resolver.ts#L301)

___

### addManifest

▸ **addManifest**(`manifest`): `void`

Add a manifest to the asset resolver. This is a nice way to add all the asset information in one go.
generally a manifest would be built using a tool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `manifest` | [`ResolverManifest`](../modules/pixi_assets.md#resolvermanifest) | the manifest to add to the resolver |

#### Returns

`void`

#### Defined in

[pixijs/packages/assets/src/resolver/Resolver.ts:270](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/Resolver.ts#L270)

___

### prefer

▸ **prefer**(`...preferOrders`): `void`

Let the resolver know which assets you prefer to use when resolving assets.
Multiple prefer user defined rules can be added.

**`Example`**

```ts
resolver.prefer({
    // first look for something with the correct format, and then then correct resolution
    priority: ['format', 'resolution'],
    params:{
        format:'webp', // prefer webp images
        resolution: 2, // prefer a resolution of 2
    }
})
resolver.add('foo', ['bar@2x.webp', 'bar@2x.png', 'bar.webp', 'bar.png']);
resolver.resolveUrl('foo') // => 'bar@2x.webp'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...preferOrders` | [`PreferOrder`](../interfaces/pixi_assets.PreferOrder.md)[] | the prefer options |

#### Returns

`void`

#### Defined in

[pixijs/packages/assets/src/resolver/Resolver.ts:136](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/Resolver.ts#L136)

___

### reset

▸ **reset**(): `void`

Used for testing, this resets the resolver to its initial state

#### Returns

`void`

#### Defined in

[pixijs/packages/assets/src/resolver/Resolver.ts:234](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/Resolver.ts#L234)

___

### resolve

▸ **resolve**(`keys`): [`ResolveAsset`](../interfaces/pixi_assets.ResolveAsset.md) \| `Record`<`string`, [`ResolveAsset`](../interfaces/pixi_assets.ResolveAsset.md)\>

Resolves each key in the list to an asset object.
Another key function of the resolver! After adding all the various key/asset pairs. this will run the logic
of finding which asset to return based on any preferences set using the `prefer` function
by default the same key passed in will be returned if nothing is matched by the resolver.

**`Example`**

```ts
resolver.add('boo', 'bunny.png');

resolver.resolve('boo') // => { src: 'bunny.png' }

// Will return the same string as no key was added for this value..
resolver.resolve('another-thing.png') // => { src: 'another-thing.png' }
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keys` | `string` \| `string`[] | key or keys to resolve |

#### Returns

[`ResolveAsset`](../interfaces/pixi_assets.ResolveAsset.md) \| `Record`<`string`, [`ResolveAsset`](../interfaces/pixi_assets.ResolveAsset.md)\>

- the resolve asset or a hash of resolve assets for each key specified

#### Defined in

[pixijs/packages/assets/src/resolver/Resolver.ts:572](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/Resolver.ts#L572)

___

### resolveBundle

▸ **resolveBundle**(`bundleIds`): `Record`<`string`, [`ResolveAsset`](../interfaces/pixi_assets.ResolveAsset.md)\> \| `Record`<`string`, `Record`<`string`, [`ResolveAsset`](../interfaces/pixi_assets.ResolveAsset.md)\>\>

If the resolver has had a manifest set via setManifest, this will return the assets urls for
a given bundleId or bundleIds.

**`Example`**

```ts
// Manifest Example
const manifest = {
    bundles: [
        {
            name: 'load-screen',
            assets: [
                {
                    name: 'background',
                    srcs: 'sunset.png',
                },
                {
                    name: 'bar',
                    srcs: 'load-bar.{png,webp}',
                },
            ],
        },
        {
            name: 'game-screen',
            assets: [
                {
                    name: 'character',
                    srcs: 'robot.png',
                },
                {
                    name: 'enemy',
                    srcs: 'bad-guy.png',
                },
            ],
        },
    ]
};

resolver.setManifest(manifest);
const resolved = resolver.resolveBundle('load-screen');
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bundleIds` | `string` \| `string`[] | The bundle ids to resolve |

#### Returns

`Record`<`string`, [`ResolveAsset`](../interfaces/pixi_assets.ResolveAsset.md)\> \| `Record`<`string`, `Record`<`string`, [`ResolveAsset`](../interfaces/pixi_assets.ResolveAsset.md)\>\>

All the bundles assets or a hash of assets for each bundle specified

#### Defined in

[pixijs/packages/assets/src/resolver/Resolver.ts:500](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/Resolver.ts#L500)

___

### resolveUrl

▸ **resolveUrl**(`key`): `string` \| `Record`<`string`, `string`\>

Does exactly what resolve does, but returns just the URL rather than the whole asset object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` \| `string`[] | The key or keys to resolve |

#### Returns

`string` \| `Record`<`string`, `string`\>

- The URLs associated with the key(s)

#### Defined in

[pixijs/packages/assets/src/resolver/Resolver.ts:538](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/Resolver.ts#L538)

___

### setBundleIdentifier

▸ **setBundleIdentifier**(`bundleIdentifier`): `void`

Override how the resolver deals with generating bundle ids.
must be called before any bundles are added

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bundleIdentifier` | `BundleIdentifierOptions` | the bundle identifier options |

#### Returns

`void`

#### Defined in

[pixijs/packages/assets/src/resolver/Resolver.ts:107](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/Resolver.ts#L107)

___

### setDefaultSearchParams

▸ **setDefaultSearchParams**(`searchParams`): `void`

Sets the default URL search parameters for the URL resolver. The urls can be specified as a string or an object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `searchParams` | `string` \| `Record`<`string`, `unknown`\> | the default url parameters to append when resolving urls |

#### Returns

`void`

#### Defined in

[pixijs/packages/assets/src/resolver/Resolver.ts:249](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/Resolver.ts#L249)
