import type { Metadata } from 'next';
import { Source_Serif_4, Inter } from 'next/font/google';
import { Suspense } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import './globals.css';

const serif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-serif'
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'The Cell Signal — CZRO Bio',
  description:
    'The people, partnerships and science turning CO2 and waste into cleaner soil, water and energy.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Suspense fallback={<div className="nav" />}>
          <Nav />
        </Suspense>
        <div className="container">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
