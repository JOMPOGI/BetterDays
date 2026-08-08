import React from 'react';
import styles from './Table.module.css';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className={`${styles.tableWrapper} ${className}`}>
      <table className={styles.table}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className = '' }: TableProps) {
  return <thead className={className}>{children}</thead>;
}

export function TableBody({ children, className = '' }: TableProps) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableRow({ children, className = '', onClick }: TableProps & { onClick?: () => void }) {
  return (
    <tr 
      className={`${styles.tr} ${onClick ? styles.clickable : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  isHeader?: boolean;
  align?: 'left' | 'center' | 'right';
}

export function TableCell({ children, className = '', isHeader = false, align = 'left' }: TableCellProps) {
  const Component = isHeader ? 'th' : 'td';
  const alignClass = align === 'right' ? styles.alignRight : align === 'center' ? styles.alignCenter : '';
  
  return (
    <Component className={`${isHeader ? styles.th : styles.td} ${alignClass} ${className}`}>
      {children}
    </Component>
  );
}
