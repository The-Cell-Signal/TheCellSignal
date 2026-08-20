import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Story } from '@/lib/types';
import { formatDate, placeholderImage } from '@/lib/format';
import { categoryColor } from '@/lib/category-colors';
import StoryBody from '@/components/StoryBody';

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

  const { data: relatedData } = await supabase
    .from('stories')
    .select('*')
    .eq('category', s.category)
    .neq('id', s.id)
    .order('published_at', { ascending: false })
    .limit(5);
  const related = (relatedData ?? []) as Story[];

  return (
    <div className="story-grid">
      <article className="story-main">
        <span className="eyebrow">
          <span className="sq" style={{ background: categoryColor(s.category) }} />
          {s.category}
        </span>
        <div className="detail-img" style={{ backgroundImage: `url(${img})`, marginTop: 12 }} />
        <div className="detail-body">
          <h2>{s.title}</h2>
          <p className="dek">{s.dek}</p>
          <p className="byline">
            By <b>{s.author}</b> &middot; {formatDate(s.published_at)}
          </p>
          <StoryBody body={s.body} />
        </div>
        <p style={{ marginTop: 30 }}>
          <Link href="/" className="btn">
            &#8592; Back to all stories
          </Link>
        </p>
      </article>

      {related.length > 0 && (
        <aside>
          <div className="sidebar-label">Related Stories</div>
          <div className="latest-sidebar">
            {related.map((r) => {
              const rimg = r.image_url || placeholderImage(r.category);
              return (
                <Link key={r.id} href={`/stories/${r.slug}`} className="latest-card">
                  <div className="latest-card-img" style={{ backgroundImage: `url(${rimg})` }} />
                  <span className="eyebrow">
                    <span className="sq" style={{ background: categoryColor(r.category) }} />
                    {r.category}
                  </span>
                  <h3>{r.title}</h3>
                  <p className="byline">
                    By <b>{r.author}</b> &middot; {formatDate(r.published_at)}
                  </p>
                </Link>
              );
            })}
          </div>
        </aside>
      )}
    </div>
  );
}
