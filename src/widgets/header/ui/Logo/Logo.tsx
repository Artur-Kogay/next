'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { useAtomValue } from 'jotai';

import { webviewTypeAtom } from '@/features/webview';
import { getWebviewLogo, logo } from '@/shared/config';
import { resolvedThemeAtom } from '@/shared/model/theme';

import styles from './Logo.module.scss';
import { type LogoProps } from './Logo.types';

export const Logo = ({ alt, className }: LogoProps) => {
  const theme = useAtomValue(resolvedThemeAtom);
  const webviewType = useAtomValue(webviewTypeAtom);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const webviewSrc = mounted ? getWebviewLogo(webviewType) : null;
  const src = webviewSrc ?? (theme === 'dark' ? logo.dark : logo.light);

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
