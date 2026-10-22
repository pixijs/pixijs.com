import { PageMetadata } from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import ThreeDHome from '@site/src/components/Home/ThreeD';
import { usePixi3d } from '@site/src/components/Home/ThreeD/usePixi3d';

export default function Pixi3D() {
  const beta = usePixi3d().status === 'beta';

  return (
    <Layout
      title="PixiJS 3D"
      description={`PixiJS 3D brings meshes, PBR materials, lights and glTF models to the PixiJS stage.${beta ? ' Now in closed beta.' : ''}`}
    >
      <PageMetadata image="/images/og/pixi-3d.jpg" />
      <ThreeDHome />
    </Layout>
  );
}
