'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { CATEGORIES } from '@/lib/types';

export default function Nav() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const current = searchParams.get('category') ?? 'All';
  const cats = ['All', ...CATEGORIES];

  return (
    <div className="nav">
      <Link href="/" className="wordmark">
        <span className="dot" />
        The Cell Signal
      </Link>

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

      <div className="nav-actions">
        <Link href="/newsletter" className="btn">
          Generate newsletter
        </Link>
        <Link href="/admin" className="btn btn-primary">
          Admin
        </Link>
      </div>
    </div>
  );
}
