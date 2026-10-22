/** A squash that settles like a jelly, starting and ending at rest: keyframes for anything with `scaleX` and `scaleY` */
export const JELLY = {
  '30%': { scaleX: 1.08, scaleY: 0.9 },
  '55%': { scaleX: 0.96, scaleY: 1.06 },
  '78%': { scaleX: 1.02, scaleY: 0.98 },
  '100%': { scaleX: 1, scaleY: 1 },
  easeEach: 'sine.inOut',
};

export const JELLY_TIME = 0.9;
