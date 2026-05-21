import { cn } from '@/shared/lib/cn';

import styles from './Loader.module.scss';

type LoaderSize = 'sm' | 'md' | 'lg';

interface LoaderProps {
  /** Размер спиннера. По умолчанию `md` (40px). */
  size?: LoaderSize;
  /** Растянуть на весь viewport (для app/loading.tsx). */
  fullScreen?: boolean;
  /** Растянуть на родителя (родитель должен быть position: relative). */
  overlay?: boolean;
  /** Подпись под спиннером. */
  label?: string;
  /** Aria-label, если визуальной подписи нет. */
  ariaLabel?: string;
  className?: string;
}

/**
 * Универсальный лоадер. Три режима:
 *   - inline:     `<Loader />` — занимает место по содержимому, центрирует себя.
 *   - overlay:    `<Loader overlay />` — `position: absolute`, накрывает родителя.
 *   - fullScreen: `<Loader fullScreen />` — `position: fixed`, накрывает весь экран.
 */
export const Loader = ({
  size = 'md',
  fullScreen = false,
  overlay = false,
  label,
  ariaLabel,
  className,
}: LoaderProps) => {
  const wrapperClass = cn(
    styles.wrapper,
    fullScreen && styles.fullScreen,
    overlay && styles.overlay,
    className,
  );

  return (
    <div
      className={wrapperClass}
      role="status"
      aria-live="polite"
      aria-label={label ?? ariaLabel ?? 'Loading'}
    >
      <span className={cn(styles.spinner, styles[`size_${size}`])} aria-hidden />
      {label ? <span className={styles.label}>{label}</span> : null}
    </div>
  );
};
