import React from 'react';
import { Check } from 'lucide-react';
import styles from './Checkbox.module.css';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string | React.ReactNode;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <label className={`${styles.container} ${disabled ? styles.disabled : ''}`}>
      <div className={styles.checkboxWrapper}>
        <input 
          type="checkbox" 
          className={styles.hiddenInput} 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className={`${styles.box} ${checked ? styles.checked : ''}`}>
          {checked && <Check size={14} className={styles.icon} />}
        </div>
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
