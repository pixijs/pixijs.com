/** The name tags: each visual's class name, stacked on the floor in front of its station */

import { STATIONS } from './scene';

/** The space between stacked tags' tops, in px: a tag's height and a little air */
const TAG_STEP = 23;
/** How far in front of its station's middle a tag stands: on the floor, just clear of the widest subject */
const TAG_DEPTH = 0.85;

export function createNameTags(labels, scene) {
  const stacks = Object.fromEntries(STATIONS.map((name) => [name, []]));

  return {
    add(station, name) {
      const tag = labels.add({
        text: name,
        node: scene.stations[station],
        at: { x: 0, y: 0, z: TAG_DEPTH },
        anchor: { x: 0.5, y: 0 },
        offset: { x: 0, y: stacks[station].length * TAG_STEP },
      });

      stacks[station].push(tag);

      return tag;
    },
  };
}
