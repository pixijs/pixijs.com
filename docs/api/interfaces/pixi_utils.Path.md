---
id: "pixi_utils.Path"
title: "Interface: Path"
sidebar_label: "Path"
custom_edit_url: null
---

[@pixi/utils](../modules/pixi_utils.md).Path

## Properties

### basename

• **basename**: (`path`: `string`, `ext?`: `string`) => `string`

#### Type declaration

▸ (`path`, `ext?`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `ext?` | `string` |

##### Returns

`string`

#### Defined in

[pixijs/packages/utils/src/path.ts:146](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/path.ts#L146)

___

### delimiter

• **delimiter**: `string`

#### Defined in

[pixijs/packages/utils/src/path.ts:150](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/path.ts#L150)

___

### dirname

• **dirname**: (`path`: `string`) => `string`

#### Type declaration

▸ (`path`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

##### Returns

`string`

#### Defined in

[pixijs/packages/utils/src/path.ts:144](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/path.ts#L144)

___

### extname

• **extname**: (`path`: `string`) => `string`

#### Type declaration

▸ (`path`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

##### Returns

`string`

#### Defined in

[pixijs/packages/utils/src/path.ts:147](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/path.ts#L147)

___

### getProtocol

• **getProtocol**: (`path`: `string`) => `string`

#### Type declaration

▸ (`path`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

##### Returns

`string`

#### Defined in

[pixijs/packages/utils/src/path.ts:140](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/path.ts#L140)

___

### hasProtocol

• **hasProtocol**: (`path`: `string`) => `boolean`

#### Type declaration

▸ (`path`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

##### Returns

`boolean`

#### Defined in

[pixijs/packages/utils/src/path.ts:139](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/path.ts#L139)

___

### isAbsolute

• **isAbsolute**: (`path`: `string`) => `boolean`

#### Type declaration

▸ (`path`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

##### Returns

`boolean`

#### Defined in

[pixijs/packages/utils/src/path.ts:143](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/path.ts#L143)

___

### isDataUrl

• **isDataUrl**: (`path`: `string`) => `boolean`

#### Type declaration

▸ (`path`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

##### Returns

`boolean`

#### Defined in

[pixijs/packages/utils/src/path.ts:138](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/path.ts#L138)

___

### isUrl

• **isUrl**: (`path`: `string`) => `boolean`

#### Type declaration

▸ (`path`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

##### Returns

`boolean`

#### Defined in

[pixijs/packages/utils/src/path.ts:137](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/path.ts#L137)

___

### join

• **join**: (...`paths`: `string`[]) => `string`

#### Type declaration

▸ (`...paths`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...paths` | `string`[] |

##### Returns

`string`

#### Defined in

[pixijs/packages/utils/src/path.ts:142](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/path.ts#L142)

___

### normalize

• **normalize**: (`path`: `string`) => `string`

#### Type declaration

▸ (`path`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

##### Returns

`string`

#### Defined in

[pixijs/packages/utils/src/path.ts:141](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/path.ts#L141)

___

### parse

• **parse**: (`path`: `string`) => { `base?`: `string` ; `dir?`: `string` ; `ext?`: `string` ; `name?`: `string` ; `root?`: `string`  }

#### Type declaration

▸ (`path`): `Object`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

##### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `base?` | `string` |
| `dir?` | `string` |
| `ext?` | `string` |
| `name?` | `string` |
| `root?` | `string` |

#### Defined in

[pixijs/packages/utils/src/path.ts:148](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/path.ts#L148)

___

### rootname

• **rootname**: (`path`: `string`) => `string`

#### Type declaration

▸ (`path`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

##### Returns

`string`

#### Defined in

[pixijs/packages/utils/src/path.ts:145](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/path.ts#L145)

___

### sep

• **sep**: `string`

#### Defined in

[pixijs/packages/utils/src/path.ts:149](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/path.ts#L149)

___

### toAbsolute

• **toAbsolute**: (`url`: `string`, `baseUrl?`: `string`, `rootUrl?`: `string`) => `string`

#### Type declaration

▸ (`url`, `baseUrl?`, `rootUrl?`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `baseUrl?` | `string` |
| `rootUrl?` | `string` |

##### Returns

`string`

#### Defined in

[pixijs/packages/utils/src/path.ts:136](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/path.ts#L136)

___

### toPosix

• **toPosix**: (`path`: `string`) => `string`

#### Type declaration

▸ (`path`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

##### Returns

`string`

#### Defined in

[pixijs/packages/utils/src/path.ts:135](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/path.ts#L135)
