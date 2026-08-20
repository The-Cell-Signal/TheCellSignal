'use client';

import { useRef } from 'react';
import Link from 'next/link';
import type { Story } from '@/lib/types';
import { formatDate, placeholderImage } from '@/lib/format';

export default function Carousel({ stories }: { stories: Story[] }) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: number) {
    ref.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  }

  return (
    <>
      <div className="section-head">
        <span className="section-label">More stories</span>
        <div className="arrows">
          <button className="arrow-btn" onClick={() => scroll(-1)} aria-label="Scroll left">
            &#8249;
          </button>
          <button className="arrow-btn" onClick={() => scroll(1)} aria-label="Scroll right">
            &#8250;
          </button>
        </div>
      </div>
      <div className="carousel-wrap">
        <div className="carousel" ref={ref}>
          {stories.map((s) => {
            const img = s.image_url || placeholderImage(s.category);
            return (
              <Link key={s.id} href={`/stories/${s.slug}`} className="ccard">
                <div className="ccard-img" style={{ backgroundImage: `url(${img})` }} />
                <span className="eyebrow">{s.category}</span>
                <h3>{s.title}</h3>
                <p className="byline">
                  By <b>{s.author}</b> &middot; {formatDate(s.published_at)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
