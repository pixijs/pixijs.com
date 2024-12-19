---
title: Introducing the PixiJS Universe!
description: PixiJS v2 Website Brief Description
slug: pixi-universe
authors: zyie
tags: [PixiJS, PixiJS Universe]
hide_table_of_contents: true
keywords: ['keyword', 'for', 'search', 'engines']
---

We are excited to announce the launch of the PixiJS Universe, an initiative to further enhance the capabilities of PixiJS and make it even easier for developers to create amazing games and apps.

<!--truncate-->

For years, PixiJS has been the most popular 2D renderer for the web, but it was always "just a rendering engine." The community has created many great tools to help developers build games and applications with PixiJS, but we lacked the manpower to maintain and improve these tools, causing fragmentation in the community.
To address this, Playco has assembled a dedicated team of developers who will work on PixiJS full-time. Over the next 12 months, we have more than ten projects planned, and in this announcement, we would like to introduce some of them.

## Phase 1​
We have several new projects in the works, and we are releasing them in four phases over the year. We are currently nearing the end of phase 1, which has seen the release of several exciting new tools and libraries for PixiJS:

### PixiJS Website​
First up we are excited to announce that we will be releasing a beta version of our new website for PixiJS.

The current documentation has suffered from long-term organic growth over the years with little structure and as such much of the PixiJS documentation is fragmented across multiple sites. This new website will put everything you need in one place and be easily searchable.

We are also planning on improving the documentation and adding more guides and examples, as well as considering translating the documentation into other languages.

