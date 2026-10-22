import Link from '@docusaurus/Link';
import { useRef } from 'react';
import FAQItem from '@site/src/components/FAQ/FAQItem';
import { Accent, Band, Closing } from '@site/src/components/Page';
import MotionPage, { ClayHeader } from '@site/src/components/Page/MotionPage';
import MagneticButton from '@site/src/components/Home/MagneticButton';
import Icon from '@site/src/components/ui/Icon';
import { DISCORD, GITHUB, GITHUB_SPONSORS, OPEN_COLLECTIVE } from '@site/src/data/navigation';
import { motionAllowed } from '@site/src/motion/pause';
import { EASE, gsap } from '@site/src/motion/gsap';
import { useMotion } from '@site/src/motion/useMotion';
import styles from './FAQ.module.scss';

import type { IconName } from '@site/src/components/ui/Icon';
import type { MouseEvent, ReactNode, RefObject } from 'react';

function External({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

interface Topic {
  id: string;
  icon: IconName;
  title: string;
  text: string;
  questions: { question: string; answer: ReactNode }[];
}

const TOPICS: Topic[] = [
  {
    id: 'basics',
    icon: 'sparkles',
    title: 'The basics',
    text: "What PixiJS is, and what it isn't.",
    questions: [
      {
        question: 'What is PixiJS for?',
        answer: (
          <p>
            Everything! PixiJS is a rendering library for rich, interactive graphics, cross-platform apps and games. You
            don&apos;t have to learn the WebGPU or WebGL APIs, or deal with browser and device compatibility. Killer
            performance makes your content better, and the clean API makes it faster to build.
          </p>
        ),
      },
      {
        question: 'Is PixiJS a game engine?',
        answer: (
          <p>
            No. PixiJS is what we&apos;ve come to think of as a &quot;creation engine&quot;. At its core, PixiJS moves
            things around on screen as quickly and efficiently as possible. It just so happens that&apos;s brilliant for
            making games.
          </p>
        ),
      },
      {
        question: 'Why should I use PixiJS?',
        answer: (
          <p>
            Because you care about speed. PixiJS&apos;s number one mantra has always been speed. We keep it as lean and
            fast as we can, while still offering as many useful features as possible.
          </p>
        ),
      },
      {
        question: 'Can PixiJS do 3D?',
        answer: (
          <p>
            Yes, in preview. <Link to="/3d">PixiJS 3D</Link> adds meshes, lights, PBR materials and glTF models to the
            same stage you use for 2D.
          </p>
        ),
      },
    ],
  },
  {
    id: 'started',
    icon: 'play',
    title: 'Getting started',
    text: 'Where to get it, and where to begin.',
    questions: [
      {
        question: 'Is PixiJS free?',
        answer: (
          <p>
            PixiJS is and always will be free and open source. Financial contributions let us build features faster and
            write more in-depth documentation. You can <Link to="/sponsor">become a sponsor</Link> through{' '}
            <External href={OPEN_COLLECTIVE}>Open Collective</External> or{' '}
            <External href={GITHUB_SPONSORS}>GitHub Sponsors</External>. It&apos;s a massive help, and it&apos;ll make
            you feel good about yourself. Win-win.
          </p>
        ),
      },
      {
        question: 'Where do I get it?',
        answer: (
          <p>
            Install it from npm with <code>npm install pixi.js</code>, or start a new project with{' '}
            <code>npm create pixi.js@latest</code>. The source and every release are on{' '}
            <External href={GITHUB}>GitHub</External>, which is always the most up-to-date place to look.
          </p>
        ),
      },
      {
        question: 'How do I get started?',
        answer: (
          <p>
            Right here! Read the <Link to="/8.x/guides/getting-started/intro">guides</Link>, follow a{' '}
            <Link to="/8.x/tutorials">tutorial</Link> or open one of the <Link to="/8.x/examples">examples</Link> and
            start changing things.
          </p>
        ),
      },
    ],
  },
  {
    id: 'project',
    icon: 'heart',
    title: 'The project',
    text: 'Who builds it, and how to help.',
    questions: [
      {
        question: 'Who makes PixiJS?',
        answer: (
          <>
            <p>PixiJS has three core developers, who work on it part-time:</p>
            <ul>
              <li>
                Mat Groves (<External href="https://github.com/GoodBoyDigital">@GoodBoyDigital</External>)
              </li>
              <li>
                Sean Burns (<External href="https://github.com/Zyie">@Zyie</External>)
              </li>
              <li>
                Matt Karl (<External href="https://github.com/bigtimebuddy">@bigtimebuddy</External>)
              </li>
            </ul>
            <p>
              The project also relies on an active community of contributors and sponsors. Because the maintainers are
              part-time, sponsorship gives us more time to improve PixiJS, fix bugs and write better documentation.{' '}
              <Link to="/team">Meet the team</Link>, or support the work through{' '}
              <External href={GITHUB_SPONSORS}>GitHub Sponsors</External> or{' '}
              <External href={OPEN_COLLECTIVE}>Open Collective</External>.
            </p>
          </>
        ),
      },
      {
        question: 'I found a bug. What should I do?',
        answer: (
          <p>
            Two things. Let us know by{' '}
            <External href={`${GITHUB}/issues/new/choose`}>opening an issue on GitHub</External>. Even better, if you
            know how to fix it, open a pull request! We&apos;re always keen to welcome new contributors.
          </p>
        ),
      },
    ],
  },
];

/** Glides to a topic instead of jumping, unless motion is reduced or paused */
function glide(event: MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById(event.currentTarget.hash.slice(1));

  if (!target || !motionAllowed()) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth' });
  history.pushState(history.state, '', event.currentTarget.hash);
}

/**
 * The disclosures open and close with GSAP: the answer's box grows to its height and its paragraphs rise in, and
 * closing folds the box away before the row lets go of `open`. Without motion they snap, as native details do.
 */
function useDisclosures(scope: RefObject<HTMLElement | null>) {
  useMotion(scope, (root, { safe }) => {
    const onClick = safe((event: Event) => {
      const row = (event.currentTarget as HTMLElement).parentElement as HTMLDetailsElement;
      const answer = row.querySelector<HTMLElement>('[data-answer]');

      if (!answer || !motionAllowed()) return;
      event.preventDefault();
      gsap.killTweensOf(answer);

      if (!row.open || row.dataset.closing !== undefined) {
        const from = row.open ? answer.offsetHeight : 0;

        delete row.dataset.closing;
        row.open = true;
        gsap.fromTo(answer, { height: from }, { height: 'auto', duration: 0.5, ease: EASE.out, clearProps: 'height' });
        gsap.from(answer.querySelectorAll('p, li'), {
          opacity: 0,
          y: 12,
          duration: 0.45,
          ease: EASE.out,
          stagger: 0.05,
          delay: 0.08,
          clearProps: 'opacity,transform',
        });

        return;
      }
      row.dataset.closing = '';
      gsap.to(answer, {
        height: 0,
        duration: 0.35,
        ease: EASE.inOut,
        onComplete: () => {
          row.open = false;
          delete row.dataset.closing;
          gsap.set(answer, { clearProps: 'height' });
        },
      });
    });
    const summaries = gsap.utils.toArray<HTMLElement>('summary', root);

    summaries.forEach((summary) => summary.addEventListener('click', onClick));

    return () => summaries.forEach((summary) => summary.removeEventListener('click', onClick));
  });
}

export default function FAQPage() {
  const list = useRef<HTMLDivElement>(null);

  useDisclosures(list);

  return (
    <MotionPage>
      <ClayHeader
        eyebrow="FAQ"
        title={
          <>
            Frequently asked <Accent>questions</Accent>
          </>
        }
        lede="Quick answers about what PixiJS is, what it costs and how to get going."
        next="bg"
        clay={['cube-pink', 'pyramid-cyan']}
      >
        <nav className={styles.jumps} aria-label="Topics">
          {TOPICS.map(({ id, icon, title, questions }) => (
            <a key={id} href={`#${id}`} className={styles.jump} onClick={glide}>
              <Icon name={icon} size={16} strokeWidth={2} />
              {title}
              <span className={styles.count}>{questions.length}</span>
            </a>
          ))}
        </nav>
      </ClayHeader>

      <Band glow label="Questions">
        <div ref={list} className={styles.topics}>
          {TOPICS.map(({ id, icon, title, text, questions }) => (
            <section key={id} id={id} className={styles.topic} aria-labelledby={`${id}-title`}>
              <div className={styles.topicHead} data-reveal="">
                <span className={styles.topicIcon}>
                  <Icon name={icon} size={22} strokeWidth={1.75} />
                </span>
                <h2 id={`${id}-title`}>{title}</h2>
                <p>{text}</p>
              </div>
              <div className={styles.questions} data-reveal="">
                {questions.map(({ question, answer }) => (
                  <FAQItem key={question} question={question}>
                    {answer}
                  </FAQItem>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Band>

      <Band surface="bg-alt" edge="a" label="More help">
        <Closing
          corners={{ tl: 'pyramid-cyan', br: 'torus-pink' }}
          title="Still have a question?"
          lede="Ask the community. Someone has usually run into the same thing."
          actions={
            <>
              <MagneticButton to={DISCORD} icon="discord" arrow>
                Ask on Discord
              </MagneticButton>
              <MagneticButton to={`${GITHUB}/discussions`} icon="github" variant="outline">
                GitHub Discussions
              </MagneticButton>
            </>
          }
        />
      </Band>
    </MotionPage>
  );
}
