# Mesh

PixiJS v8 offers a powerful `Mesh` system that provides full control over geometry, UVs, indices, shaders, and WebGL/WebGPU state. Meshes are ideal for custom rendering effects, advanced distortion, perspective manipulation, or performance-tuned rendering pipelines.

```ts
import { Texture, Mesh, MeshGeometry, Shader } from 'pixi.js';

const geometry = new MeshGeometry({
    positions: new Float32Array([0, 0, 100, 0, 100, 100, 0, 100]),
    uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
    indices: new Uint32Array([0, 1, 2, 0, 2, 3]),
});

const shader = Shader.from({
    gl: {
        vertex: `
            attribute vec2 aPosition;
            attribute vec2 aUV;
            varying vec2 vUV;
            void main() {
                gl_Position = vec4(aPosition / 100.0 - 1.0, 0.0, 1.0);
                vUV = aUV;
            }
        `,
        fragment: `
            precision mediump float;
            varying vec2 vUV;
            uniform sampler2D uSampler;
            void main() {
                gl_FragColor = texture2D(uSampler, vUV);
            }
        `,
    },
    resources: {
        uSampler: Texture.from('image.png').source,
    },
});

const mesh = new Mesh({ geometry, shader });
app.stage.addChild(mesh);
```

## **What Is a Mesh?**

A mesh is a low-level rendering primitive composed of:

- **Geometry**: Vertex positions, UVs, indices, and other attributes
- **Shader**: A GPU program that defines how the geometry is rendered
- **State**: GPU state configuration (e.g. blending, depth, stencil)

With these elements, you can build anything from simple quads to curved surfaces and procedural effects.

## **MeshGeometry**

All meshes in PixiJS are built using the `MeshGeometry` class. This class allows you to define the vertex positions, UV coordinates, and indices that describe the mesh's shape and texture mapping.

```ts
const geometry = new MeshGeometry({
    positions: Float32Array, // 2 floats per vertex
    uvs: Float32Array, // matching number of floats
    indices: Uint32Array, // 3 indices per triangle
    topology: 'triangle-list',
});
```

You can access and modify buffers directly:

```ts
geometry.positions[0] = 50;
geometry.uvs[0] = 0.5;
geometry.indices[0] = 1;
```

## Built-in Mesh Types

### MeshSimple

A minimal wrapper over `Mesh` that accepts vertex, UV, and index arrays directly. Suitable for fast static or dynamic meshes.

```ts
const mesh = new MeshSimple({
    texture: Texture.from('image.png'),
    vertices: new Float32Array([0, 0, 100, 0, 100, 100, 0, 100]),
    uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
    indices: new Uint32Array([0, 1, 2, 0, 2, 3]),
});
```

- Use `autoUpdate = true` to update geometry per frame.
- Access `mesh.vertices` to read/write data.

### MeshRope

Bends a texture along a series of control points, often used for trails, snakes, and animated ribbons.

```ts
const points = [new Point(0, 0), new Point(100, 0), new Point(200, 50)];
const rope = new MeshRope({
    texture: Texture.from('snake.png'),
    points,
    textureScale: 1, // optional
});
```

- `textureScale > 0` repeats texture; `0` stretches it.
- `autoUpdate = true` re-evaluates geometry each frame.

### MeshPlane

A flexible subdivided quad mesh, suitable for distortion or grid-based warping.

```ts
const plane = new MeshPlane({
    texture: Texture.from('image.png'),
    verticesX: 10,
    verticesY: 10,
});
```

- Automatically resizes on texture update when `autoResize = true`.

### PerspectiveMesh

A special subclass of `MeshPlane` that applies perspective correction by transforming the UVs.

```ts
const mesh = new PerspectiveMesh({
    texture: Texture.from('image.png'),
    verticesX: 20,
    verticesY: 20,
    x0: 0,
    y0: 0,
    x1: 300,
    y1: 30,
    x2: 280,
    y2: 300,
    x3: 20,
    y3: 280,
});
```

- Set corner coordinates via `setCorners(...)`.
- Ideal for emulating 3D projection in 2D.

## **API Reference**

### `Mesh`

| Property / Method | Description                                                            |
| ----------------- | ---------------------------------------------------------------------- |
| **geometry**      | `MeshGeometry` holding positions, uvs, indices, topology.              |
| **shader**        | Represents the vertex and fragment shaders that processes the geometry |
| **texture**       | Bound texture used by the shader (if applicable).                      |
| **state**         | GPU state object defining WebGL/WebGPU settings.                       |
| **batched**       | Whether mesh can be batched for performance (read-only).               |
| **position**      | Local position (`.x`, `.y`)                                            |
| **x**             | X position in pixels                                                   |
| **y**             | Y position in pixels                                                   |
| **width**         | Width in pixels                                                        |
| **height**        | Height in pixels                                                       |
| **rotation**      | Rotation in radians                                                    |
| **angle**         | Rotation in degrees (alias for `rotation`)                             |
| **scale**         | `.x` and `.y` scale factors                                            |
| **pivot**         | Transform origin for scaling/rotation                                  |
| **skew**          | Skew values in radians                                                 |
| **alpha**         | Opacity (0 to 1)                                                       |
| **visible**       | Whether the container and its subtree is rendered                      |
| **tint**          | Tint color                                                             |
| **renderable**    | Whether the container itself is renderable (still updates children)    |

---

### `MeshGeometry`

| Property / Method | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| **positions**     | Float32Array of vertex positions.                          |
| **uvs**           | Float32Array of UV coordinates.                            |
| **indices**       | Uint32Array defining triangle indices.                     |
| **topology**      | Mesh topology: `'triangle-list'`, `'triangle-strip'`, etc. |