If you have any ideas on how to improve the site please let us know!
- [Github Repo](https://github.com/pixijs/pixijs.com)

### PixiJS React​
Next up is PixiJS React. A library that provides a way to use PixiJS in React applications. PixiJS React is a continuation of the `react-pixi` library created by Patrick Brouwer, which has been widely used by the PixiJS community in React projects. PixiJS has taken over maintenance of the library and is dedicated to improving the library's performance, documentation, and support for new features.

The library provides an easy-to-use interface that makes it easy for developers to create React applications with PixiJS. The library integrates all the core features of PixiJS and allows you to create custom components for 3rd party libraries.

- [Github Repo](https://github.com/pixijs/pixi-react)

### PixiJS Open Games​
We have now released a new repository called "PixiJS Open Games". This is a collection of open-source games that showcases how to use PixiJS to create games and is released under the MIT license. The purpose of these games is to provide professional examples of how to use PixiJS for game development.

The first two games released are a match-3 game and a bubble shooter game. These games not only demonstrate how to use PixiJS for game development but also how to use other libraries such as PixiJS UI and AssetPack. We also have more games planned for release, which will demonstrate how to use PixiJS with other libraries such as PixiJS Layout and PixiJS React.

PixiJS Open Games will hopefully be a valuable resource for game developers who want to learn how to use PixiJS for game development and will also be a great source of inspiration for developers looking to create their own games using PixiJS. The project is available on GitHub for anyone who wants to explore the code or contribute to the project.

- [Github Repo](https://github.com/pixijs/open-games)
- [Play Puzzling Potions](https://puzzling-potions.netlify.app/)
- [Play Bubbo Bubbo](https://bubbo-bubbo.netlify.app/)

### PixiJS UI & PixiJS Layout​
PixiJS UI is a new library for developers who want to create beautiful and functional user interfaces with PixiJS. The library includes a range of components such as buttons, checkboxes, sliders, text inputs, scroll views, lists, radio buttons, and progress bars, which can be easily integrated into your game. These components are highly customizable, allowing you to tweak the appearance and behaviour of each element to fit your game's specific needs.

PixiJS UI has been used in all of the open-source games, so feel free to check these out for real-world examples.

- [PixiJS UI Github Repo](https://github.com/pixijs/ui)

PixiJS Layout is another library that can make your life as a developer easier. This library enables you to create responsive layouts using PixiJS, which means you can design interfaces that adapt to different screen sizes and aspect ratios. PixiJS Layout works well with PixiJS UI, allowing you to combine both libraries to create complex, dynamic interfaces that respond to user input and screen changes.

With PixiJS Layout, you have the flexibility to create resizable layouts that can be adjusted to fit any screen size or device. This means that your game's interface can look great on everything from small mobile devices to large desktop displays.

PixiJS Layout is still under development but will be ready in the next few weeks

- [PixiJS Layout Github Repo](https://github.com/pixijs/layout)

### AssetPack​
Finally, for phase 1 we are announcing AssetPack.

Asset management is an important part of developing applications, and the new AssetPack library aims to make this process easier. AssetPack is a framework-agnostic library that can be used with any framework, including PixiJS, ThreeJS, and Phaser. It provides a range of features that help developers manage their assets efficiently.
The key feature of AssetPack is the ability to automatically generate new assets on the fly. For example, you can provide it with a folder of individual images and it will generate sprite sheets, which can significantly improve the performance of your application. It also provides plugins to generate mipmaps, convert fonts to different formats, convert audio to different formats, compress images, and minify JSON. These features help developers optimize their assets for faster loading times, better performance, and improved user experience.

We will soon be releasing a new blog post that provides more details on how to use it. With its many useful features and framework-agnostic design. However, if you want to get stuck in today then check out the GitHub repo

- [Github Repo](https://github.com/pixijs/assetpack)

## Phase 2​
Phase 2 will begin shortly and aims to make it easier to work with PixiJS applications.

### PixiJS JumpStart​
Jumpstart is a new CLI tool being developed by the PixiJS team to simplify the process of creating new PixiJS applications. With this tool, developers will no longer need to set up complicated tooling or worry about setting up different bundlers and frameworks. The tool will handle all the setup for you, allowing you to focus on building your application.

Jumpstart will be similar to other CLI tools such as Create-React-App or Create-Vue, which have become popular in the front-end development community. The tool will provide templates for different bundlers and frameworks, including webpack, parcel, rollup, and more. This will make it easy for developers to get started with PixiJS regardless of their preferred tools and workflows. With Jumpstart, you'll be able to create a new PixiJS application in just a few minutes and start building right away.

### PixiJS Dev Tools​
PixiJS dev tools will be a browser extension that is planned to be released soon to help developers debug their PixiJS applications. This tool aims to make it easier for developers to understand the inner workings of PixiJS, optimize their code, and follow best practices. It is designed to help developers diagnose performance issues and visualize the resources that their applications are consuming.

One of the key features of the PixiJS Dev Tools is its ability to help developers understand the complex process of batching in PixiJS. Batching is a technique used to optimize the rendering of multiple objects in the same draw call. This process can be complicated to understand, especially for new developers. PixiJS Dev Tools aims to make it easier to debug and optimize the rendering of objects.

Overall, PixiJS Dev Tools will be a powerful tool that will make it easier for developers to build high-performance, visually stunning applications with PixiJS. By providing developers with a deeper understanding of the inner workings of PixiJS, this toolset will help developers optimize their code and create more efficient and engaging applications.

## Phase 3​
Phase 3 is where our long-term projects start to be revealed. These are major changes to the PixiJS ecosystem that we are incredibly excited about

### Comet​
Comet will be a new editor that aims to make it easier than ever to design and create games and applications with PixiJS. With its intuitive and user-friendly interface, the editor is designed to appeal to both designers and developers, allowing both groups to collaborate and work more efficiently.

One of the standout features of Comet is the visual interface it provides for creating and editing scenes, sprites, animations, and more. This means that designers can create and edit complex scenes without ever having to write a single line of code. The editor provides a range of tools and options for creating sprites, animations, and other game elements, making it easy to get started with creating a game or application.

In addition, developers will appreciate the runtime player feature, which allows them to easily recreate scenes in their own applications. This makes it easy to test and iterate on designs, ensuring that the final product is both functional and visually appealing. And with multi-user, real-time collaboration, Comet makes it easy for teams to work together, sharing assets and ideas and creating high-quality games and applications in record time.

### PixiJS v8​
PixiJS v8 will be the next major release that represents a complete rewrite of PixiJS from the ground up. The development team has leveraged their extensive experience over many years to make improvements and optimizations to the core PixiJS engine. The new version of PixiJS is designed to be faster and more efficient, providing a significant improvement in rendering performance compared to v7 (currently sitting at x2)

One of the most exciting features of PixiJS v8 is the inclusion of first-class support for WebGPU, which is a new graphics API that is being developed by major browser vendors. This will enable developers to take advantage of advanced GPU capabilities, which can significantly improve the performance of graphics-intensive applications. In addition to WebGPU support, the PixiJS team has also made a significant effort to optimize the engine for the canvas renderer, which will be available as a first-class option for developers looking to reduce bundle size.

Overall, PixiJS v8 represents a major leap forward for us, developers can expect a much faster and more efficient engine that is better suited for building complex, graphics-intensive applications.

## Phase 4​
Phase 4 represents a leap into new territory for PixiJS as we look to delve deeper into areas outside of strictly 2D rendering.

### PixiJS 3D​
For years, Goodboy (now Playco) has had an internal 3D engine called Odie that was built on top of PixiJS. We are now planning to open-source it, which is exciting for those of you who want to seamlessly mix 2D and 3D content in your games or applications. With PixiJS 3D, you will no longer need to switch between engines or frameworks to incorporate 3D elements in your project.

Although this is a long-term project, the team is making progress and plans to share more information later in the year. This release will greatly expand PixiJS's capabilities and give developers even more flexibility when building their applications.

### PixiJS Game Engine​
Finally, we are thrilled to announce that we will be working on a new library called PixiJS Game Engine. This game engine aims to provide everything you would expect from a 2D/3D game engine and will offer many features and tools to make game development easier and more efficient.

Some of the features of PixiJS Game Engine will include support for physics engines, audio, input handling, asset loading and management, state management, animation and tweening, and more.

## Conclusion
We've shared a lot of exciting news about new projects and updates coming to the PixiJS community. There's a lot to look forward to in the upcoming months.

We want to extend our sincere thanks to the PixiJS community, its contributors, and Playco for making all of this possible. We're excited to see what you'll create with these new tools and resources, and we look forward to continuing to support and grow the PixiJS ecosystem. Be sure to check out the GitHub links mentioned above and stay tuned for more updates on the PixiJS Universe!
