'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/format';
import type { StoryInput } from '@/lib/types';

// Note: these actions intentionally do NOT call redirect() themselves.
// They're invoked from client components (StoryForm) inside a try/catch,
// and redirect()'s internal control-flow error can be mis-caught there.
// Instead they return, and the client navigates on success with router.push().

export async function createStory(input: StoryInput) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in.');

  const slug = `${slugify(input.title)}-${Date.now().toString(36)}`;

  if (input.featured) {
    await supabase.from('stories').update({ featured: false }).eq('featured', true);
  }

  const { error } = await supabase.from('stories').insert({ ...input, slug });
  if (error) throw new Error(error.message);

  revalidatePath('/');
}

export async function updateStory(id: string, input: StoryInput) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in.');

  if (input.featured) {
    await supabase.from('stories').update({ featured: false }).eq('featured', true).neq('id', id);
  }

  const { error } = await supabase.from('stories').update(input).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/stories/[slug]', 'page');
}

export async function deleteStory(id: string) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in.');

  const { error } = await supabase.from('stories').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
