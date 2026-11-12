/**
 * Reading what the shader reads: each spark's birth record in the system's vertex buffer, and the formula the motion
 * bit runs on it
 *
 * `ParticleSystem3D` writes a spark once, when it's born: where it started, its launch velocity, when, and for how
 * long. Every frame the vertex shader works out where the spark is from that record and `time`. So by reading
 * `sparks.data` alone, this file finds the batches written since the last frame and puts a spark where the shader
 * puts it. It never writes to the buffer.
 */

/** Floats a traced spark keeps: where it launched, its velocity and its life, which is last */
export const TRACE_FLOATS = 7;
export const TRACE_LIFE = 6;
/** The most batches one frame can write here: a tap and a pop, with room to spare */
const MAX_BATCHES = 4;
/** Below this drag the shader takes the drag-free form, which is also the exact limit */
const NO_DRAG = 1e-4;
const NO_GRAVITY = { x: 0, y: 0, z: 0 };

/** Sparks written together, by one `spawn` call or one burst: every one is stamped with the same birth */

export function createSparkRecords(sparks) {
  const { f32, floatStride, offsets } = sparks.data;
  const capacity = sparks.capacity;
  // A spark is four vertices holding the same record, and each attribute sits `offsets[name] / 4` floats in.
  const stride = 4 * floatStride;
  const field = {
    position: offsets.aPosition / 4,
    velocity: offsets.aVel / 4,
    // When the spark was born, on the system's clock, and how many seconds it lives.
    birth: offsets.aBirth / 4,
    life: offsets.aLife / 4,
  };
  // The birth each slot held last frame: a slot whose birth changed was written since.
  const seen = new Float32Array(capacity);
  const batches = Array.from({ length: MAX_BATCHES }, () => ({
    count: 0,
    birth: 0,
    y: 0,
    first: 0,
    end: 0,
  }));

  /** The batch among the `found` so far whose sparks were born at `birth`, or -1 */
  function batchOf(birth, found) {
    for (let b = 0; b < found; b++) if (batches[b].birth === birth) return b;

    return -1;
  }

  return {
    readNew(onBatch) {
      let found = 0;

      for (let slot = 0; slot < capacity; slot++) {
        const base = slot * stride;
        const birth = f32[base + field.birth];

        if (birth === seen[slot]) continue;
        seen[slot] = birth;
        // `clear()` zeroes a slot: a change, but no birth.
        if (f32[base + field.life] <= 0) continue;

        let b = batchOf(birth, found);

        if (b < 0) {
          if (found === MAX_BATCHES) continue;
          b = found++;
          batches[b].count = batches[b].y = 0;
          batches[b].birth = birth;
          batches[b].first = batches[b].end = slot;
        }

        const batch = batches[b];

        // A batch that wrapped round the pool is found as its tail from slot 0, then its head: the head starts it.
        if (slot !== batch.end) batch.first = slot;
        batch.end = slot + 1;
        batch.count++;
        batch.y += f32[base + field.position + 1];
      }

      for (let b = 0; b < found; b++) {
        batches[b].y /= batches[b].count;
        onBatch(batches[b]);
      }
    },
    trace(slot, out, offset) {
      const base = slot * stride;

      for (let i = 0; i < 3; i++) {
        out[offset + i] = f32[base + field.position + i];
        out[offset + 3 + i] = f32[base + field.velocity + i];
      }
      out[offset + TRACE_LIFE] = f32[base + field.life];
    },
  };
}

/**
 * Where a traced spark is `age` seconds after its birth, as the motion bit works it out
 *
 * p = p0 + v·a + g·b, with a = (1 − e^(−k·t)) / k and b = (t − a) / k for drag k, which tend to t and t²/2 as k goes
 * to 0. Gravity and drag are the system's uniforms, so a spark's path is its record and these two numbers.
 */
export function sparkAt(trace, offset, age, sparks, out) {
  const g = sparks.gravity ?? NO_GRAVITY;
  const k = sparks.drag ?? 0;
  let a = age;
  let b = (age * age) / 2;

  if (k > NO_DRAG) {
    a = (1 - Math.exp(-k * age)) / k;
    b = (age - a) / k;
  }

  return out.set(
    trace[offset] + trace[offset + 3] * a + g.x * b,
    trace[offset + 1] + trace[offset + 4] * a + g.y * b,
    trace[offset + 2] + trace[offset + 5] * a + g.z * b,
  );
}
