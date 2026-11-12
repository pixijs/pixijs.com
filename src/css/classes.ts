/**
 * Class names for a stylesheet a component inlines, since Docusaurus merges every CSS module into the one site-wide
 * stylesheet: `prefixedClasses('px-blog').coverHeadline` is `px-blog-cover-headline`, and with `kebab: false` it
 * keeps the name as written (`sg-coverHeadline`). It imports nothing, so using it never pulls another stylesheet in.
 */
export function prefixedClasses(prefix: string, { kebab = true } = {}): Record<string, string> {
  return new Proxy(
    {},
    {
      get: (_, name) => {
        const key = String(name);

        return `${prefix}-${kebab ? key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`) : key}`;
      },
    },
  );
}
