---
title: Introducing PixiJS React v8
description: PixiJS React
slug: pixi-react-v8-live
authors: [trezy]
tags: [PixiJS, React]
hide_table_of_contents: true
keywords:
  [
    'PixiJS',
    'pixi.js',
    'React',
    'JSX',
    'Typescript',
    'performance',
    '2d rendering',
    'javascript graphics',
    'game development',
  ]
---

The wait is over! We're thrilled to announce the release of **PixiJS React v8**, a complete reimagining of how React and PixiJS work together. This update represents a major shift in how you'll build interactive graphics in React applications.

Built from the ground up to harness the power of PixiJS v8 and designed exclusively for React 19, this new major version brings unprecedented flexibility, performance, and developer experience to the PixiJS React ecosystem.

<!--truncate-->

## A Fresh Start

The decision to completely rebuild @pixi/react was driven by several key factors:

- PixiJS v8 itself underwent a significant rewrite, which would have required major rework in the PixiJS React v7 codebase regardless
- Updating to the latest version of react-reconciler needed for React 19 support would have broken most of the existing implementation
- A fresh start gave us the opportunity to reimagine the library's ergonomics, allowing the implementation of a new pragma and eliminating the wrapper components of previous versions in favor of directly exposing PixiJS components through JSX proxies

This complete rewrite is heavily inspired by [`@react-three/fiber`](https://github.com/pmndrs/react-three-fiber/tree/master), and would not have been possible without the significant contributions from the R3F maintainers and community.

## What's New?

### Custom Pragma

At the heart of PixiJS React v8 lies a new JSX pragma that greatly simplifies the ergonomics of using the library. Now, all PixiJS components are directly reflected as JSX components with the `pixi` prefix:

```jsx
import { Application } from '@pixi/react';
import { Sprite } from 'pixi.js';

function MyComponent() {
  const draw = useCallback((graphics) => {
    graphics.setFillStyle({ color: 'red' });
    graphics.rect(0, 0, 25, 25);
  }, []);

  const texture = useMemo(() => Assets.get('bunny.png'), []);

  return (
    <Application>
      <pixiSprite x={100} y={100} texture={texture} />
      <pixiGraphics
        x={0}
        y={0}
        draw={(graphics) => {
          graphics.setFillStyle({ color: 'red' });
          graphics.rect(0, 0, 25, 25);
        }}
      />
    </Application>
  );
}
```

This approach eliminates the need for custom component wrappers, making the library much more future-proof and easier to maintain. As PixiJS evolves, @pixi/react will automatically support new components without requiring updates to the library itself.

### Full TypeScript Support

PixiJS React v8 was rebuilt from the ground up with TypeScript, providing autocompletion, type checking, and an improved developer experience even for those that aren't using Typescript.

### PixiJS v8 Compatible

Built specifically for PixiJS v8, this release brings all the performance improvements, WebGPU support, and modern JavaScript features from the core library directly to your React applications.

### React 19 Support

React 19 represents a massive shift in the way React works under-the-hood, which means that libraries that are deeply integrated with React have to follow suit. While we recognize that this places significant hurdles in the upgrade path for our React 18 users, we believe that being able to take advantage of the latest React features and optimizations is worth the effort.

## Getting Started

Ready to dive in? Check out the [new docs site](https://react.pixijs.io/) for PixiJS React v8!

Want to get started even faster? Use the [PixiJS Create](https://pixijs.io/create-pixi) CLI spin up a PixiJS React project in seconds:

```shell
npm create pixi.js@latest --template framework-react
```

This sets up a ready-made project with all the essentials, so you can jump straight into building.

## What's Next?

While this initial release brings tremendous improvements, we're just getting started. We have plans to introduce:

- An `attach` API (inspired by [R3F's `attach`](https://r3f.docs.pmnd.rs/api/objects#attach)) for automatically connecting non-directly-rendered components like filters and textures to their parent components
- Support for creating `Text` components from normal JSX text nodes
- Integration with [PixiJS Create](https://pixijs.io/create-pixi/)

Our goal is to make the library as intuitive as possible, with most APIs being served by the core PixiJS documentation.

## Join the Community

We'd love to hear your feedback and see what you build with PixiJS React v8! Join us on the [Official PixiJS Discord](https://discord.gg/CPTjeb28nH) to share your experiences, ask questions, and connect with other developers.

A heartfelt thank you to everyone who contributed to this release, especially those who provided early feedback and testing. Your input has been so valuable in shaping this next generation of PixiJS React.
