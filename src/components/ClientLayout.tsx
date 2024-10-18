'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
