import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'BENF∞INFINITY — Be Different. Be Yourself.',
  description: 'T-shirts premium BENF∞INFINITY. Streetwear haut de gamme, coton bio, confection artisanale. Be Different. Be Yourself.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${cormorant.variable} min-h-screen bg-background text-foreground`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}