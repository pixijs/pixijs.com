/**
 * What the frame draws to explain loading glTF: a tag naming each copy, and tags on the rolling copy's wheels naming
 * the nodes the label search found
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { Ray, Vector3 } from '@pixi/3d';

import { LabelLayer } from './theme/LabelLayer';

/** The roof tags' point in each truck's space: clear of the roof, 2.58 high, through the whole roll */
const ROOF = { x: 0, y: 3, z: 0 };
/** How far each axle's two hubs sit from its centre along its local y: they stay put as the wheel turns */
const HUB_END = 1.06;
/**
 * How each wheel tag hangs off its hub, by its near end 8 px to the side: the front's to the left, the rear's to the
 * right and lower, since its hub sits higher on screen. They share a row under the truck, and stay apart on a phone.
 */
const WHEEL_TAGS = [
  { anchor: { x: 1, y: 0.5 }, offset: { x: -8, y: 40 } },
  { anchor: { x: 0, y: 0.5 }, offset: { x: 8, y: 76 } },
];

const _hub = new Vector3();
const _eye = new Vector3();
const _eyeInAxle = new Vector3();
const _sight = new Ray();

export function createVisuals({ app, view3d, stage, trucks, wheels, state }) {
  // Measured in a copy's own space, so it's the same box for every copy.
  const truckBox = trucks[0].getLocalBounds();
  const labels = new LabelLayer({ view3d, stage });
  const roofTags = trucks.map((truck, i) =>
    labels.add({ text: `trucks[${i}]`, node: truck, at: ROOF }),
  );
  const wheelTags = wheels[state.rolling].map((wheel, i) =>
    labels.add({
      text: wheel.label ?? '',
      node: wheel,
      color: 'accent',
      leader: true,
      ...WHEEL_TAGS[i],
    }),
  );
  let shownCopy = -1;

  app.stage.addChild(labels);

  /** Moves the marks to the rolling copy: its roof tag lights, and the wheel tags follow its axles */
  function select(copy) {
    shownCopy = copy;
    for (let i = 0; i < roofTags.length; i++)
      roofTags[i].color = i === copy ? 'accent' : null;
    for (let i = 0; i < wheelTags.length; i++)
      wheelTags[i].node = wheels[copy][i];
  }

  /** Whether another copy stands between the camera and a world point, tested against that copy's box */
  function behindNeighbour(point) {
    // The trucks aren't scaled, so a distance in a truck's space is the same as in the world.
    const distance = _eye.distanceTo(point);

    for (let i = 0; i < trucks.length; i++) {
      if (i === shownCopy) continue;
      trucks[i].toLocal(_eye, undefined, _sight.origin);
      trucks[i]
        .toLocal(point, undefined, _sight.direction)
        .subtract(_sight.origin)
        .normalize();

      const hit = _sight.intersectBoxT(truckBox);

      if (hit !== -1 && hit < distance) return true;
    }

    return false;
  }

  /** Pins each wheel tag to the hub on the camera's side, hidden while another truck stands in front of it */
  function followHubs() {
    view3d.camera.getGlobalPosition(_eye);
    for (let i = 0; i < wheelTags.length; i++) {
      const tag = wheelTags[i];
      const wheel = wheels[shownCopy][i];

      tag.at.set(
        0,
        wheel.toLocal(_eye, undefined, _eyeInAxle).y < 0 ? -HUB_END : HUB_END,
        0,
      );
      tag.hidden = behindNeighbour(wheel.toGlobal(tag.at, _hub));
    }
  }

  return {
    update() {
      if (state.rolling !== shownCopy) select(state.rolling);
      followHubs();
      labels.update();
    },
  };
}
