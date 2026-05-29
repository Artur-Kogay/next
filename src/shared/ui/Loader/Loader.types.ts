type LoaderSize = 'sm' | 'md' | 'lg';

export interface LoaderProps {
  size?: LoaderSize;

  fullScreen?: boolean;

  overlay?: boolean;

  label?: string;

  ariaLabel?: string;
  className?: string;
}
