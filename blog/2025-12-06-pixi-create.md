---
title: PixiJS Update - Bundler and Creation Templates for Simpler Development
description: A look at the new PixiJS Create CLI and Creation Templates for easier project setup.
slug: create-cli
authors:
  - name: Zyie
    title: PixiJS Admin
    url: https://github.com/zyie
    image_url: https://github.com/zyie.png
tags: [PixiJS, Updates, Improvements, QoL, Templates, CLI]
hide_table_of_contents: true
keywords: ['PixiJS', 'Updates', 'Improvements', 'QoL', 'Templates', 'CLI']
---

As we mentioned in our previous PixiJS Update post, we are focusing on making PixiJS easier to use and understand. Today we're pushing the project one step closer to that goal and we’re excited to introduce PixiJS Create. An easy to use CLI that provides templates for using PixiJS with your favourite bundler, as well as a new "Creation Template" to get you started with PixiJS and its ecosystem.

So whether you’re diving into game development, interactive applications, or something entirely new, these templates ensure you’re equipped with the right tools to succeed.

<!--truncate-->

## 🛠️ Bundler Templates: Simple and Barebones
Bundler Templates are stripped-down starting points for setting up PixiJS projects with popular build tools. These templates focus solely on the essentials,
giving you a no-frills environment to start your project without any added complexity.

### What’s Included?
- Out-of-the-box integration with major bundlers, including:
    - **[Vite](https://vite.dev)** + PixiJS (Recommended)
    - **[Webpack](https://webpack.js.org/)** + PixiJS
    - **[esbuild](https://esbuild.github.io/)** + PixiJS
    - PixiJS imported via **[import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)**

Bundler Templates are ideal if you want complete control over your project’s setup while skipping the hassle of setting up an entire project.
They’re lightweight, efficient, and perfect for custom workflows.


## 🎨 Creation Templates: Feature-Rich Starting Points
Creation Templates go beyond the basics, offering a fully-featured foundation for building applications with PixiJS. These templates address common challenges developers face when starting a new project, providing tools that simplify screen management, asset handling, audio and more.

### What’s Included?
- **Screen Management**: Handle transitions and organize application states with ease.
- **Asset Loading**: Built-in support for PixiJS AssetPack, making asset management effortless.
- **Audio Playback**: Leverage PixiJS Sound for modern WebAudio API features.
- **Responsive Design**: Automatic resize handling for various screen sizes.
- **Simple UI**: Includes a basic UI library for common UI elements.
- **Animation Tools**: Includes preconfigured support for libraries like Spine for skeletal animations and Motion for smooth tweening and transitions.

Creation Templates are perfect for developers who want to hit the ground running with a robust foundation, enabling them to focus on building amazing content rather than worrying about setup.

### 🌍 Creation Templates for Every Platform
For the creation templates we’re starting with support for general web-based applications but are planning to expand the template ecosystem to other platforms soon:

- Web Template: A general-purpose creation template (available now).

Coming Soon:

- Discord Template: Build multiplayer applications for Discord using their SDK.
- Facebook Template: Create apps for Facebook Instant Games.
- YouTube Template: Develop YouTube Playables.

## 🌐 Stay Connected

Follow [Zyie](https://bsky.app/profile/zyie.bsky.social) and [PixiJS](https://bsky.app/profile/pixijs.com) on social media for the latest updates. Join our vibrant community on [Discord](https://discord.gg/nrnDP9wtyX) for real-time discussions and support.
