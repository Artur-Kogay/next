import { type ReactNode } from 'react';

import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';

import styles from './ChromeLayout.module.scss';

interface ChromeLayoutProps {
  children: ReactNode;
}

const ChromeLayout = ({ children }: ChromeLayoutProps) => {
  return (
    <div className={styles.root}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default ChromeLayout;
