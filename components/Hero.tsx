import Link from 'next/link';
import type { Story } from '@/lib/types';
import { formatDate, placeholderImage } from '@/lib/format';
import { categoryColor } from '@/lib/category-colors';

export default function Hero({ story }: { story: Story }) {
  const img = story.image_url || placeholderImage(story.category);

  return (
    <div>
      <Link href={`/stories/${story.slug}`}>
        <div className="hero-img" style={{ backgroundImage: `url(${img})` }} />
      </Link>
      <div className="hero-text">
        <span className="eyebrow">
          <span className="sq" style={{ background: categoryColor(story.category) }} />
          {story.category}
        </span>
        <Link href={`/stories/${story.slug}`}>
          <h2>{story.title}</h2>
        </Link>
        <p className="dek">{story.dek}</p>
        <p className="byline">
          By <b>{story.author}</b> &middot; {formatDate(story.published_at)}
        </p>
      </div>
    </div>
  );
}
