import { type ReactNode } from 'react';

export interface SettingRowProps {
  icon: ReactNode;
  title: string;
  hint: string;
  variant?: 'default' | 'danger';
  action?:
    | { kind: 'button'; label: string; onClick?: () => void }
    | { kind: 'toggle'; defaultOn?: boolean };
}
