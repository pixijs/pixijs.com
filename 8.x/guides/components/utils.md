# Utils

PixiJS ships helper functions for browser detection, device checks, data manipulation, and path handling. These are used internally but are also available for your application code.

## Browser Detection

Check browser capabilities and features:

```ts
import {
    isWebGLSupported,
    isWebGPUSupported,
    isSafari,
    isMobile
} from 'pixi.js';

(async () => {
    // Graphics API support
    if (isWebGLSupported()) {
        console.log('WebGL is available');
    }

    if (await isWebGPUSupported()) {
        console.log('WebGPU is available');
    }

    // Browser and device detection
    if (isSafari()) {
        console.log('Running in Safari');
    }

    if (isMobile.any) {
        console.log('Running on mobile device');
    }
})();
```

## Data Management

Handle data structures and arrays efficiently:

```ts
import { removeItems, uid, clean } from 'pixi.js';

// Generate unique IDs
const id = uid(); // 1
const id2 = uid(); // 2

// Array manipulation
const array = [1, 2, 3, 4, 5];
removeItems(array, 1, 2); // Removes 2 items starting at index 1
console.log(array); // [1, 4, 5]

// Remove null/undefined properties in-place (useful before passing options objects)
const obj = { a: null, b: undefined, c: 'valid' };
clean(obj);
console.log(obj); // { c: 'valid' }
```

## Path Resolution

Handle file and URL paths:

```ts
import { path } from 'pixi.js';

// Join path segments
const fullPath = path.join('assets', 'images', 'sprite.png');

// Get file information
const ext = path.extname('image.png');     // '.png'
const name = path.basename('image.png');    // 'image.png'
const dir = path.dirname('assets/image.png'); // 'assets'
```

## Tips

- Prefer `isWebGLSupported()` / `isWebGPUSupported()` over checking for WebGL contexts manually; PixiJS handles edge cases like context loss.
- `isMobile.any` returns `true` on phones and tablets; use it to reduce particle counts, lower resolution, or simplify effects.
- Use `path.join()` instead of string concatenation for URLs to avoid double-slash issues.
- Use `uid()` for generating unique identifiers

## Related Documentation

- See [`isWebGLSupported`](https://pixijs.download/v8.23.0/docs/utils.isWebGLSupported.html) for WebGL detection
- See [`isWebGPUSupported`](https://pixijs.download/v8.23.0/docs/utils.isWebGPUSupported.html) for WebGPU detection
- See [`isMobile`](https://pixijs.download/v8.23.0/docs/utils.isMobile.html) for mobile device detection
- See [`path`](https://pixijs.download/v8.23.0/docs/utils.path.html) for path utilities

For detailed implementation requirements and advanced usage, refer to the API documentation of individual utilities.
