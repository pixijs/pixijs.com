import Layout from '@theme/Layout';
import Showcase from './ShowcasePage';

function App() {
  return (
    <Layout>
      <Showcase
        title="PixiJS Showcase"
        subtitle="Explore cutting-edge interactive projects demonstrating the full potential of PixiJS."
        animationDelay={100}
      />
    </Layout>
  );
}

export default App;
