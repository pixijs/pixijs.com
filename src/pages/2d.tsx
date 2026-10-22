import Band from '@site/src/components/Home/Band';
import { TOOLBOX, TOUR_2D } from '@site/src/components/Home/content/twoD';
import ExamplesTeaser from '@site/src/components/Home/ExamplesTeaser';
import HomePage from '@site/src/components/Home/HomePage';
import InstallStrip from '@site/src/components/Home/InstallStrip';
import MagneticButton from '@site/src/components/Home/MagneticButton';
import NebulonHero from '@site/src/components/Home/NebulonHero';
import StageDemo from '@site/src/components/Home/StageDemo';
import TileGrid from '@site/src/components/Home/TileGrid';
import Closing from '@site/src/components/Home/TwoD/Closing';
import Performance from '@site/src/components/Home/TwoD/Performance';
import twoD, { TWO_D_CSS } from '@site/src/components/Home/TwoD/styles';
import Chip from '@site/src/components/ui/Chip';
import { Squiggle } from '@site/src/components/ui/SectionHead';

export default function Home2D() {
  return (
    <HomePage
      title="PixiJS 2D | The HTML5 Creation Engine"
      description="PixiJS draws sprites, text, graphics and filters in one scene graph on WebGPU or WebGL. Guides, tutorials, examples and the API for the 2D engine."
    >
      <style dangerouslySetInnerHTML={{ __html: TWO_D_CSS }} />
      <NebulonHero
        title={
          <>
            Build{' '}
            <span data-accent-group="">
              <span data-accent="">2D</span>
              <Squiggle stretch />
            </span>{' '}
            games and apps that run in every browser
          </>
        }
        actions={
          <>
            <MagneticButton to="/8.x/guides/getting-started/intro" arrow intro={0}>
              Getting started
            </MagneticButton>
            <MagneticButton to="/8.x/tutorials" variant="outline" glass arrow intro={1}>
              Tutorials
            </MagneticButton>
          </>
        }
        chips={
          <>
            <Chip to="/llms" badge="NEW">
              Skills for AI coding agents
            </Chip>
            <Chip to="/3d" badge="3D" prompt={false}>
              PixiJS 3D is in preview
            </Chip>
          </>
        }
      />
      <Band next="bg-alt" wave="c" labelledBy="install-title">
        <InstallStrip install="npm install pixi.js" />
      </Band>
      <Band surface="bg-alt" glow next="bg" wave="a">
        <StageDemo {...TOUR_2D} />
      </Band>
      <Band next="bg-alt" wave="b" labelledBy="toolbox-title" className={twoD.toolboxBand}>
        <TileGrid {...TOOLBOX} id="toolbox-title" />
      </Band>
      <Band surface="bg-alt" glow next="bg" wave="c" labelledBy="performance-title">
        <Performance />
      </Band>
      <Band next="bg-alt" wave="a" labelledBy="examples-title">
        <ExamplesTeaser />
      </Band>
      <Band surface="bg-alt" labelledBy="closing-title" className={twoD.closingBand}>
        <Closing />
      </Band>
    </HomePage>
  );
}
