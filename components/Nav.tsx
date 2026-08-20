'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { CATEGORIES } from '@/lib/types';

export default function Nav({ isAdmin }: { isAdmin: boolean }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const current = searchParams.get('category') ?? 'All';
  const cats = ['All', ...CATEGORIES];

  const showBanner = pathname === '/' || pathname === '/newsletter';

  return (
    <div className={`nav ${showBanner ? 'nav-banner' : ''}`}>
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
        <img
          src={showBanner ? '/wordmark-white.svg' : '/wordmark.svg'}
          alt="The Cell Signal"
          className="nav-logo"
        />
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
