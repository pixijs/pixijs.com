# Accessibility

PixiJS includes built-in accessibility support through a DOM-based overlay system that integrates with screen readers, keyboard navigation, and other assistive technologies. It uses `` overlays to describe visual elements to screen readers

:::info
Accessibility is opt-in to reduce bundle size and must be explicitly enabled.
:::

```ts
import 'pixi.js/accessibility';
import { Container } from 'pixi.js';

const button = new Container();
button.accessible = true;
```

## **How It Works**

PixiJS places DOM `` elements over your canvas, aligned to the bounds of accessible objects. These elements:

- Can receive focus via keyboard (`tabIndex`)
- Announce `accessibleTitle` or `accessibleHint` to screen readers
- Dispatch `click`, `mouseover`, `mouseout` events as Pixi pointer events
- Use `aria-live` and `aria-label` where appropriate

## Enabling the System

To enable accessibility, you must import the module before creating your renderer:

```ts
import 'pixi.js/accessibility';
```

PixiJS automatically installs the `AccessibilitySystem` onto your renderer. You can configure how and when it's activated.

## **Configuration Options**

You can customize when and how the accessibility system activates by passing options to the `Application` constructor:

```ts
const app = new Application({
  accessibilityOptions: {
    enabledByDefault: true, // Enable on startup
    activateOnTab: false, // Disable auto-activation via tab
    deactivateOnMouseMove: false, // Keep system active with mouse use
    debug: true, // Show div overlays for debugging
  },
});
```

Or programmatically enable/disable the system:

```ts
app.renderer.accessibility.setAccessibilityEnabled(true);
```

## **Creating Accessible Objects**

To mark a display object as accessible and add it to the accessibility system, set the `accessible` property to `true`. This will create a `` overlay that screen readers can interact with.

```ts
const button = new Container();
button.accessible = true;

app.stage.addChild(button);
```

### **Properties for Accessible Containers**

There are several properties you can set on accessible containers to customize their behavior:

| Property                  | Description                                                      |
| ------------------------- | ---------------------------------------------------------------- |
| `accessible`              | Enables accessibility for the object                             |
| `accessibleTitle`         | Sets the `title` for screen readers                              |
| `accessibleHint`          | Sets the `aria-label`                                            |
| `accessibleText`          | Alternative inner text for the div                               |
| `accessibleType`          | Tag name used for the shadow element (`'button'`, `'div'`, etc.) |
| `accessiblePointerEvents` | CSS `pointer-events` value (`'auto'`, `'none'`, etc.)            |
| `tabIndex`                | Allows focus with keyboard navigation                            |
| `accessibleChildren`      | Whether children of this container are accessible                |

---

## **API Reference**

- [Overview](https://pixijs.download/release/docs/accessibility.html)
- [AccessibilitySystem](https://pixijs.download/release/docs/accessibility.AccessibilitySystem.html)
- [AccessibleOptions](https://pixijs.download/release/docs/accessibility.AccessibleOptions.html)
