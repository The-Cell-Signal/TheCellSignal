set -e

cat > public/wordmark-green.svg << 'PYEOF'
<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1270.78 681.59">
  <defs>
    <style>
      .cls-1 { fill: #4FA65B; }
      .cls-2 { fill: #4FA65B; }
    </style>
  </defs>
  <g id="Layer_2-2" data-name="Layer 2">
    <g>
      <path class="cls-2" d="M412.4,319.59h-133.2c-36.4,0-54.8-13.6-54.8-50.4V50.8c0-36.8,18.4-50.8,54.8-50.8h133.2v73.2l-105.6.4v172.8h105.6v73.2Z"/>
      <path class="cls-2" d="M622.39,319.59h-185.6V0h185.6v73.2h-103.2v48.8h103.2v72.8h-103.2v51.6h103.2v73.2Z"/>
      <path class="cls-2" d="M836.39,319.59h-185.6V0h82.4v246.4h103.2v73.2Z"/>
      <path class="cls-2" d="M1046.39,319.59h-185.6V0h82.4v246.4h103.2v73.2Z"/>
    </g>
    <g>
      <path class="cls-1" d="M190.8,631.2c0,36.8-20,50.4-56,50.4H0v-73.2h108.4v-51.2h-52.8c-45.2,0-55.6-22-55.6-50v-92.8c0-38,19.6-52.4,56-52.4h126.8v73.2h-100.4v48.8h52c38.4,0,56.4,16,56.4,54.4v92.8Z"/>
      <path class="cls-1" d="M301.59,681.59h-82.4v-319.59h82.4v319.59Z"/>
      <path class="cls-1" d="M539.19,681.59h-149.6c-36,0-55.6-13.6-55.6-50.4v-216.8c0-38,19.6-52.4,56-52.4h121.2v73.2l-94.8.4v172.8h40.4v-92.8h82.4v166Z"/>
      <path class="cls-1" d="M802.79,681.59h-68.8l-84-146.4v146.4h-82.4v-319.59h72l80.8,139.6v-139.6h82.4v319.59Z"/>
      <path class="cls-1" d="M1052.78,681.59h-82.4v-86h-52.8v86h-82.4v-267.2c0-38,20-52.4,56.4-52.4h161.2v319.59ZM970.38,523.2v-88h-52.8v88h52.8Z"/>
      <path class="cls-1" d="M1270.78,681.59h-185.6v-319.59h82.4v246.4h103.2v73.2Z"/>
    </g>
    <g>
      <path class="cls-1" d="M69.83,227.94v32.03h115.4v38.59h-115.4v32.03h-34.28v-102.66h34.28Z"/>
      <path class="cls-1" d="M185.22,113.1v38.59h-58.63v26.98h58.63v38.59H35.54v-38.59h57.14v-26.98h-57.14v-38.59h149.68Z"/>
      <path class="cls-1" d="M185.22,11v86.92H35.54V11h34.28v48.33h22.85V11h34.09v48.33h24.17V11h34.28Z"/>
    </g>
  </g>
</svg>
PYEOF

cat > components/Footer.tsx << 'PYEOF'
import Link from 'next/link';

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-grid">
        <div>
          <img src="/wordmark-green.svg" alt="CZRO Bio" className="footer-logo" />
          <p className="footer-tag">
            Powered by nature, verified by science. Published by CZRO Bio &mdash; cultivating
            microalgae to turn CO2, waste and light into cleaner soil, water and energy.
          </p>
        </div>
        <div className="footer-col">
          <h4>Get in touch</h4>
          <a href="https://czrobio.com/contact/">Contact us</a>
          <a href="https://czrobio.com/contact/">Submit a story tip</a>
        </div>
        <div className="footer-col">
          <h4>About us</h4>
          <a href="https://czrobio.com/about/company/">Our company</a>
          <a href="https://czrobio.com/solutions/microalgae-farm/">Our solutions</a>
          <Link href="/newsletter">Newsletter</Link>
        </div>
        <div className="footer-col">
          <h4>Follow us</h4>
          <a href="#">LinkedIn</a>
          <a href="#">Instagram</a>
          <a href="#">YouTube</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Vancouver, Canada</span>
        <span>&copy; CZRO Bio {new Date().getFullYear()}</span>
      </div>
    </div>
  );
}
PYEOF

cat > components/Nav.tsx << 'PYEOF'
'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { CATEGORIES } from '@/lib/types';

export default function Nav({ isAdmin }: { isAdmin: boolean }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const current = searchParams.get('category') ?? 'All';
  const cats = ['All', ...CATEGORIES];

  return (
    <div className="nav">
      <div className="nav-links">
        {pathname === '/'
          ? cats.map((c) => (
              <Link
                key={c}
                href={c === 'All' ? '/' : `/?category=${c}`}
                className={current === c ? 'active' : ''}
              >
                {c}
              </Link>
            ))
          : (
              <Link href="/">Home</Link>
            )}
      </div>

      <Link href="/" className="wordmark">
        <img src="/wordmark.svg" alt="The Cell Signal" className="nav-logo" />
      </Link>

      <div className="nav-actions">
        {isAdmin && (
          <>
            <Link href="/newsletter" className="btn">
              Generate newsletter
            </Link>
            <Link href="/admin" className="btn btn-primary">
              Admin
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
PYEOF

cat > app/layout.tsx << 'PYEOF'
import type { Metadata } from 'next';
import { Source_Serif_4, Inter } from 'next/font/google';
import { Suspense } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/server';
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Suspense fallback={<div className="nav" />}>
          <Nav isAdmin={!!user} />
        </Suspense>
        <div className="container">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
PYEOF

git add public/wordmark-green.svg components/Footer.tsx components/Nav.tsx app/layout.tsx
git commit -m "Fix footer logo to all-green, hide Admin/Newsletter nav buttons unless signed in"
git push origin main
