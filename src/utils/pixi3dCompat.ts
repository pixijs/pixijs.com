import { BindGroup } from 'pixi.js';

/**
 * `@pixi/3d` calls `BindGroup.setResourceUnwatched`, which landed in a pixi.js 8.22.0 dev build after the 8.22.0
 * release. The watched `setResource` does the same job with one extra listener. Delete once the installed pixi.js
 * has it; `scripts/runtime.mts` applies the same fallback in the editor.
 */
const prototype = BindGroup.prototype as BindGroup & { setResourceUnwatched?: BindGroup['setResource'] };

prototype.setResourceUnwatched ??= prototype.setResource;
