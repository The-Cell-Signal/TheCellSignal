import Link from 'next/link';
import type { Story } from '@/lib/types';
import { formatDate, placeholderImage } from '@/lib/format';

export default function LatestList({ stories }: { stories: Story[] }) {
  return (
    <>
      <div className="section-head">
        <span className="section-label">Latest</span>
      </div>
      <div className="latest-list">
        {stories.map((s) => {
          const img = s.image_url || placeholderImage(s.category);
          return (
            <Link key={s.id} href={`/stories/${s.slug}`} className="latest-item">
              <div className="latest-img" style={{ backgroundImage: `url(${img})` }} />
              <div className="latest-text">
                <span className="eyebrow">{s.category}</span>
                <h3>{s.title}</h3>
                <p className="dek">{s.dek}</p>
                <p className="byline">
                  By <b>{s.author}</b> &middot; {formatDate(s.published_at)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
