import type React from 'react';
import styles from './FAQItem.module.scss';

export interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps): React.JSX.Element {
  return (
    <div className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}>
      <button className={styles.questionButton} onClick={onToggle} aria-expanded={isOpen}>
        <span className={styles.questionText}>{question}</span>
        <span className={styles.toggleIcon}>
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
              <line x1="6" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
              <line x1="6" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="10" y1="6" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </span>
      </button>

      <div className={styles.answerWrapper}>
        <div className={styles.answerContent}>
          <div className={styles.answerInner}>
            <div className={styles.separator} />
            <div className={styles.answerText}>{answer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
