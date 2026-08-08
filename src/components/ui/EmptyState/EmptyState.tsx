import React from 'react';
import { FolderOpen } from 'lucide-react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  title = 'No Data Available', 
  description = 'There is currently no data to display in this section.',
  icon,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.iconWrapper}>
        {icon || <FolderOpen size={48} className={styles.icon} />}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
