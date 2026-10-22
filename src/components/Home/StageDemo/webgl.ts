let webgl2: boolean | undefined;

/**
 * WebGL2 is what the live scenes need; checked before their chunk downloads, so browsers without it skip it. The
 * answer is kept, so the page's scenes don't each make a throwaway context to ask.
 */
export function hasWebGL2(): boolean {
  if (webgl2 === undefined) {
    try {
      const gl = document.createElement('canvas').getContext('webgl2');

      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      webgl2 = !!gl;
    } catch {
      webgl2 = false;
    }
  }

  return webgl2;
}
