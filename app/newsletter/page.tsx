import { createClient } from '@/lib/supabase/server';
import type { Story } from '@/lib/types';
import NewsletterBuilder from '@/components/NewsletterBuilder';

export default async function NewsletterPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('stories')
    .select('*')
    .order('published_at', { ascending: false });

  return (
    <div style={{ paddingTop: 36, paddingBottom: 60 }}>
      <h2 className="section-label" style={{ marginBottom: 6 }}>
        Generate newsletter
      </h2>
      <p className="muted" style={{ marginBottom: 24 }}>
        Pick which stories to include, preview the email, then copy the HTML into your sender or
        download it.
      </p>
      <NewsletterBuilder stories={(data ?? []) as Story[]} />
    </div>
  );
}
