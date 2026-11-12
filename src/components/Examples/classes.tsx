import stylesheet from '!!raw-loader!sass-loader!./styles.scss';

/**
 * The stylesheet for the galleries, the example sheet and the playground. Docusaurus merges every CSS module into the
 * one site-wide stylesheet, so these pages compile their SCSS to a string and inline it instead.
 */
export function ExamplesStyles() {
  return <style dangerouslySetInnerHTML={{ __html: stylesheet }} />;
}

/** `styles.card` → `px-ex-card`, the prefixed class names in styles.scss */
const styles = new Proxy({} as Record<string, string>, { get: (_, name) => `px-ex-${String(name)}` });

export default styles;
