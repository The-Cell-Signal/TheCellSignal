import { createClient } from '@/lib/supabase/server';
import Hero from '@/components/Hero';
import LatestList from '@/components/LatestList';
import Carousel from '@/components/Carousel';
import type { Story } from '@/lib/types';

export const revalidate = 60;

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from('stories').select('*').order('published_at', { ascending: false });
  if (category && category !== 'All') {
    query = query.eq('category', category);
  }
  const { data, error } = await query;

  if (error) {
    return <div className="empty">Couldn't load stories: {error.message}</div>;
  }

  const list = (data ?? []) as Story[];

  if (!list.length) {
    return (
      <div className="empty">
        No stories yet{category && category !== 'All' ? ` in ${category}` : ''}. Sign in to the{' '}
        <a href="/admin" style={{ color: 'var(--forest)', fontWeight: 600 }}>
          admin
        </a>{' '}
        to publish one.
      </div>
    );
  }

  const featured = list.find((s) => s.featured) ?? list[0];
  const rest = list.filter((s) => s.id !== featured.id);
  const latest = rest.slice(0, 2);
  const more = rest.slice(2);

  return (
    <>
      <div className="top-grid">
        <Hero story={featured} />
        {latest.length > 0 && <LatestList stories={latest} />}
      </div>
      {more.length > 0 && <Carousel stories={more} />}
    </>
  );
}
