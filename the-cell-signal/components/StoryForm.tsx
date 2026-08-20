'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CATEGORIES, type Story } from '@/lib/types';
import { createStory, updateStory } from '@/app/admin/actions';

export default function StoryForm({ story }: { story?: Story }) {
  const [title, setTitle] = useState(story?.title ?? '');
  const [dek, setDek] = useState(story?.dek ?? '');
  const [category, setCategory] = useState(story?.category ?? CATEGORIES[0]);
  const [author, setAuthor] = useState(story?.author ?? 'CZRO Bio');
  const [publishedAt, setPublishedAt] = useState(
    story?.published_at ?? new Date().toISOString().slice(0, 10)
  );
  const [imageUrl, setImageUrl] = useState(story?.image_url ?? '');
  const [body, setBody] = useState(story?.body ?? '');
  const [featured, setFeatured] = useState(story?.featured ?? false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrors((prev) => ({ ...prev, image: '' }));
    const supabase = createClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
    const path = `${Date.now()}-${safeName}`;

    const { error } = await supabase.storage.from('story-images').upload(path, file);
    setUploading(false);

    if (error) {
      setErrors((prev) => ({ ...prev, image: error.message }));
      return;
    }

    const { data } = supabase.storage.from('story-images').getPublicUrl(path);
    setImageUrl(data.publicUrl);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = 'Enter a headline.';
    if (!dek.trim()) nextErrors.dek = 'Enter a one-line summary.';
    if (!author.trim()) nextErrors.author = 'Enter an author name.';
    if (!publishedAt) nextErrors.publishedAt = 'Choose a date.';
    if (!body.trim()) nextErrors.body = 'Write the story body.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    const payload = {
      title: title.trim(),
      dek: dek.trim(),
      category,
      author: author.trim(),
      published_at: publishedAt,
      image_url: imageUrl || null,
      body: body.trim(),
      featured
    };

    try {
      if (story) {
        await updateStory(story.id, payload);
      } else {
        await createStory(payload);
      }
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setSubmitting(false);
      setErrors({ form: err instanceof Error ? err.message : 'Something went wrong.' });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="story-form">
      <div className={`field ${errors.title ? 'has-err' : ''}`}>
        <label>Headline</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's the story?" />
        {errors.title && <p className="err">{errors.title}</p>}
      </div>

      <div className={`field ${errors.dek ? 'has-err' : ''}`}>
        <label>Dek (one-line summary)</label>
        <input
          value={dek}
          onChange={(e) => setDek(e.target.value)}
          placeholder="One sentence that pulls the reader in"
        />
        {errors.dek && <p className="err">{errors.dek}</p>}
      </div>

      <div className="field-row">
        <div className="field">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className={`field ${errors.author ? 'has-err' : ''}`}>
          <label>Author</label>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="CZRO Bio" />
          {errors.author && <p className="err">{errors.author}</p>}
        </div>
      </div>

      <div className="field-row">
        <div className={`field ${errors.publishedAt ? 'has-err' : ''}`}>
          <label>Date</label>
          <input type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
          {errors.publishedAt && <p className="err">{errors.publishedAt}</p>}
        </div>
        <div className={`field ${errors.image ? 'has-err' : ''}`}>
          <label>Photo</label>
          <input type="file" accept="image/*" onChange={handleImageChange} disabled={uploading} />
          {uploading && <p className="muted">Uploading…</p>}
          {imageUrl && !uploading && <img src={imageUrl} alt="" className="preview-thumb" />}
          {errors.image && <p className="err">{errors.image}</p>}
        </div>
      </div>

      <div className={`field ${errors.body ? 'has-err' : ''}`}>
        <label>Story body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write the full story here..."
        />
        {errors.body && <p className="err">{errors.body}</p>}
      </div>

      <label className="checkbox-row">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Feature this story at the top of the homepage
      </label>

      {errors.form && <p className="err">{errors.form}</p>}

      <div className="modal-actions">
        <button type="button" className="btn" onClick={() => router.push('/admin')}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting || uploading}>
          {submitting ? 'Saving…' : story ? 'Save changes' : 'Publish story'}
        </button>
      </div>
    </form>
  );
}
