import './globals.css';
import { AuthProvider } from '../app/contexts/AuthContext';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import { QueryClientProvider } from './QueryClientProvider';
import ThemeRegistry from './ThemeRegistry';

export const metadata = {
  title: 'Zango Mediclinic',
  description: 'Hospital Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 flex flex-col">
        <ThemeRegistry>
          <QueryClientProvider>
            <AuthProvider>
              <ClientHeader />
              <main className="container mx-auto px-4 py-8 flex-grow">
                {children}
              </main>
              <Footer />
            </AuthProvider>
          </QueryClientProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}