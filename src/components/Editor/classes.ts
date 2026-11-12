import stylesheet from '!!raw-loader!sass-loader!./styles.scss';

/**
 * Docusaurus merges every CSS module into the one site-wide stylesheet, so the editor compiles its SCSS to a string
 * and ships it in its own chunk instead (the `<style>` in Editor.tsx), keeping it off pages without an editor
 */
export const STYLESHEET = stylesheet;

/** `styles.header` → `px-ed-header`, the prefixed class names in styles.scss */
const styles = new Proxy({} as Record<string, string>, { get: (_, name) => `px-ed-${String(name)}` });

export default styles;
