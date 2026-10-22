import clsx from 'clsx';
import { Highlight } from 'prism-react-renderer';
import { useRef } from 'react';
import Card from '@site/src/components/ui/Card';
import SectionHead from '@site/src/components/ui/SectionHead';
import Tag from '@site/src/components/ui/Tag';
import { gsap, ScrollTrigger, settle } from '@site/src/motion/gsap';
import { useMotion } from '@site/src/motion/useMotion';
import { pixiDark } from '@site/src/theme/prism/pixi';
import { HEAD } from '../Band';
import { PARITY } from '../content/threeD';
import styles from './styles';

/** Only the words scramble; the spaces between them hold the line's shape */
const SCRAMBLE = 'abcdefghijklmnopqrstuvwxyz(){}=.;';

/** "Everything you know, plus a z": four things that work the way they do in 2D, each with the code that shows it */
export default function Parity() {
  const list = useRef<HTMLOListElement>(null);

  // Each sample types itself in once, as its card scrolls into view: line after line, each from its left
  useMotion(list, (root, { paused }) => {
    if (paused) return;
    for (const sample of gsap.utils.toArray<HTMLElement>('pre', root)) {
      if (ScrollTrigger.isInViewport(sample, 0.1)) continue;
      const lines = gsap.utils
        .toArray<HTMLElement>('[data-line]', sample)
        .map((line) => gsap.utils.toArray<HTMLElement>('[data-token]', line))
        .filter((tokens) => tokens.length);

      ScrollTrigger.create({
        trigger: sample,
        start: 'top 88%',
        once: true,
        onEnter: () =>
          lines.forEach((tokens, i) =>
            settle(
              gsap.to(tokens, {
                duration: 0.3,
                delay: 0.1 + i * 0.08,
                ease: 'none',
                stagger: { amount: 0.12 },
                scrambleText: { text: '{original}', chars: SCRAMBLE, speed: 0.6 },
              }),
            ),
          ),
      });
    }
  });

  return (
    <>
      <SectionHead eyebrow={PARITY.eyebrow} title={PARITY.title} className={HEAD} />
      <ol ref={list} className={styles.parity}>
        {PARITY.cards.map((card, i) => (
          <li key={card.title} data-reveal="">
            <Card className={styles.parityCard}>
              <div className={styles.parityText}>
                <p className={styles.parityIndex}>
                  <span aria-hidden="true">0{i + 1}</span>
                  <Tag>{card.api}</Tag>
                </p>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
              <Highlight code={card.code.trim()} language="ts" theme={pixiDark}>
                {({ tokens, getTokenProps }) => (
                  <pre className={clsx(styles.sample, 'px-on-dark')}>
                    <code>
                      {tokens.map((line, n) => (
                        <span key={n} data-line="">
                          {line.map((token, key) => {
                            const { children, ...props } = getTokenProps({ token });
                            const [, lead, word, trail] = /^(\s*)(.*?)(\s*)$/.exec(children) ?? [];

                            return (
                              <span key={key} {...props}>
                                {lead}
                                {word && <span data-token="">{word}</span>}
                                {trail}
                              </span>
                            );
                          })}
                          {'\n'}
                        </span>
                      ))}
                    </code>
                  </pre>
                )}
              </Highlight>
            </Card>
          </li>
        ))}
      </ol>
    </>
  );
}
