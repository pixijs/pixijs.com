export type Rgba = [r: number, g: number, b: number, a: number];

/** Parses a computed `rgb()` or `rgba()` colour */
export function parseColor(value: string): Rgba {
  const [r = 0, g = 0, b = 0, a = 1] = (value.match(/[\d.]+/g) ?? []).map(Number);

  return [r, g, b, a];
}

const hex2 = (n: number) => Math.round(n).toString(16).padStart(2, '0');

export function formatColor([r, g, b, a]: Rgba): string {
  return a < 1 ? `rgb(${r} ${g} ${b} / ${+a.toFixed(3)})` : `#${hex2(r)}${hex2(g)}${hex2(b)}`;
}

const channel = (c: number) => {
  const s = c / 255;

  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

const luminance = ([r, g, b]: Rgba) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

/** WCAG 2.2 contrast ratio of two opaque colours */
export function contrast(fg: Rgba, bg: Rgba): number {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);

  return (hi + 0.05) / (lo + 0.05);
}

/** Resolves CSS colours inside `scope` (which carries a theme) by painting them on a throwaway probe */
export function resolveColors(scope: Element, values: string[]): string[] {
  const probe = document.createElement('span');

  scope.appendChild(probe);
  const resolved = values.map((value) => {
    probe.style.color = value;

    return getComputedStyle(probe).color;
  });

  probe.remove();

  return resolved;
}

export const cssColor = (token: string) => (token.startsWith('#') ? token : `var(--px-${token})`);
