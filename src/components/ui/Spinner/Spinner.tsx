import { Loader2 } from 'lucide-react';
import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export function Spinner({ size = 24, color = 'var(--admin-text-dark)', className = '' }: SpinnerProps) {
  return (
    <div className={`${styles.spinnerWrapper} ${className}`}>
      <Loader2 
        size={size} 
        color={color} 
        className={styles.spin} 
      />
    </div>
  );
}
