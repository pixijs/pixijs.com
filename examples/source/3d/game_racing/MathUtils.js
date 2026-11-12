export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function lerp(x, y, t) {
  return (1 - t) * x + t * y;
}
