import { type ReactNode } from 'react';

import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';

interface ChromeLayoutProps {
  children: ReactNode;
}

const ChromeLayout = ({ children }: ChromeLayoutProps) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default ChromeLayout;
