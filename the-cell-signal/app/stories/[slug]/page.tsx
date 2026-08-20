import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Story } from '@/lib/types';
import { formatDate, placeholderImage } from '@/lib/format';

export const revalidate = 60;

export default async function StoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: story } = await supabase.from('stories').select('*').eq('slug', slug).single();

  if (!story) notFound();
  const s = story as Story;
  const img = s.image_url || placeholderImage(s.category);

  return (
    <article style={{ paddingTop: 36, paddingBottom: 60, maxWidth: 760 }}>
      <span className="eyebrow">{s.category}</span>
      <div className="detail-img" style={{ backgroundImage: `url(${img})`, marginTop: 12 }} />
      <div className="detail-body">
        <h2>{s.title}</h2>
        <p className="dek">{s.dek}</p>
        <p className="byline">
          By <b>{s.author}</b> &middot; {formatDate(s.published_at)}
        </p>
        <div className="detail-content">{s.body}</div>
      </div>
      <p style={{ marginTop: 30 }}>
        <Link href="/" className="btn">
          &#8592; Back to all stories
        </Link>
      </p>
    </article>
  );
}
