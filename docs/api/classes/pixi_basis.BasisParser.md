---
id: "pixi_basis.BasisParser"
title: "Class: BasisParser"
sidebar_label: "BasisParser"
custom_edit_url: null
---

[@pixi/basis](../modules/pixi_basis.md).BasisParser

Loader plugin for handling BASIS supercompressed texture files.

To use this loader, you must bind the basis_universal WebAssembly transcoder. There are two ways of
doing this:

1. Adding a &lt;script&gt; tag to your HTML page to the transcoder bundle in this package, and serving
the WASM binary from the same location.

```html
<!-- Copy ./node_modules/@pixi/basis/assets/basis_.wasm into your assets directory
    as well, so it is served from the same folder as the JavaScript! -->
<script src="./node_modules/@pixi/basis/assets/basis_transcoder.js"></script>
```

NOTE: `basis_transcoder.js` expects the WebAssembly binary to be named `basis_transcoder.wasm`.
NOTE-2: This method supports transcoding on the main-thread. Only use this if you have 1 or 2 *.basis
files.

2. Loading the transcoder source from a URL.

```js
// Use this if you to use the default CDN url for @pixi/basis
BasisParser.loadTranscoder();

// Use this if you want to serve the transcoder on your own
BasisParser.loadTranscoder('./basis_transcoder.js', './basis_transcoder.wasm');
```

NOTE: This can only be used with web-workers.

**`Memberof`**

PIXI

**`Implements`**

## Constructors

### constructor

• **new BasisParser**()

## Properties

### TranscoderWorker

▪ `Static` **TranscoderWorker**: typeof [`TranscoderWorker`](pixi_basis.TranscoderWorker.md) = `TranscoderWorker`

#### Defined in

[pixijs/packages/basis/src/loader/BasisParser.ts:419](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/loader/BasisParser.ts#L419)

___

### basisBinding

▪ `Static` **basisBinding**: `BasisBinding`

#### Defined in

[pixijs/packages/basis/src/loader/BasisParser.ts:54](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/loader/BasisParser.ts#L54)

## Accessors

### TRANSCODER\_WORKER\_POOL\_LIMIT

• `Static` `get` **TRANSCODER_WORKER_POOL_LIMIT**(): `number`

#### Returns

`number`

#### Defined in

[pixijs/packages/basis/src/loader/BasisParser.ts:421](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/loader/BasisParser.ts#L421)

• `Static` `set` **TRANSCODER_WORKER_POOL_LIMIT**(`limit`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `limit` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/basis/src/loader/BasisParser.ts:426](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/loader/BasisParser.ts#L426)
