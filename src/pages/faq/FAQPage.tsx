import { useState } from 'react';
import type React from 'react';
import FAQItem from '../../components/FAQ/FAQItem';
import styles from './faq.module.scss';
import { useClassModifier } from '@site/src/hooks/useContainerClassNameModifier';

const faqData = [
  {
    question: 'What is PixiJS for?',
    answer: (
      <>
        Everything! Pixi.js is a rendering library that will allow you to create rich, interactive graphic experiences,
        cross-platform applications, and games without having to dive into the WebGL API or grapple with the intricacies
        of browser and device compatibility. Killer performance with a clean API, means not only will your content be
        better; but also faster to build!
      </>
    ),
  },
  {
    question: 'Is PixiJS free?',
    answer: (
      <>
        PixiJS is and always will be free and Open Source. That said, financial contributions are what make it possible
        to push PixiJS further, faster. Contributions allow us to commission the PixiJS developer community to
        accelerate feature development and create more in-depth documentation.{' '}
        <a href="https://opencollective.com/pixijs" target="_blank" rel="noopener noreferrer">
          Support Us
        </a>{' '}
        by making a contribution via{' '}
        <a href="https://opencollective.com/pixijs" target="_blank" rel="noopener noreferrer">
          Open Collective
        </a>
        . Go on! It will be a massive help AND make you feel good about yourself, win win ;)
      </>
    ),
  },
  {
    question: 'Where do I get it?',
    answer: (
      <>
        Visit our{' '}
        <a href="https://github.com/pixijs/pixijs" target="_blank" rel="noopener noreferrer">
          GitHub page
        </a>{' '}
        to download the very latest version of PixiJS. This is the most up-to-date resource for PixiJS and should always
        be your first port of call to make sure you are using the latest version.
      </>
    ),
  },
  {
    question: 'How do I get started?',
    answer: (
      <>
        Right here! Take a look through the <a href="/docs/guides/basics/what-pixijs-is">Guides</a> section for a wealth
        of information including documentation, tutorials, and examples.
      </>
    ),
  },
  {
    question: 'Why should I use PixiJS?',
    answer: (
      <>
        Because you care about speed. PixiJS&apos; #1 mantra has always been speed. We really do feel the need! We do
        everything we can to make PixiJS as streamlined, efficient and fast as possible, whilst balancing it with
        offering as many crucial and valuable features as we can.
      </>
    ),
  },
  {
    question: 'Is PixiJS a game engine?',
    answer: (
      <>
        No. PixiJS is what we&apos;ve come to think of as a &quot;creation engine&quot;. Whilst it is extremely good for
        making games, the core essence of PixiJS is simply moving things around on screens as quickly and efficiently as
        possible. It does of course happen that it is absolutely brilliant for making games though!
      </>
    ),
  },
  {
    question: 'Who makes PixiJS?',
    answer: (
      <>
        <p>PixiJS is maintained by three core developers who work on the project part-time:</p>
        <p>
          • Mat Groves (
          <a href="https://github.com/GoodBoyDigital" target="_blank" rel="noopener noreferrer">
            @GoodBoyDigital
          </a>
          )
          <br />• Sean Burns (
          <a href="https://github.com/Zyie" target="_blank" rel="noopener noreferrer">
            @Zyie
          </a>
          )
          <br />• Matt Karl (
          <a href="https://github.com/bigtimebuddy" target="_blank" rel="noopener noreferrer">
            @bigtimebuddy
          </a>
          )
        </p>
        <p>
          The project thrives thanks to our highly active community of contributors and sponsors. As part-time
          maintainers, your sponsorship directly supports our ability to improve PixiJS, fix bugs, and create better
          documentation. Consider supporting our work through{' '}
          <a href="https://github.com/sponsors/pixijs" target="_blank" rel="noopener noreferrer">
            GitHub Sponsors
          </a>{' '}
          or{' '}
          <a href="https://opencollective.com/pixijs" target="_blank" rel="noopener noreferrer">
            Open Collective
          </a>
          .
        </p>
      </>
    ),
  },
  {
    question: 'I found a bug. What should I do?',
    answer: (
      <>
        Two things: let us know via the{' '}
        <a href="https://github.com/pixijs/pixijs/issues/new" target="_blank" rel="noopener noreferrer">
          PixiJS GitHub community
        </a>{' '}
        and even better yet, if you know how, post a fix! Our Community is stronger in numbers so we&apos;re always keen
        to welcome new contributors into the team to help us shape what PixiJS becomes next.
      </>
    ),
  },
];

export default function FAQPage(): React.JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useClassModifier('.main-wrapper', 'tileBackground', true);
  return (
    <main className={styles.faqPage}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className="underline">Frequently Asked Questions</h1>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.faqList}>
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
