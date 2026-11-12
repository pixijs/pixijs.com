/**
 * The memory the castles hold: the bytes on the GPU and on the CPU for the pane, how many castles leaked, and what
 * each castle still keeps for the visuals
 *
 * The engine has no memory readout to ask, so this counts from public sizes and follows the engine's own events: a
 * geometry's buffers' `byteLength`, a map's pixels, `'unload'` and `'destroy'` on each geometry and texture source,
 * and whether a castle's root is in a view. It reads the scene each frame and never changes it, so `index.ts` runs the
 * same without it.
 */

/** MB as GPU tools count it, 1024 × 1024 bytes */
const MB = 1024 * 1024;

/** Which copies of a part are left: both (it's on the GPU, and its CPU copy stays too), the CPU copy only, or none */

/** What a castle still keeps of its shape (its geometry) and of its map (the painted texture's source) */

/** What the pane's read-only rows show: MB held by every castle, leaked ones too, and how many castles leaked */

/** One geometry or texture source a castle built: its bytes in each copy, and which copies exist now */

/** A castle, its geometries' and map's copies, and what they add up to */

/** What a castle that's freed whole, or back in the scene, leaves behind */
export const NOTHING_LEFT = { shape: 'none', map: 'none' };

/** A source's GPU bytes: its pixels, and with mipmaps the whole chain down to 1 × 1 */
function gpuBytes(source) {
  const { pixelWidth: width, pixelHeight: height } = source;
  // `mipLevelCount` reads 1 until the first upload, so the chain is counted from the size.
  const levels = source.autoGenerateMipmaps
    ? Math.floor(Math.log2(Math.max(width, height))) + 1
    : 1;
  let bytes = 0;

  for (let i = 0; i < levels; i++)
    bytes += Math.max(1, width >> i) * Math.max(1, height >> i) * 4;

  return bytes;
}

/** Follows one resource's `'unload'` and `'destroy'`, which free its GPU copy and then everything */
function follow(emitter, cpu, gpu) {
  const held = { cpu, gpu, onGpu: false, alive: true };

  emitter.on('unload', () => {
    held.onGpu = false;
  });
  emitter.on('destroy', () => {
    held.onGpu = held.alive = false;
  });

  return held;
}

/** Starts following the copies of everything a castle built */
function track(castle) {
  // A geometry's GPU copy is its buffers, as many bytes as the vertex arrays it keeps on the CPU.
  const shape = castle.geometries.map((geometry) => {
    const bytes = geometry.buffers.reduce(
      (total, buffer) => total + buffer.data.byteLength,
      0,
    );

    return follow(geometry, bytes, bytes);
  });
  const map = castle.textures.map(({ source }) =>
    follow(
      source,
      source.pixelWidth * source.pixelHeight * 4,
      gpuBytes(source),
    ),
  );

  return { castle, shape, map, holding: { shape: 'none', map: 'none' } };
}

/** How many of `items` aren't destroyed yet */
function countAlive(items) {
  let alive = 0;

  for (const item of items) if (!item.destroyed) alive++;

  return alive;
}

/** Follows the castles `bays` hold, and keeps following each one until everything it built is freed */
export function createMemory(bays) {
  const tracked = [];
  const readout = { gpu: 0, cpu: 0, leaked: 0 };
  const bytes = { gpu: 0, cpu: 0 };

  function find(castle) {
    for (const entry of tracked) if (entry.castle === castle) return entry;

    return null;
  }

  /** Adds one part's copies to the totals, marking those a drawn castle has just uploaded, and says which are left */
  function tally(held, shown) {
    let kept = 'none';

    for (const copy of held) {
      if (!copy.alive) continue;
      // A castle in a view draws this frame, and its first draw uploads whatever isn't on the GPU.
      copy.onGpu ||= shown;
      bytes.cpu += copy.cpu;
      if (copy.onGpu) bytes.gpu += copy.gpu;
      if (kept !== 'gpu') kept = copy.onGpu ? 'gpu' : 'cpu';
    }

    return kept;
  }

  return {
    readout,
    holding(castle) {
      return find(castle)?.holding ?? NOTHING_LEFT;
    },
    update() {
      for (const { castle } of bays)
        if (castle && !find(castle)) tracked.push(track(castle));

      bytes.gpu = bytes.cpu = 0;
      readout.leaked = 0;
      for (let i = tracked.length - 1; i >= 0; i--) {
        const { castle, shape, map, holding } = tracked[i];
        const shown = castle.root.view3d !== null;

        holding.shape = tally(shape, shown);
        holding.map = tally(map, shown);
        if (!castle.root.destroyed) continue;
        // A destroyed castle whose meshes, materials or copies live on holds memory nothing uses: it leaked.
        const kept = holding.shape !== 'none' || holding.map !== 'none';

        if (
          kept ||
          countAlive(castle.meshes) > 0 ||
          countAlive(castle.materials) > 0
        )
          readout.leaked++;
        else tracked.splice(i, 1);
      }
      readout.gpu = bytes.gpu / MB;
      readout.cpu = bytes.cpu / MB;
    },
  };
}
