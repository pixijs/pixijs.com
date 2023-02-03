---
id: "pixi_core.IAdapter"
title: "Interface: IAdapter"
sidebar_label: "IAdapter"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).IAdapter

This interface describes all the DOM dependent calls that Pixi makes throughout its codebase.
Implementations of this interface can be used to make sure Pixi will work in any environment,
such as browser, Web Workers, and Node.js.

**`Memberof`**

PIXI

## Properties

### createCanvas

• **createCanvas**: (`width?`: `number`, `height?`: `number`) => [`ICanvas`](pixi_core.ICanvas.md)

#### Type declaration

▸ (`width?`, `height?`): [`ICanvas`](pixi_core.ICanvas.md)

Returns a canvas object that can be used to create a webgl context.

##### Parameters

| Name | Type |
| :------ | :------ |
| `width?` | `number` |
| `height?` | `number` |

##### Returns

[`ICanvas`](pixi_core.ICanvas.md)

#### Defined in

[pixijs/packages/settings/src/adapter.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/adapter.ts#L13)

___

### fetch

• **fetch**: (`url`: `RequestInfo`, `options?`: `RequestInit`) => `Promise`<`Response`\>

#### Type declaration

▸ (`url`, `options?`): `Promise`<`Response`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `RequestInfo` |
| `options?` | `RequestInit` |

##### Returns

`Promise`<`Response`\>

#### Defined in

[pixijs/packages/settings/src/adapter.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/adapter.ts#L23)

___

### getBaseUrl

• **getBaseUrl**: () => `string`

#### Type declaration

▸ (): `string`

Returns the current base URL For browser environments this is either the document.baseURI or window.location.href

##### Returns

`string`

#### Defined in

[pixijs/packages/settings/src/adapter.ts:21](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/adapter.ts#L21)

___

### getCanvasRenderingContext2D

• **getCanvasRenderingContext2D**: () => { `prototype`: [`ICanvasRenderingContext2D`](pixi_core.ICanvasRenderingContext2D.md)  }

#### Type declaration

▸ (): `Object`

Returns a 2D rendering context.

##### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `prototype` | [`ICanvasRenderingContext2D`](pixi_core.ICanvasRenderingContext2D.md) |

#### Defined in

[pixijs/packages/settings/src/adapter.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/adapter.ts#L15)

___

### getFontFaceSet

• **getFontFaceSet**: () => `FontFaceSet`

#### Type declaration

▸ (): `FontFaceSet`

##### Returns

`FontFaceSet`

#### Defined in

[pixijs/packages/settings/src/adapter.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/adapter.ts#L22)

___

### getNavigator

• **getNavigator**: () => { `userAgent`: `string`  }

#### Type declaration

▸ (): `Object`

Returns a partial implementation of the browsers window.navigator

##### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `userAgent` | `string` |

#### Defined in

[pixijs/packages/settings/src/adapter.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/adapter.ts#L19)

___

### getWebGLRenderingContext

• **getWebGLRenderingContext**: () => () => `WebGLRenderingContext`

#### Type declaration

▸ (): () => `WebGLRenderingContext`

Returns a WebGL rendering context.

##### Returns

`fn`

• **new __type**(): `WebGLRenderingContext`

##### Returns

`WebGLRenderingContext`

#### Defined in

[pixijs/packages/settings/src/adapter.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/adapter.ts#L17)

___

### parseXML

• **parseXML**: (`xml`: `string`) => `Document`

#### Type declaration

▸ (`xml`): `Document`

##### Parameters

| Name | Type |
| :------ | :------ |
| `xml` | `string` |

##### Returns

`Document`

#### Defined in

[pixijs/packages/settings/src/adapter.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/adapter.ts#L24)
