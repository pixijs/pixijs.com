import type { SourceFiles } from '@site/src/runtime/compile';
import type { Renderer } from '@site/src/runtime/frame';

/** What a share link holds */
export interface SharedState {
  files: SourceFiles;
  renderer?: Renderer;
}

/** Longer encodings go in the hash, which never reaches a server, so no URL length limit applies */
export const HASH_THRESHOLD = 6000;

const PREFIX = 'v2.';

async function pipe(
  bytes: Uint8Array<ArrayBuffer>,
  stream: CompressionStream | DecompressionStream,
): Promise<Uint8Array<ArrayBuffer>> {
  return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
}

function toBase64Url(bytes: Uint8Array<ArrayBuffer>): string {
  let binary = '';

  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array<ArrayBuffer> {
  const binary = atob(text.replace(/-/g, '+').replace(/_/g, '/'));

  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

/** `v2.<base64url(deflate-raw(JSON))>`, about half the size of the legacy format and able to hold several files */
export async function encodeState(state: SharedState): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(state));

  return PREFIX + toBase64Url(await pipe(json, new CompressionStream('deflate-raw')));
}

/**
 * Reads a `v2.` state, or the legacy `btoa(JSON.stringify(code))` of `index.js` that older share links carry.
 * Returns null for anything else.
 */
export async function decodeState(text: string): Promise<SharedState | null> {
  try {
    if (!text.startsWith(PREFIX)) {
      // A `+` that wasn't percent-encoded arrives from URLSearchParams as a space
      const code: unknown = JSON.parse(atob(text.replace(/ /g, '+')));

      return typeof code === 'string' ? { files: { 'index.js': code } } : null;
    }
    const json = await pipe(fromBase64Url(text.slice(PREFIX.length)), new DecompressionStream('deflate-raw'));
    const state = JSON.parse(new TextDecoder().decode(json)) as Partial<SharedState>;
    const files = state.files ?? {};

    if (Object.values(files).some((code) => typeof code !== 'string') || Object.keys(files).length === 0) return null;

    return {
      files,
      renderer: state.renderer === 'webgl' || state.renderer === 'webgpu' ? state.renderer : undefined,
    };
  } catch {
    return null;
  }
}

/** The state in a playground URL: `#state=` wins over `?state=` */
export function stateParam(search: string, hash: string): string | null {
  return new URLSearchParams(hash.slice(1)).get('state') ?? new URLSearchParams(search).get('state');
}
