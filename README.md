# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ npm i
```

### Local Development

```
$ npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ npm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Working with Content

Core content on the website is within the working `docs` directory and can have various versions that were snapshot and copied over into the `versioned_docs` directory.

Core content consists of:
- Guides
- Examples
- Tutorials

#### Guides

These are static markdown pages that can be added and edited directly within the `docs/guides` directory.

#### Examples

These are markdown compilations of the JS files on the `src/examples` directory. They are also versioned to match the versions of the docs snapshots. If the exact version of the example is not found, it will fallback to the best-matched most recent version of the examples. be Only the `docs/examples/index.md` entry point can be altered, but the examples themselves should be worked on from within the `src/examples/{version}` directories. Once updated, the command below can be called to generate out the markdown compilations of the examples.

```
$ npm run generate-example-docs
```

This command will trigger example markdowns generation on all of the docs directories altogether, both the working docs directory and the versioned docs directories.

__Note__: The examples within the docs version active on the website will be shown on the drop-down menu on the Playground page to serve as starting points for users to explore PixiJS features to their heart's content

#### Tutorials

These also markdown compilations of groups of files on the `src/tutorials` directory. Each tutorial group consists of a number of steps where each step contains a JS code file accompanied by an instruction markdown file, and a separate completed JS code file if there is a next step to proceed towards. These completed code can be toggled on/off from the instruction card of the corresponded step. Like the examples, these are also versioned to match the versions of the docs snapshots and will fallback to the best-matched most recent version of the tutorials if the exact version is not found. Only the `docs/tutorials/index.md` entry point can be altered, but the tutorial groups themselves should be worked on from within the `src/tutorial/{version}` directories. Once updated, the command below can be called to generate out the markdown compilations of the tutorial groups.

```
$ npm run generate-tutorial-docs
```

This command will trigger tutorial markdowns generation on all of the docs directories altogether, both the working docs directory and the versioned docs directories.

#### Workflow

```
$ npm start
```

The local development command will also trigger the `generate-content` command which, in turns, calls the `generate-example-docs` script and `generate-tutorial-docs` script respectively. Since the compiled markdown pages contain dynamic components, changes within the examples source or the tutorials source will be reflected on hot reloads.

However, when adding or removing tutorials or examples, please make sure to re-do `npm start` or run `generate-content` manually to keep the markdown pages of these content up-to-date.

#### Versioning

Docs versioning is native to Docusaurus, but to make it easier to manage it is coupled with the PixiJS version. A `pixi-version.json` is required on the working docs directory to create a versioned snapshot of the docs. This can be generated and altered using the following command:

```
$ npm run generate-pixi-version-config
```

The command will retrieve the up-to-date versions and tags from PixiJS and display out as an interactive list for selection.

Once satisfied with the state of the working docs and wanting to create a snapshot to make way for another upcoming version, the following command can be called:

```
$ npm run create-docs-version-snapshot
```

This will copy everything from the working docs into its own directory within the `versioned_docs` directory and named correspondingly to the version number from the encapsulated `pixi-version.json`, if chosen to be created as a specific version snapshot. If chosen to be snapshot as a generic version then the version key will be simplified to `{major}.x` (eg. `7.x`). Generic version snapshot is recommended over the specific one for maintaining major docs, but for a major version where multiple versions of docs are needed then the ability to create specific version snapshots can be handy. The command will also trigger `update-global-version-config` script which adds the pixi version config to the master `pixi-versions.json` on the root and alter the version config on the `docusaurus.config.js` accordingly. Docusaurus will also add the version to its `versions.json` file on the root.

An existing docs snapshot can be removed using the following command:

```
$ npm run remove-docs-version-snapshot
```

Or can have its pixi version config altered to another version using the command:

```
$ npm run switch-snapshot-pixi-version-config
```

where both come with an interactive list of all the snapshots for selection to be actioned on accordingly.

The `update-pixi-version-configs` script is also called pre-build and pre-deploy to update all the outdated labels or metadata on the `pixi-version.json` config on all the docs directories.