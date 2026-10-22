import ClayShape from '@site/src/components/ui/Clay';
import ClosingCard from '../ClosingCard';
import { CLOSING } from '../content/threeD';
import MagneticButton from '../MagneticButton';

/** The `/3d` closing card, with clay on its corners */
export default function Closing() {
  return (
    <ClosingCard
      title={CLOSING.title}
      lede={CLOSING.lede}
      corners={{
        tl: <ClayShape shape="pyramid-cyan" depth={0.25} />,
        tr: <ClayShape shape="cube-pink" depth={0.25} />,
        br: <ClayShape shape="torus-pink" depth={0.25} />,
        bl: <ClayShape shape="sphere-violet" depth={0.25} />,
      }}
    >
      <MagneticButton to="/3d/guides/getting-started/intro" arrow>
        Getting started
      </MagneticButton>
      <MagneticButton to="/2d" variant="outline-pink">
        Explore 2D
      </MagneticButton>
    </ClosingCard>
  );
}
