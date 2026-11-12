/** How the bits write a JavaScript number into their shader source, so one constant serves the WGSL and the GLSL */

/**
 * A number as a float literal both WGSL and GLSL read: `3` becomes `3.0`, and `2.65` stays `2.65`
 *
 * GLSL won't multiply a float by an integer literal, so a whole number needs its `.0`. Anything else is written in
 * full, never rounded.
 */
export function floatLiteral(value) {
  return Number.isInteger(value) ? value.toFixed(1) : String(value);
}
