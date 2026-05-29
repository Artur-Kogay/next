'use client';

import { useEffect, useMemo, useRef } from 'react';

import { Link, usePathname } from '@/shared/lib/i18n/navigation';

import styles from './CategoriesNav.module.scss';
import { type CategoriesNavProps } from './CategoriesNav.types';

export const CategoriesNav = ({ categories }: CategoriesNavProps) => {
  const visible = useMemo(() => categories.filter((c) => c.last_sessions.length > 0), [categories]);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const chip = navRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
    chip?.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
  }, [pathname]);

  if (visible.length === 0) return null;

  return (
    <nav ref={navRef} aria-label="categories" className={styles.root}>
      <ul className={styles.list}>
        {visible.map((category) => {
          const href = `/category/${category.slug}` as const;
          const isActive = pathname === href;
          return (
            <li key={category.id}>
              <Link
                href={href}
                data-slug={category.slug}
                aria-current={isActive ? 'page' : undefined}
                className={styles.chip}
              >
                {category.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
