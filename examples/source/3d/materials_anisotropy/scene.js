/**
 * The sphere's tangents, the direction the lesson's `rotation` turns from
 *
 * `SphereGeometry` lays its vertices out as a grid: `heightSegments + 1` rows from the north pole down, each of
 * `widthSegments + 1` vertices, with u = column / widthSegments running round +Y from +X towards +Z.
 */

/**
 * Tangents for a `SphereGeometry` with these segment counts, four floats a vertex as `Geometry3DOptions.tangents`
 * takes them: each one points the way u grows, round the sphere
 *
 * The w of −1 turns the bitangent the engine builds, normal × tangent × w, towards the north pole, the way v shrinks,
 * as the frame it builds from UVs does. The tangent comes from the column's angle rather than from the normal, so it
 * stays defined at the poles, where the normal has no sideways part.
 */
export function sphereTangents(widthSegments, heightSegments) {
  const columns = widthSegments + 1;
  const tangents = new Float32Array(columns * (heightSegments + 1) * 4);

  for (let row = 0; row <= heightSegments; row++) {
    for (let column = 0; column < columns; column++) {
      const theta = (column / widthSegments) * Math.PI * 2;
      const i = (row * columns + column) * 4;

      tangents[i] = -Math.sin(theta);
      tangents[i + 2] = Math.cos(theta);
      tangents[i + 3] = -1;
    }
  }

  return tangents;
}
