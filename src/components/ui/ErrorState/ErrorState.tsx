import React from 'react';
import { AlertTriangle } from 'lucide-react';
import styles from './ErrorState.module.css';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this content. Please try again.',
  onRetry,
  className = ''
}: ErrorStateProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.iconWrapper}>
        <AlertTriangle size={32} className={styles.icon} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        {onRetry && (
          <button className={styles.retryBtn} onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
