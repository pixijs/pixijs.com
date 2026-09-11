import { useInView } from 'react-intersection-observer';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import BetaSignup from '../../components/Pixi3D/BetaSignup';
import ShapeField from '../../components/Pixi3D/ShapeField';
import { animShortUp } from '../../utils/utils';
import styles from './Pixi3D.module.scss';

import type React from 'react';

const SIGNUP_ANCHOR = 'sign-up';

export default function Pixi3DPage(): React.JSX.Element {
  // Docusaurus collects anchors through this API rather than by scanning for id attributes, so
  // an unregistered target makes the CTA below a broken link as far as the build is concerned.
  useBrokenLinks().collectAnchor(SIGNUP_ANCHOR);

  // Reveal by class rather than mounting on scroll, so the page height is final before the
  // hero's jump to #sign-up.
  const [signupRef, signupInView] = useInView({ triggerOnce: true });

  return (
    <>
      {/* The hero's ground has to reach the browser's own canvas, which is painted from `html`; see
          `html[data-pixi-3d]`. Set here so it is in the served markup and goes again on the way out. */}
      <Head>
        <html data-pixi-3d="" />
      </Head>
      <main className={styles.page}>
        <header className={styles.hero}>
          <ShapeField />
          <div className={styles.heroInner}>
            <img
              className={clsx(styles.logo, 'short-up-anim')}
              style={animShortUp(0.3, 0.05)}
              src="/images/logo.svg"
              alt="PixiJS"
            />
            <h1 className="short-up-anim" style={animShortUp(0.3, 0.15)}>
              Now in <span className={styles.accent}>3D</span>
            </h1>
            <h4 className="short-up-anim" style={animShortUp(0.3, 0.3)}>
              2D and 3D in one place, the PixiJS way. Sign up for early access.
            </h4>
            <Link className={clsx(styles.cta, 'short-up-anim')} style={animShortUp(0.3, 0.45)} to={`#${SIGNUP_ANCHOR}`}>
              Sign up for the beta
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </header>

        <section className={styles.signupSection}>
          <div
            ref={signupRef}
            id={SIGNUP_ANCHOR}
            className={clsx(styles.signup, signupInView && 'short-up-anim')}
            style={animShortUp(0.3, 0.15)}
          >
            <h2 className="underline">Sign up for the closed beta</h2>
            <BetaSignup />
          </div>
        </section>
      </main>
    </>
  );
}
