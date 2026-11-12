/**
 * One visual in the gallery as the pane sees it, and the set shape each visuals file returns
 *
 * `visuals.ts` and the files it builds from both import this, so it sits apart from them all.
 */

/** The pane folder a visual's row sits in */

/** One visual in the gallery, which the pane shows or hides */

/** A few visuals built together, and their per-frame code */

/** A visual whose parts show and hide together with its name tag; the inset's title is its name, so it has none */
export function visual(name, group, parts, tag) {
  return {
    name,
    group,
    show(shown) {
      for (const part of parts) part.visible = shown;
      if (tag) tag.hidden = !shown;
    },
  };
}
