'use client';

import { useState, useRef } from 'react';
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

  // Inline image (within the story body) state
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);
  const [inlineUploading, setInlineUploading] = useState(false);
  const [pendingImage, setPendingImage] = useState<{ url: string } | null>(null);
  const [pendingCaption, setPendingCaption] = useState('');

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

  async function handleInlineFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setInlineUploading(true);
    const supabase = createClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
    const path = `inline-${Date.now()}-${safeName}`;

    const { error } = await supabase.storage.from('story-images').upload(path, file);
    setInlineUploading(false);

    if (error) {
      alert('Image upload failed: ' + error.message);
      return;
    }

    const { data } = supabase.storage.from('story-images').getPublicUrl(path);
    setPendingImage({ url: data.publicUrl });
    setPendingCaption('');
    if (inlineFileInputRef.current) inlineFileInputRef.current.value = '';
  }

  function insertImageIntoBody(url: string, caption: string) {
    const snippet = `![${caption}](${url})`;
    const textarea = bodyRef.current;

    if (!textarea) {
      setBody((prev) => (prev ? `${prev}\n\n${snippet}\n\n` : `${snippet}\n\n`));
      return;
    }

    const start = textarea.selectionStart ?? body.length;
    const end = textarea.selectionEnd ?? body.length;
    const before = body.slice(0, start);
    const after = body.slice(end);

    const prefix = before.length === 0 ? '' : before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n';
    const suffix = after.length === 0 ? '' : after.startsWith('\n\n') ? '' : after.startsWith('\n') ? '\n' : '\n\n';

    const insertion = prefix + snippet + suffix;
    const newBody = before + insertion + after;
    setBody(newBody);

    requestAnimationFrame(() => {
      textarea.focus();
      const pos = (before + insertion).length;
      textarea.setSelectionRange(pos, pos);
    });
  }

  function handleInsertPendingImage() {
    if (!pendingImage) return;
    insertImageIntoBody(pendingImage.url, pendingCaption.trim());
    setPendingImage(null);
    setPendingCaption('');
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
          ref={bodyRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write the full story here..."
        />

        <div className="inline-image-toolbar">
          <button
            type="button"
            className="btn"
            onClick={() => inlineFileInputRef.current?.click()}
            disabled={inlineUploading}
          >
            {inlineUploading ? 'Uploading…' : '+ Insert image'}
          </button>
          <input
            ref={inlineFileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleInlineFileChange}
          />
        </div>

        {pendingImage && (
          <div className="inline-image-pending">
            <img src={pendingImage.url} alt="" className="pending-thumb" />
            <input
              type="text"
              value={pendingCaption}
              onChange={(e) => setPendingCaption(e.target.value)}
              placeholder="Caption (optional)"
            />
            <button type="button" className="btn btn-primary" onClick={handleInsertPendingImage}>
              Insert into story
            </button>
            <button type="button" className="btn" onClick={() => setPendingImage(null)}>
              Cancel
            </button>
          </div>
        )}

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
