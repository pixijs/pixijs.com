/**
 * The page's drop target: a hint along the bottom that a .glb or .gltf dropped anywhere shows on the stage, and that
 * opens a file picker when pressed, since a phone can't drag a file in
 *
 * It's plain DOM and knows nothing of the scene: it hands the file it gets to `onFile`, and shows the status
 * `index.ts` gives it.
 */

import { overlayColor, PANEL_ALPHA } from './theme/overlay';
import { BRAND, cssColor } from './theme/palette';

/** The files the viewer loads */
const MODEL_FILE = /\.(glb|gltf)$/i;
/** What the hint says while nothing is loading */
const HINT = 'Drop or choose a .glb or .gltf to view it';
/** What it says while a file is dragged over the page */
const DRAG_HINT = 'Let go to view it';
/** An arrow into a tray, drawn in the brand pink before the text */
const ICON =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2.5v7M4.75 6.5 8 9.75l3.25-3.25' +
  'M2.5 10.5v2.5h11v-2.5"/></svg>';
/** The hint's fill, as opaque as the panels, and its dashed edge's, a step quieter than its text: hex alphas */
const FILL_ALPHA = Math.round(PANEL_ALPHA * 255).toString(16);
const EDGE_ALPHA = '8c';
/** The hint's height and its gap from the window's bottom, in CSS pixels */
const HINT_HEIGHT = 36;
const HINT_BOTTOM = 20;
/** The band along the window's bottom the hint covers, with a gap above it, in CSS pixels */
export const HINT_BAND = HINT_BOTTOM + HINT_HEIGHT + 8;

export function createDropZone({ stage, onFile }) {
  const hint = document.createElement('button');
  const icon = document.createElement('span');
  const text = document.createElement('span');
  const picker = document.createElement('input');
  // Shown over the whole page while a file is dragged in, with a dashed frame drawn inside it.
  const target = document.createElement('div');
  const frame = document.createElement('div');
  let status = null;
  let painted = -1;

  hint.type = 'button';
  hint.style.cssText =
    `position:fixed;left:50%;bottom:${HINT_BOTTOM}px;transform:translateX(-50%);z-index:5;display:flex;` +
    `align-items:center;gap:8px;max-width:calc(100vw - 32px);height:${HINT_HEIGHT}px;box-sizing:border-box;` +
    'padding:0 16px;border-radius:999px;border:1.5px dashed var(--edge);' +
    'font:500 13px system-ui,-apple-system,"Segoe UI",sans-serif;white-space:nowrap;cursor:pointer;' +
    'transition:border-color 0.15s';
  icon.innerHTML = ICON;
  icon.style.cssText = `display:flex;color:${cssColor(BRAND.pink)}`;
  text.style.cssText = 'overflow:hidden;text-overflow:ellipsis';
  hint.append(icon, text);
  // No `accept` filter: iOS greys out files whose type it doesn't know, .glb among them.
  picker.type = 'file';
  picker.hidden = true;
  target.style.cssText = 'position:fixed;inset:0;z-index:8;display:none';
  // The pointer passes through the frame, so drag events land on the target alone.
  frame.style.cssText =
    `position:absolute;inset:12px;pointer-events:none;border-radius:16px;` +
    `border:2px dashed ${cssColor(BRAND.pink)};background:${cssColor(BRAND.pink)}0f`;
  target.append(frame);
  document.body.append(hint, picker, target);

  function showText() {
    text.textContent =
      target.style.display === 'block' ? DRAG_HINT : (status ?? HINT);
  }

  function setDragging(dragging) {
    target.style.display = dragging ? 'block' : 'none';
    // Dashed in the theme's soft ink until a drag lights it pink.
    hint.style.borderColor = dragging ? cssColor(BRAND.pink) : 'var(--edge)';
    showText();
  }

  function take(files) {
    const file = Array.from(files ?? []).find(({ name }) =>
      MODEL_FILE.test(name),
    );

    if (file) onFile(file);
  }

  hint.addEventListener('click', () => picker.click());
  picker.addEventListener('change', () => {
    take(picker.files);
    // Cleared, so choosing the same file again still fires `change`.
    picker.value = '';
  });
  window.addEventListener('dragenter', () => setDragging(true));
  // The target covers the page and the pointer passes through its frame, so it hears `dragleave` only when the drag
  // leaves the page.
  target.addEventListener('dragleave', () => setDragging(false));
  // Taken on the window, so a file let go anywhere lands here; without this the browser opens the file itself.
  window.addEventListener('dragover', (event) => event.preventDefault());
  window.addEventListener('drop', (event) => {
    event.preventDefault();
    setDragging(false);
    take(event.dataTransfer?.files);
  });
  showText();

  return {
    setStatus(next) {
      status = next;
      showText();
    },
    update() {
      const { darkness } = stage;

      if (darkness === painted) return;
      painted = darkness;
      hint.style.background =
        cssColor(overlayColor('panel', darkness)) + FILL_ALPHA;
      hint.style.color = cssColor(overlayColor('ink', darkness));
      hint.style.setProperty(
        '--edge',
        cssColor(overlayColor('inkSoft', darkness)) + EDGE_ALPHA,
      );
    },
  };
}
