import { cn } from '@/shared/lib/cn';

import styles from './Loader.module.scss';
import { type LoaderProps } from './Loader.types';

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
