import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import StoryForm from '@/components/StoryForm';
import type { Story } from '@/lib/types';

export default async function EditStoryPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: story } = await supabase.from('stories').select('*').eq('id', id).single();

  if (!story) notFound();

  return (
    <div style={{ paddingTop: 36, paddingBottom: 60, maxWidth: 640 }}>
      <h2 className="section-label" style={{ marginBottom: 20 }}>
        Edit story
      </h2>
      <StoryForm story={story as Story} />
    </div>
  );
}
