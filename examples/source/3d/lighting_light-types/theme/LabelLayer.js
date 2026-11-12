/**
 * Labels pinned to points in the 3D scene or on screen: small tags that name a node, an axis or a point where it is
 *
 * A label is 2D pixi text in a rounded tag, placed each frame where its 3D point lands on screen with
 * `view3d.worldToScreen`, so it stays the same size and sharp however far the point is.
 */

import { Vector3 } from '@pixi/3d';

import { Container, Matrix, Point, Rectangle } from 'pixi.js';

import { Label } from './Label';

import { releaseLabelFont, useLabelFont, viewRect } from './overlay';

const _world = new Vector3();
const _screen = new Point();
const _layer = new Matrix();

/**
 * Every label over one view, drawn on top of it
 *
 * Add it after the view, so the tags draw on top, and call {@link LabelLayer#update} each frame once the scene has
 * moved. A label hides while its point is behind the camera or outside `bounds`, while its node or an ancestor is
 * hidden, while `hidden` is set, and while its text is empty. `destroy()` removes every label.
 * @example
 * ```ts
 * const labels = new LabelLayer({ view3d, stage });
 * labels.add({ text: 'origin', node: logo, at: { x: 0, y: 1.4, z: 0 } });
 *
 * app.stage.addChild(view3d, labels);
 * app.ticker.add(() => labels.update());
 * ```
 */
export class LabelLayer extends Container {
  /** How far inside the bounds every tag stays, in px */
  margin = 16;
  _view;
  _stage;
  _bounds;
  _viewBounds = new Rectangle();
  _project;
  _labels = [];

  constructor({ view3d, stage, margin = 16, bounds, project }) {
    super({ eventMode: 'none' });
    useLabelFont();
    this._view = view3d;
    this._stage = stage;
    this.margin = margin;
    this._bounds = bounds ?? null;
    this._project =
      project ?? ((world, out) => view3d.worldToScreen(world, out));
  }

  /** Adds a label; it shows from the next {@link LabelLayer#update} */
  add(options) {
    const label = new Label({
      ...options,
      node: options.node ?? this._view.root,
      stage: this._stage,
    });

    label.visible = false;
    this._labels.push(label);
    this.addChild(label);

    return label;
  }

  /** Removes and destroys a label */
  remove(label) {
    const index = this._labels.indexOf(label);

    if (index < 0) return;
    this._labels.splice(index, 1);
    label.destroy({ children: true, context: true });
  }

  /** Places every label over its point, hides the ones that can't show, and follows the theme */
  update() {
    const bounds = this._bounds ?? viewRect(this._view, this._viewBounds);

    this.getGlobalTransform(_layer);
    for (const label of this._labels) {
      const point =
        label.hidden || label.text === '' ? null : this._pointOf(label);

      if (point && contains(bounds, point)) {
        label.visible = true;
        label.place(point, bounds, this.margin, _layer);
      } else {
        label.visible = false;
      }
    }
  }

  /** Destroys every label, their Graphics contexts included, and releases the label font */
  destroy() {
    if (this.destroyed) return;
    this._labels.length = 0;
    super.destroy({ children: true, context: true });
    releaseLabelFont();
  }

  /** Where a label's point is on screen, in global px, or `null` when it can't show */
  _pointOf(label) {
    if (label.screen) return label.screen;
    if (!shown(label.node)) return null;
    label.node.toGlobal(label.at, _world);

    return this._project(_world, _screen);
  }
}

/** Whether a node and every one of its ancestors is visible, walked now since `worldVisible` lags a frame */
function shown(node) {
  for (let n = node; n; n = n.parent) {
    if (!n.visible) return false;
  }

  return true;
}

/** Whether a point lies in a rect, edges included */
function contains(rect, point) {
  return (
    point.x >= rect.x &&
    point.x <= rect.right &&
    point.y >= rect.y &&
    point.y <= rect.bottom
  );
}
