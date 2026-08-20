'use client';

import { useState } from 'react';
import type { Story } from '@/lib/types';
import { buildNewsletterHTML } from '@/lib/newsletter-template';
import { formatDate } from '@/lib/format';

export default function NewsletterBuilder({ stories }: { stories: Story[] }) {
  const [subject, setSubject] = useState('The Cell Signal — recent stories from CZRO Bio');
  const [selected, setSelected] = useState<Set<string>>(
    new Set(stories.slice(0, 4).map((s) => s.id))
  );
  const [html, setHtml] = useState('');
  const [pickError, setPickError] = useState('');

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function preview() {
    const chosen = stories.filter((s) => selected.has(s.id));
    if (!chosen.length) {
      setPickError('Select at least one story to include.');
      setHtml('');
      return;
    }
    setPickError('');
    setHtml(buildNewsletterHTML(subject || 'The Cell Signal', chosen));
  }

  function copyHtml() {
    navigator.clipboard.writeText(html).then(
      () => alert('Newsletter HTML copied to clipboard.'),
      () => alert('Could not copy automatically — select and copy the HTML manually.')
    );
  }

  function download() {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'the-cell-signal-newsletter.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (!stories.length) {
    return <p className="muted">No stories to include yet. Publish one first.</p>;
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="field">
        <label>Issue subject line</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>

      <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
        Choose stories to include
      </label>
      <div>
        {stories.map((s) => (
          <label key={s.id} className="picker-item" style={{ cursor: 'pointer' }}>
            <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggle(s.id)} />
            <div>
              <div className="pi-title">{s.title}</div>
              <div className="pi-meta">
                {s.category} &middot; {formatDate(s.published_at)}
              </div>
            </div>
          </label>
        ))}
      </div>

      {pickError && <p className="err" style={{ marginTop: 10 }}>{pickError}</p>}

      <div className="modal-actions">
        <button type="button" className="btn btn-primary" onClick={preview}>
          Preview newsletter
        </button>
      </div>

      {html && (
        <>
          <div className="np-frame">
            <iframe srcDoc={html} title="Newsletter preview" />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={copyHtml}>
              Copy HTML
            </button>
            <button type="button" className="btn btn-primary" onClick={download}>
              Download .html
            </button>
          </div>
        </>
      )}
    </div>
  );
}
