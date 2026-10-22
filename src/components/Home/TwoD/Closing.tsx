import ClayShape from '@site/src/components/ui/Clay';
import ClosingCard from '../ClosingCard';
import { CLOSING } from '../content/twoD';
import MagneticButton from '../MagneticButton';

/** The `/2d` closing card, with flat shapes on its corners */
export default function Closing() {
  return (
    <ClosingCard
      title={CLOSING.title}
      titleId="closing-title"
      lede={CLOSING.lede}
      corners={{
        tl: <ClayShape shape="triangle-pink-fill" depth={0.25} />,
        tr: <ClayShape shape="pentagon-blue-fill" depth={0.25} />,
        br: <ClayShape shape="circle-pink-fill" depth={0.25} />,
        bl: <ClayShape shape="star-purple-fill" depth={0.25} />,
      }}
    >
      <MagneticButton to="/8.x/guides/getting-started/intro" arrow>
        Getting started
      </MagneticButton>
      <MagneticButton to="/3d" variant="outline-pink">
        Explore 3D
      </MagneticButton>
    </ClosingCard>
  );
}
