# Animation

PixiJS 3D plays keyframe animation, both the clips in a glTF file and the animations you build in code. Most of the work goes through three classes:

- An [`Animation`](https://3d.pixijs.download/v0.1.0/docs/animation.Animation.html) is a named set of keyframe tracks, such as a model's Walk clip. Each track drives one property, such as a bone's rotation or a node's position. A node is any [`Container3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html) in the scene.
- An [`AnimationPlayer`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationPlayer.html) plays animations on a node, such as a model, and on everything under it.
- An [`AnimationState`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationState.html) is one animation's playback on one player: its time, speed, looping and weight.

To move something in code every frame, such as a spinning coin, you don't need these classes. Change the node's transform from the ticker, as in 2D. [Scene graph](https://pixijs.com/3d/guides/concepts/scene-graph.md#parents-and-children) shows how.

## Playing a model's clips

A [`Model3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html) whose file has animation clips comes with a player, [`model.player`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html#player). When the file has no clips, `model.player` is `undefined`. [`animationLabels`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationPlayer.html#animationlabels) lists the clips by name, and [`play`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationPlayer.html#play) starts one and returns its state:

```ts
const fox = new Model3D({ source });

view3d.root.addChild(fox);

const walk = fox.player!.play('Walk');

walk.animationSpeed = 1.5;
```

`play` doesn't stop a clip that's already playing, so the two [blend](#blending-and-crossfades). To switch clips, call [`player.stop()`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationPlayer.html#stop), then play the next one. `stop()` stops every animation on the player, and each one holds its pose.

Like an `AnimatedSprite`, a player advances on `Ticker.shared`. By default that isn't `app.ticker`, so slowing or pausing `app.ticker` doesn't affect the player. To drive the player from your own ticker, turn [`autoUpdate`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationPlayer.html#autoupdate) off and call [`update`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationPlayer.html#update) yourself:

```ts
const fox = new Model3D({ source, autoUpdate: false });

app.ticker.add((ticker) => fox.player?.update(ticker));
```

## Controlling playback

[`getState`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationPlayer.html#getstate) returns an animation's state without starting playback. The state's methods match `AnimatedSprite`'s, such as [`stop()`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationState.html#stop) and [`gotoAndPlay()`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationState.html#gotoandplay), but they take times in seconds, not frame numbers. Setting [`time`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationState.html#time) only moves the playhead. [`gotoAndStop(time)`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationState.html#gotoandstop) also shows the pose at that time straight away.

[`loop`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationState.html#loop) is on by default. With it off, the state stops at its end, holds that pose and calls [`onComplete`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationState.html#oncomplete). To play it again, call `gotoAndPlay(0)`. If a negative [`animationSpeed`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationState.html#animationspeed) plays it backwards, call `gotoAndPlay(state.animation.duration)` instead. Here the walking fox stops, looks around once, then walks on:

```ts
fox.player!.stop();

const survey = fox.player!.getState('Survey');

survey.loop = false;
survey.onComplete = () => fox.player!.play('Walk');
survey.gotoAndPlay(0);
```

Every model built from one source has its own player. Foxes in a crowd can each set a different `time` on their walk state, so they walk out of step.

## Blending and crossfades

All playing states apply at once. Where two states drive a property through tracks with the same label, as a model's clips do, the player mixes them by [`weight`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationState.html#weight). Weights are relative. A clip that is the only one driving a property shows in full at any weight above 0, so lowering its weight doesn't fade it out. To fade it out, move weight to another clip. A track you write for one of a model's bones or nodes doesn't mix with the file's clips. Add to the clip's pose instead, as [Skinned meshes](#skinned-meshes) shows.

To crossfade, move the weights a step each frame, toward 1 on the clip you want and toward 0 on the other. One ticker callback then fades either way, even when you switch partway through a fade:

```ts
const player = fox.player!;
const walk = player.play('Walk');
const run = player.getState('Run');
let target = walk;

app.ticker.add((ticker) => {
  const step = ticker.deltaMS / 300;

  for (const state of [walk, run]) {
    state.weight = state === target ? Math.min(1, state.weight + step) : Math.max(0, state.weight - step);
    if (state.weight === 0) state.stop();
  }
});

const fadeTo = (next: AnimationState) => {
  if (!next.playing) {
    next.weight = 0;
    next.play();
  }
  target = next;
};

button.on('pointertap', () => fadeTo(target === walk ? run : walk));
```

A stopped state keeps its weight, so the snippet sets a stopped clip's weight to 0 before playing it. While the ticker callback runs, it sets both weights, so switch clips by changing its target, as the button does. Once you remove the callback, set a faded-out clip's weight above 0 before you play it again, or the clip has no effect.

Two looping clips that start on the same foot and step in the same order can begin the fade in step. Start the incoming clip at the same fraction of its [`duration`](https://3d.pixijs.download/v0.1.0/docs/animation.Animation.html#duration) that the outgoing clip has reached, by setting its [`time`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationState.html#time) before you play it. The fox's walk and run don't line up this way.

[Playing clips](https://pixijs.com/3d/examples?example=animation_clips) crossfades the fox between its clips and blends its walk with its run.

## Skinned meshes

A skinned mesh bends with a skeleton. A skeleton is a hierarchy of bones, such as a character's spine and limbs, and each bone moves the vertices tied to it. A [`Model3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html) lists its [`skeletons`](https://3d.pixijs.download/v0.1.0/docs/scene.Skeleton.html) in [`model.skeletons`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html#skeletons). Every model gets its own, so posing one fox doesn't move another.

[`getChildByLabel`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#getchildbylabel) finds only the bones that the file puts a mesh under, as [Scene graph](https://pixijs.com/3d/guides/concepts/scene-graph.md#parents-and-children) explains. You move those like any node. The other bones exist only in the skeleton. [`indexOf`](https://3d.pixijs.download/v0.1.0/docs/scene.Skeleton.html#indexof) finds a bone by its name in the file, and the skeleton keeps each bone's local position, rotation and scale in flat arrays. [`localRotation`](https://3d.pixijs.download/v0.1.0/docs/scene.Skeleton.html#localrotation) holds each bone's rotation as a [quaternion](https://pixijs.com/3d/guides/components/math.md#rotations), four numbers per bone. Write into the arrays and set [`dirty`](https://3d.pixijs.download/v0.1.0/docs/scene.Skeleton.html#dirty), or call [`setLocalTRS`](https://3d.pixijs.download/v0.1.0/docs/scene.Skeleton.html#setlocaltrs), which does both.

A playing clip rewrites the bones it drives on every update, so a pose you write to those bones lasts only until the next update. To add to a clip's pose, turn the model's [`autoUpdate`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3DOptions.html#autoupdate) off so you choose the order, then pose the bone right after you update the player:

```ts
const fox = new Model3D({ source, autoUpdate: false, autoPlay: 'Walk' });
const skeleton = fox.skeletons[0];
const head = skeleton.indexOf('b_Head_05') * 4;
const turn = new Quaternion().setFromAxisAngle({ x: 0, y: 1, z: 0 }, Math.PI / 6);
const rotation = new Quaternion();

view3d.root.addChild(fox);

app.ticker.add((ticker) => {
  fox.player!.update(ticker);

  // Turn the head a further 30 degrees, on top of the pose the walk just set
  rotation.fromArray(skeleton.localRotation, head).multiply(turn).toArray(skeleton.localRotation, head);
  skeleton.dirty = true;
});
```

While the walk plays, it resets the head on every update, so the turn doesn't build up. Once no playing clip drives the bone, as after `player.stop()`, write the whole rotation instead of multiplying onto the current one, or the head turns further every frame. A bone turns about its own axes, which depend on how the file was rigged, so check the axis on your model.

[Driving bones](https://pixijs.com/3d/examples?example=animation_bones) turns the fox's head toward the pointer the same way.

Picking and culling don't follow the bones. For an animated character's hit volume, see [Interaction](https://pixijs.com/3d/guides/components/interaction.md#hit-volumes). For a character that vanishes near the screen's edge, see [Performance](https://pixijs.com/3d/guides/concepts/performance.md#culling).

## Morph targets

A morph target is another shape stored for the same vertices, such as a smile or a blink. A mesh whose geometry has morph targets has [`weights`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#weights), one number per target. At 0 the mesh keeps its base shape, at 1 it takes the target's shape, and several targets add together. Clips in the file can drive the weights, or you can set them yourself:

```ts
model.traverse((node) => {
  if (node instanceof Mesh3D && node.weights) node.weights[0] = 0.8;
});
```

Write into the array rather than assigning a new one, because a clip that has started keeps using the old array. Each model has its own weights, even when several models share one source.

[Morph targets from glTF](https://pixijs.com/3d/examples?example=animation_morph-targets) plays a cube's clip on its weights. A playing clip rewrites the weights on every update, so the example stops the clip when you set a weight by hand.

## Animating in code

To animate a node's properties in code, such as its position or a mesh's weights, build an [`Animation`](https://3d.pixijs.download/v0.1.0/docs/animation.Animation.html) from tracks. Each track names the property it drives as `'<node label>.<property>'` and holds keyframe times in seconds, with a value for each:

```ts
const crate = new Mesh3D({
  geometry: new CubeGeometry(),
  material: new Material3D(),
  label: 'crate',
  parent: view3d.root,
});

const bob = new Animation({
  label: 'bob',
  tracks: [new NumberTrack({ label: 'crate.y', times: [0, 0.5, 1], values: [0, 1, 0] })],
});

const player = new AnimationPlayer({ target: crate, animations: [bob], autoPlay: 'bob' });
```

The player looks under its `target` for each track's node by label, or for a skinned mesh's bone by name, as [`TrackOptions.label`](https://3d.pixijs.download/v0.1.0/docs/animation.TrackOptions.html#label) describes. It looks each label up once, the first time an animation that uses it plays or you call `gotoAndStop` on its state, so add the nodes before then. A track that names no node, or a property the player can't animate, does nothing and gives no warning. A track can't reach a material, and among nodes only a [`Sprite3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3D.html) has an `alpha`. When copies under one target share a label, only one of them animates, so give each copy its own player. Players can share one animation.

Pick the track class by the property's type:

| Track                   | Property                                                        | Numbers per value |
| ----------------------- | --------------------------------------------------------------- | ----------------- |
| [`Vector3Track`](https://3d.pixijs.download/v0.1.0/docs/animation.Vector3Track.html)    | A vector, such as `position`, `scale`, or `rotation` in radians | 3                 |
| [`QuaternionTrack`](https://3d.pixijs.download/v0.1.0/docs/animation.QuaternionTrack.html) | `quaternion`                                                    | 4                 |
| [`NumberTrack`](https://3d.pixijs.download/v0.1.0/docs/animation.NumberTrack.html)     | A number, such as `y`                                           | 1                 |
| [`Track`](https://3d.pixijs.download/v0.1.0/docs/animation.Track.html)           | An array of numbers, such as `weights`, with `valueSize`        | `valueSize`       |

- A `position` track sets all three coordinates. To keep the `x` and `z` you placed the node at, animate `y` alone with a [`NumberTrack`](https://3d.pixijs.download/v0.1.0/docs/animation.NumberTrack.html).
- A `rotation` track also sets all three angles, so use a [`Vector3Track`](https://3d.pixijs.download/v0.1.0/docs/animation.Vector3Track.html) even to turn about one axis. `angle` doesn't animate.
- On a bone, a track drives only `position`, `quaternion` or `scale`, so turn a bone with a [`QuaternionTrack`](https://3d.pixijs.download/v0.1.0/docs/animation.QuaternionTrack.html).
- [`interpolation`](https://3d.pixijs.download/v0.1.0/docs/animation.TrackOptions.html#interpolation) sets how a track fills in values between keyframes. With `'CUBICSPLINE'`, each keyframe stores two tangents beside its value, in the layout [`TrackOptions.values`](https://3d.pixijs.download/v0.1.0/docs/animation.TrackOptions.html#values) describes.
- With `'LINEAR'` interpolation, the default, a [`QuaternionTrack`](https://3d.pixijs.download/v0.1.0/docs/animation.QuaternionTrack.html) turns the shorter way between two keyframes, so keep each step under half a turn. A [`Vector3Track`](https://3d.pixijs.download/v0.1.0/docs/animation.Vector3Track.html) on `rotation` turns through the angles as you give them.
- An animation ends at its last keyframe. To hold the end pose before it loops, set a longer [`duration`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationOptions.html#duration).

[Keyframes](https://pixijs.com/3d/examples?example=animation_keyframes) assembles the PixiJS logo with a `Vector3Track` for each piece. A `QuaternionTrack` rolls its badge and a `NumberTrack` flashes a light. The example plays the same keyframes with each interpolation.

## Cleaning up

A model's [`destroy`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html#destroy) also destroys its player and skeletons. A player you built isn't tied to its target. If it's playing when you destroy the target, it keeps running on `Ticker.shared`, so call its [`destroy`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationPlayer.html#destroy) too. Also remove the ticker callbacks you added to drive a player or its bones, such as the crossfade and the head turn above.

## Next steps

- [Loading models](https://pixijs.com/3d/guides/components/models.md): where models and their clips come from.
- [Scene graph and transforms](https://pixijs.com/3d/guides/concepts/scene-graph.md#rotation-and-quaternion): how a node's `rotation` and `quaternion` relate, and which one the node uses.
