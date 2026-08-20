import Link from 'next/link';
import type { Story } from '@/lib/types';
import { formatDate, placeholderImage } from '@/lib/format';
import { categoryColor } from '@/lib/category-colors';

export default function LatestList({ stories }: { stories: Story[] }) {
  return (
    <div>
      <div className="sidebar-label">Latest</div>
      <div className="latest-sidebar">
        {stories.map((s) => {
          const img = s.image_url || placeholderImage(s.category);
          return (
            <Link key={s.id} href={`/stories/${s.slug}`} className="latest-card">
              <div className="latest-card-img" style={{ backgroundImage: `url(${img})` }} />
              <span className="eyebrow">
                <span className="sq" style={{ background: categoryColor(s.category) }} />
                {s.category}
              </span>
              <h3>{s.title}</h3>
              <p className="dek">{s.dek}</p>
              <p className="byline">
                By <b>{s.author}</b> &middot; {formatDate(s.published_at)}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
