import stylesheet from '!!raw-loader!sass-loader!./page.scss';

/** The pages' stylesheet, which `Page` inlines so it stays out of the site-wide CSS */
export const STYLESHEET = stylesheet;

/**
 * Class names for a stylesheet a page inlines through `Page`'s `css`, which keeps it out of the site-wide CSS:
 * `pageClasses('page').closingTitle` is `px-page-closing-title`
 */
export function pageClasses(prefix: string): Record<string, string> {
  return new Proxy(
    {},
    { get: (_, name) => `px-${prefix}-${String(name).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}` },
  );
}

const styles = pageClasses('page');

export default styles;
