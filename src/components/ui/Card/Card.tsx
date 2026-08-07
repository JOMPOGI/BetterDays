import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hoverable, interactive, padding = 'md', children, ...props }, ref) => {
    
    const classes = [
      styles.card,
      hoverable ? styles.hoverable : '',
      interactive ? styles.interactive : '',
      styles[`p-${padding}`],
      className
    ].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
