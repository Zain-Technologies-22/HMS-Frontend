import './globals.css';
import Navigation from '@/components/Navigation';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'Hospital Management System',
  description: 'A comprehensive system for managing hospital operations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <Providers>
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}