'use client';

import { useState, type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import styles from './SettingRow.module.scss';

interface SettingRowProps {
  icon: ReactNode;
  title: string;
  hint: string;
  variant?: 'default' | 'danger';
  action?:
    | { kind: 'button'; label: string; onClick?: () => void }
    | { kind: 'toggle'; defaultOn?: boolean };
}

export const SettingRow = ({ icon, title, hint, variant = 'default', action }: SettingRowProps) => {
  const [on, setOn] = useState(action?.kind === 'toggle' ? !!action.defaultOn : false);

  return (
    <div className={styles.root}>
      <span className={cn(styles.icon, variant === 'danger' && styles.iconDanger)}>{icon}</span>
      <div className={styles.body}>
        <div className={styles.title}>{title}</div>
        <div className={styles.hint}>{hint}</div>
      </div>
      <div className={styles.aside}>
        {action?.kind === 'button' ? (
          <button
            type="button"
            onClick={action.onClick}
            className={cn(styles.button, variant === 'danger' && styles.buttonDanger)}
          >
            {action.label}
          </button>
        ) : action?.kind === 'toggle' ? (
          <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() => setOn((v) => !v)}
            className={cn(styles.toggle, on && styles.toggleOn)}
          >
            <span className={styles.toggleKnob} />
          </button>
        ) : null}
      </div>
    </div>
  );
};
