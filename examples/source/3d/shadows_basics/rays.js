/**
 * The light rays the logo blocks: two drawn past the edges of the logo, and a third that aims the loupe
 *
 * Each runs from the active light past a point on the logo to where it would land, on the wall or the plinth. While
 * the light and the logo both cast it's blocked: solid ink up to the logo, then dashed accent to a dot on the edge of
 * the logo's shadow. Otherwise the light gets through, and one solid ink line runs all the way.
 */

import { Matrix4, Plane, Ray, Vector3 } from '@pixi/3d';

import { ArrowHelper } from './theme/ArrowHelper';
import { DotHelper } from './theme/DotHelper';

import { PathHelper } from './theme/PathHelper';

/** Line widths and the landing dot's radius: thicker on a phone, which sees them from further back */
const LINE = { wide: 0.018, narrow: 0.04 };
const DOT = { wide: 0.05, narrow: 0.09 };
/** How far up the beam from the logo a sun's ray starts, in world units: further on a phone, which has sky to spare */
const SUN_RAY_LENGTH = { wide: 2.7, narrow: 4.5 };
/**
 * Where each light's beam grazes the logo's outline, as fractions of a piece's half extents: just outside the P and
 * the JS badge for the two rays, so neither line crosses a glyph, and on the P's back face for the loupe, which makes
 * the shadow's top edge, picked so the edge crosses the loupe's middle and no ray or dot enters its frame
 */
const GRAZE = {
  sun: { p: [-0.89, -0.86], js: [0.8, 0.8], loupe: [-0.835, 0.68] },
  spot: { p: [-0.78, 0.84], js: [0.88, 0.84], loupe: [-0.49, -0.97] },
};

const _matrix = new Matrix4();
const _apex = new Vector3();
const _beam = new Vector3();
const _ray = new Ray();

/** One drawn ray: ink to the logo, then dashed accent to a dot where it lands */
function createRay(piece, parent) {
  const line = new ArrowHelper({
    color: 'ink',
    thickness: LINE.wide,
    head: false,
    parent,
  });
  const dash = new PathHelper({
    color: 'accent',
    thickness: LINE.wide,
    dash: 0.12,
    gap: 0.08,
    parent,
  });
  const dot = new DotHelper({ color: 'accent', radius: DOT.wide, parent });
  const ends = new Float32Array(6);

  return {
    piece,
    from: new Vector3(),
    through: new Vector3(),
    /** Where it lands, on the wall or the plinth */
    to: dot.position,
    draw(blocked, narrow) {
      line.thickness = dash.thickness = narrow ? LINE.narrow : LINE.wide;
      dot.radius = narrow ? DOT.narrow : DOT.wide;
      line.set(this.from, blocked ? this.through : this.to);
      dash.visible = dot.visible = blocked;
      this.through.toArray(ends, 0);
      this.to.toArray(ends, 3);
      dash.setPoints(ends);
    },
  };
}

export function createShadowRays({ sun, spot, logo, wall, plinth, parent }) {
  // The wall's front face and the plinth's top, where the rays land.
  const wallFront = new Plane(
    new Vector3(0, 0, 1),
    -(wall.position.z + wall.geometry.bounds3D.max.z),
  );
  const plinthTop = new Plane(
    new Vector3(0, 1, 0),
    -(plinth.position.y + plinth.geometry.bounds3D.max.y),
  );
  const left = createRay('p', parent);
  const right = createRay('js', parent);
  const rays = [left, right];

  /** A point on a logo piece in world space, `at` in fractions of its half extents, on its back face if `back` */
  function onLogo(id, at, out, back = false) {
    logo.pointOn(id, at[0], at[1], out);
    if (back) out.z -= 2 * logo.pieces[id].half.z;

    return logo.root.toGlobal(out, out);
  }

  /** Where the active light's ray through `point` lands, leaving its direction in `_beam` */
  function land(point, out) {
    if (sun.visible) sun.getGlobalTransform(_matrix).extractForward(_beam);
    else
      _beam.copyFrom(point).subtract(spot.getGlobalPosition(_apex)).normalize();
    _ray.set(point, _beam);
    if (
      !_ray.intersectPlane(wallFront, out) ||
      plinthTop.distanceToPoint(out) < 0
    )
      _ray.intersectPlane(plinthTop, out);

    return out;
  }

  return {
    /** The ray past the P, whose tail the sun's name sits on */
    left,
    /** Redraws both rays for the light that's on, and puts where a third, past the P's top edge, lands in `target` */
    update(narrow, target) {
      const caster = sun.visible ? sun : spot;
      const graze = GRAZE[sun.visible ? 'sun' : 'spot'];
      // The logo blocks the rays only while the light and the logo both cast.
      const blocked = caster.castShadow && logo.meshes[0].castShadow;

      for (const ray of rays) {
        land(onLogo(ray.piece, graze[ray.piece], ray.through), ray.to);
        if (sun.visible)
          ray.from
            .copyFrom(ray.through)
            .addScaledVector(
              _beam,
              -SUN_RAY_LENGTH[narrow ? 'narrow' : 'wide'],
            );
        else spot.getGlobalPosition(ray.from);
        ray.draw(blocked, narrow);
      }
      land(onLogo('p', graze.loupe, target, true), target);
    },
  };
}
