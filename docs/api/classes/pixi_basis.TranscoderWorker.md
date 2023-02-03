---
id: "pixi_basis.TranscoderWorker"
title: "Class: TranscoderWorker"
sidebar_label: "TranscoderWorker"
custom_edit_url: null
---

[@pixi/basis](../modules/pixi_basis.md).TranscoderWorker

Worker class for transcoding *.basis files in background threads.

To enable asynchronous transcoding, you need to provide the URL to the basis_universal transcoding
library.

**`Memberof`**

PIXI.BasisParser

## Constructors

### constructor

• **new TranscoderWorker**()

#### Defined in

[pixijs/packages/basis/src/TranscoderWorker.ts:70](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/TranscoderWorker.ts#L70)

## Properties

### isInit

• **isInit**: `boolean`

#### Defined in

[pixijs/packages/basis/src/TranscoderWorker.ts:33](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/TranscoderWorker.ts#L33)

___

### load

• **load**: `number`

#### Defined in

[pixijs/packages/basis/src/TranscoderWorker.ts:34](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/TranscoderWorker.ts#L34)

___

### requests

• **requests**: `Object` = `{}`

#### Index signature

▪ [id: `number`]: { `reject`: () => `void` ; `resolve`: (`data`: `ITranscodeResponse`) => `void`  }

#### Defined in

[pixijs/packages/basis/src/TranscoderWorker.ts:35](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/TranscoderWorker.ts#L35)

___

### bindingURL

▪ `Static` **bindingURL**: `string`

URL for the script containing the basis_universal library.

#### Defined in

[pixijs/packages/basis/src/TranscoderWorker.ts:21](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/TranscoderWorker.ts#L21)

___

### jsSource

▪ `Static` **jsSource**: `string`

#### Defined in

[pixijs/packages/basis/src/TranscoderWorker.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/TranscoderWorker.ts#L22)

___

### onTranscoderInitialized

▪ `Static` **onTranscoderInitialized**: `Promise`<`void`\>

a promise that when reslved means the transcoder is ready to be used

#### Defined in

[pixijs/packages/basis/src/TranscoderWorker.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/TranscoderWorker.ts#L28)

___

### wasmSource

▪ `Static` **wasmSource**: `ArrayBuffer`

#### Defined in

[pixijs/packages/basis/src/TranscoderWorker.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/TranscoderWorker.ts#L23)

## Accessors

### workerURL

• `Static` `get` **workerURL**(): `string`

Generated URL for the transcoder worker script.

#### Returns

`string`

#### Defined in

[pixijs/packages/basis/src/TranscoderWorker.ts:44](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/TranscoderWorker.ts#L44)

## Methods

### initAsync

▸ **initAsync**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

a promise that is resolved when the web-worker is initialized

#### Defined in

[pixijs/packages/basis/src/TranscoderWorker.ts:91](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/TranscoderWorker.ts#L91)

___

### transcodeAsync

▸ **transcodeAsync**(`basisData`, `rgbaFormat`, `rgbFormat`): `Promise`<`ITranscodeResponse`\>

Creates a promise that will resolve when the transcoding of a *.basis file is complete.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `basisData` | `Uint8Array` | *.basis file contents |
| `rgbaFormat` | `BASIS_FORMATS` | transcoding format for RGBA files |
| `rgbFormat` | `BASIS_FORMATS` | transcoding format for RGB files |

#### Returns

`Promise`<`ITranscodeResponse`\>

a promise that is resolved with the transcoding response of the web-worker

#### Defined in

[pixijs/packages/basis/src/TranscoderWorker.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/TranscoderWorker.ts#L103)

___

### loadTranscoder

▸ `Static` **loadTranscoder**(`jsURL`, `wasmURL`): `Promise`<[`void`, `void`]\>

Loads the transcoder source code

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jsURL` | `string` | URL to the javascript basis transcoder |
| `wasmURL` | `string` | URL to the wasm basis transcoder |

#### Returns

`Promise`<[`void`, `void`]\>

A promise that resolves when both the js and wasm transcoders have been loaded.

#### Defined in

[pixijs/packages/basis/src/TranscoderWorker.ts:174](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/TranscoderWorker.ts#L174)

___

### setTranscoder

▸ `Static` **setTranscoder**(`jsSource`, `wasmSource`): `void`

Set the transcoder source code directly

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jsSource` | `string` | source for the javascript basis transcoder |
| `wasmSource` | `ArrayBuffer` | source for the wasm basis transcoder |

#### Returns

`void`

#### Defined in

[pixijs/packages/basis/src/TranscoderWorker.ts:197](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/TranscoderWorker.ts#L197)
