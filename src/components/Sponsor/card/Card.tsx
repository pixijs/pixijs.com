import type React from 'react';
import styles from './styles.module.css';
import { forwardRef } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ className = '', ...props }, ref) {
  return <div ref={ref} className={`${styles.card} ${className}`} {...props} />;
});

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardHeader(
  { className = '', ...props },
  ref,
) {
  return <div ref={ref} className={`${styles.cardHeader} ${className}`} {...props} />;
});

const CardTitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardTitle(
  { className = '', ...props },
  ref,
) {
  return <div ref={ref} className={`${styles.cardTitle} ${className}`} {...props} />;
});

const CardDescription = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardDescription(
  { className = '', ...props },
  ref,
) {
  return <div ref={ref} className={`${styles.cardDescription} ${className}`} {...props} />;
});

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardContent(
  { className = '', ...props },
  ref,
) {
  return <div ref={ref} className={`${styles.cardContent} ${className}`} {...props} />;
});

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardFooter(
  { className = '', ...props },
  ref,
) {
  return <div ref={ref} className={`${styles.cardFooter} ${className}`} {...props} />;
});

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
