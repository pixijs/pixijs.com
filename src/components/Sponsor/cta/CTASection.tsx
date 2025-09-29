import styles from './CTASection.module.css';
import { Heart, Mail } from 'lucide-react'; // or your icon library

export default function CTASection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Ready to Sponsor PixiJS?</h2>
        <p className={styles.description}>
          Join our community of sponsors and help us continue building the future of 2D graphics on the web
        </p>

        <div className={styles.buttons}>
          <button
            className={styles.buttonPrimary}
            onClick={() => window.open('https://opencollective.com/pixijs', '_blank', 'noopener,noreferrer')}
          >
            <Heart className={styles.icon} />
            Become a Sponsor
          </button>
          <a href="mailto:sean@pixijs.com" className={styles.buttonOutline}>
            <Mail className={styles.icon} />
            Contact Us
          </a>
        </div>

        <p className={styles.footerText}>
          Questions about sponsorship?{' '}
          <a href="mailto:sean@pixijs.com" className={styles.footerLink}>
            Get in touch
          </a>{' '}
          with our team.
        </p>
      </div>
    </section>
  );
}
