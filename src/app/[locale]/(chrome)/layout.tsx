import { type ReactNode } from 'react';

import { Footer } from '@/widgets/footer';
import { Header, MobileSearch } from '@/widgets/header';

interface ChromeLayoutProps {
  children: ReactNode;
}

const ChromeLayout = ({ children }: ChromeLayoutProps) => {
  return (
    <>
      <Header />
      <MobileSearch />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default ChromeLayout;
