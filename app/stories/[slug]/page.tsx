import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Story } from '@/lib/types';
import { formatDate, placeholderImage, readingTime } from '@/lib/format';
import { categoryColor } from '@/lib/category-colors';
import StoryBody from '@/components/StoryBody';
import ShareButton from '@/components/ShareButton';

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

  const { data: moreData } = await supabase
    .from('stories')
    .select('*')
    .neq('id', s.id)
    .order('published_at', { ascending: false })
    .limit(5);
  const more = (moreData ?? []) as Story[];

  return (
    <>
      <div className="story-hero" style={{ backgroundImage: `url(${img})` }}>
        <div className="story-hero-inner">
          <span className="eyebrow">
            <span className="sq" style={{ background: categoryColor(s.category) }} />
            {s.category}
          </span>
          <h1>{s.title}</h1>
          <p className="hero-dek">{s.dek}</p>
          <p className="hero-byline">By {s.author}</p>
        </div>
      </div>

      <div className="container">
        <div className="story-meta-bar">
          <span>{formatDate(s.published_at)}</span>
          <span className="story-meta-right">
            {readingTime(s.body)} min read
            <ShareButton />
          </span>
        </div>

        <div className="story-grid">
          <article className="story-main">
            <StoryBody body={s.body} />
            <p style={{ marginTop: 30 }}>
              <Link href="/" className="btn">
                &#8592; Back to all stories
              </Link>
            </p>
          </article>

          {more.length > 0 && (
            <aside>
              <div className="sidebar-label">Read More</div>
              <div className="latest-sidebar">
                {more.map((r) => {
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
      </div>
    </>
  );
}
