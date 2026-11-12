import { PageMetadata } from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import ThreeDHome from '@site/src/components/Home/ThreeD';

export default function Pixi3D() {
  return (
    <Layout
      title="PixiJS 3D"
      description="PixiJS 3D brings meshes, PBR materials, lights and glTF models to the PixiJS stage. Now in open beta."
    >
      <PageMetadata image="/images/og/pixi-3d.jpg" />
      <ThreeDHome />
    </Layout>
  );
}
