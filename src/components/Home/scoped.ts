/**
 * Class names for a stylesheet a home component inlines, since Docusaurus merges every CSS module into the one
 * site-wide stylesheet: `scoped('hero').copy` is `hm-hero-copy`, and `scoped().band` is `hm-band`.
 */
export function scoped(prefix?: string): Record<string, string> {
  const start = prefix ? `hm-${prefix}-` : 'hm-';

  return new Proxy({}, { get: (_, name) => `${start}${String(name)}` });
}
