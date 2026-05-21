'use client';

import Image from 'next/image';

import { useAtomValue } from 'jotai';

import { logo } from '@/shared/config';
import { resolvedThemeAtom } from '@/shared/model/theme';

import styles from './Logo.module.scss';

interface LogoProps {
  alt: string;
  className?: string;
}

export const Logo = ({ alt, className }: LogoProps) => {
  const theme = useAtomValue(resolvedThemeAtom);
  const src = theme === 'dark' ? logo.dark : logo.light;

  return (
    <Image
      src={src}
      alt={alt}
      width={logo.width}
      height={logo.height}
      priority
      className={`${styles.root} ${className ?? ''}`.trim()}
    />
  );
};
