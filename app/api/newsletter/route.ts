import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildNewsletterHTML } from '@/lib/newsletter-template';
import type { Story } from '@/lib/types';

// Example usage once deployed:
//   GET /api/newsletter                       -> last 4 stories, default subject
//   GET /api/newsletter?limit=6                -> last 6 stories
//   GET /api/newsletter?ids=uuid1,uuid2         -> specific stories
//   GET /api/newsletter?subject=Custom+subject
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get('ids');
  const subject = searchParams.get('subject') || 'The Cell Signal — recent stories from CZRO Bio';
  const limit = Number(searchParams.get('limit') || 4);

  const supabase = await createClient();
  let stories: Story[];

  if (idsParam) {
    const ids = idsParam.split(',').filter(Boolean);
    const { data } = await supabase.from('stories').select('*').in('id', ids);
    stories = (data ?? []) as Story[];
  } else {
    const { data } = await supabase
      .from('stories')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);
    stories = (data ?? []) as Story[];
  }

  if (!stories.length) {
    return NextResponse.json({ error: 'No stories found.' }, { status: 404 });
  }

  const html = buildNewsletterHTML(subject, stories);
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
