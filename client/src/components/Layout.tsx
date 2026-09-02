import type { ReactNode } from 'react';
import Navbar from './Navbar';

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>
    </>
  );
}

export default Layout;