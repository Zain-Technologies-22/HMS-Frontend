import './globals.css';
import Header from '@/components/Header'; // Import Header instead of Navigation
import Footer from '@/components/Footer'; // Import Header instead of Navigation
import Providers from '@/components/Providers';

export const metadata = {
  title: 'Zango Mediclinic',
  description: 'Hospital Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <Providers>
          <Header /> {/* Use Header component here, which includes Navbar */}
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer /> {/* Use Footer component here */}
        </Providers>
      </body>
    </html>
  );
}
