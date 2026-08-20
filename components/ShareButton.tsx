'use client';

import { useState } from 'react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({ url });
        return;
      }
    } catch {
      // user cancelled or share failed; fall through to clipboard copy
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <button type="button" className="share-btn" onClick={handleShare}>
      {copied ? 'Link copied' : 'Share'}
    </button>
  );
}
