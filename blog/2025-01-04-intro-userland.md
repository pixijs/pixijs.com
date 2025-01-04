---
title: Introducing PixiJS Userland
description: Announcing a new GitHub organization for community projects.
slug: intro-userland
authors: bigtimebuddy
tags: [PixiJS, Plugins, GitHub, Extensions, Community]
hide_table_of_contents: true
keywords: ['PixiJS', 'Plugins', 'GitHub', 'Extensions', 'Community']
---

We have launched a new GitHub organization called [PixiJS Userland](https://github.com/pixijs-userland) to host many of our popular community-driven extensions. This initiative aims to help PixiJS developers easily identify which projects are officially supported and which are community-driven, while also giving developers more freedom to manage their projects independently.

<!--truncate-->

In the past, the main PixiJS organization included a wide range of projects. Some were stable and widely used, while others were experimental with a small user base. This diversity led to the misconception that all projects on [github.com/pixijs](https://github.com/pixijs) received equal support from the core team, such as bug fixes and major updates. In reality, the core team found it challenging to communicate different priorities, especially since some side projects were maintained independently by core team members.

Welcome to PixiJS Userland!

## Userland Project Types

We have identified several common use-cases for projects that are best suited for Userland. Many projects have already been migrated to this new organization.

### In-Scope Experiments

Userland is an ideal place for projects that could eventually be part of the main PixiJS repo but need more time for development and stabilization. Examples include:

* [Compressed Textures](https://github.com/pixijs-userland/pixi-compressed-textures) (similar features in PixiJS v7+)
* [HTMLText](https://github.com/pixijs-userland/html-text) (added in PixiJS v7+)
* [Projection](https://github.com/pixijs-userland/projection) (similar features in PixiJS v8+)
* [GIF](https://github.com/pixijs-userland/gif) (candidate for PixiJS v8+)
* [Layers](https://github.com/pixijs-userland/layers) (candidate for similar features in PixiJS v8+)
* [Lights](https://github.com/pixijs-userland/lights) (candidate for similar features in PixiJS v8+)

### Out-of-Scope Projects

These projects fall just outside the main goals of PixiJS. They are useful but may be more specialized or opinionated, not fitting the broader PixiJS community. Examples include:

* [Tilemap Kit](https://github.com/pixijs-userland/tilemap)
* [Particle Emitter](https://github.com/pixijs-userland/particle-emitter)
* [Graphics Smooth](https://github.com/pixijs-userland/graphics-smooth)

### Third-Party Integrations

Sometimes PixiJS developers need to integrate with third-party tools that aren't widely used enough to be officially supported by PixiJS. Examples include:

* [Spine](https://github.com/pixijs-userland/spine) _runtime for Spine animations_
* [Animate](https://github.com/pixijs-userland/animate) _Adobe Animate Publishing Extension_
* [Node.js PixiJS Renderer](https://github.com/pixijs-userland/node) _Node.js Rendering_

## Main Project Types

Several projects will continue to be supported on the main PixiJS GitHub organization. These projects will receive updates to stay compatible with the latest PixiJS releases. While this list may change, it currently includes projects that offer the greatest general benefit to PixiJS developers.

### General Extensions

These are runtime extensions that integrate with PixiJS and provide general benefits for all developers.

* [Sound](https://github.com/pixijs/sound)
* [UI](https://github.com/pixijs/ui)
* [Layout](https://github.com/pixijs/layout)
* [Filters](https://github.com/pixijs/filters)

### Popular Runtimes

Support for popular web frameworks or integration with other renderers.

* [Pixi React](https://github.com/pixijs/pixi-react)

### Developer Tools

Tools that help developers build, package, or develop projects with PixiJS.

* [DevTools](https://github.com/pixijs/devtools)
* [ESLint Configuration](https://github.com/pixijs/eslint-config)
* [Create](https://github.com/pixijs/create-pixi)
* [AssetPack](https://github.com/pixijs/assetpack)
* [Extension Scripts](https://github.com/pixijs/extension-scripts)

### Resources

References, documentation, or resources for developers.

* [Storybook](https://github.com/pixijs/storybook)
* [Open Games](https://github.com/pixijs/open-games)
* [PixiJS.com](https://github.com/pixijs/pixijs.com)

## Summary

We hope that introducing Userland will help clarify the level of support among the growing number of PixiJS projects and initiatives. If you have any feedback, please reach out on [Discord](https://discord.gg/QrnxmQUPGV) or start a [discussion](https://github.com/pixijs/pixijs/discussions/new/choose).
