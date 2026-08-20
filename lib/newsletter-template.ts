import type { Story } from './types';
import { formatDate } from './format';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function buildNewsletterHTML(subject: string, selected: Story[]): string {
  const sorted = [...selected].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
  const [featured, ...rest] = sorted;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thecellsignal.ca';
  const featImg = featured.image_url || `${siteUrl}/placeholders/${featured.category.toLowerCase()}.svg`;

  const restHtml = rest
    .map(
      (s) => `
    <div class="story">
      <div class="eyebrow"><span class="cell"></span>${escapeHtml(s.category)}</div>
      <h3><a href="${siteUrl}/stories/${s.slug}">${escapeHtml(s.title)}</a></h3>
      <p>${escapeHtml(s.dek)}</p>
      <p class="byline">By <b>${escapeHtml(s.author)}</b> &middot; ${formatDate(s.published_at)}</p>
    </div>
  `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;}
  body{margin:0;background:#F2F6F0;font-family:'Inter',sans-serif;color:#14231C;}
  .wrap{max-width:640px;margin:0 auto;background:#fff;}
  .masthead{background:#14231C;padding:28px 32px 24px;color:#fff;}
  .masthead-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;}
  .wordmark{display:flex;align-items:center;gap:10px;font-family:'Source Serif 4',serif;font-weight:700;font-size:20px;color:#fff;text-decoration:none;}
  .wordmark .dot{width:12px;height:12px;border-radius:50%;background:#4E9E5A;}
  .issue-tag{font-size:12px;color:#A9C4AE;letter-spacing:0.04em;text-transform:uppercase;}
  .masthead h1{font-family:'Source Serif 4',serif;font-weight:600;font-size:15px;line-height:1.5;color:#DCEBDF;margin:0;max-width:480px;}
  .hero{padding:0;border-bottom:1px solid #DCE4D8;}
  .hero-img{width:100%;height:220px;background-size:cover;background-position:center;}
  .hero-body{padding:28px 32px;}
  .eyebrow{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#2E6E3B;margin-bottom:14px;}
  .eyebrow .cell{width:8px;height:8px;border-radius:50%;background:#4E9E5A;}
  .hero-body h2{font-family:'Source Serif 4',serif;font-weight:600;font-size:26px;line-height:1.2;margin:0 0 14px;}
  .hero-body h2 a{color:#14231C;text-decoration:none;}
  .dek{font-size:16px;line-height:1.6;color:#5C6B61;margin:0 0 14px;}
  .byline{font-size:13px;color:#5C6B61;}
  .byline b{color:#14231C;font-weight:500;}
  .section-label{padding:26px 32px 4px;font-family:'Source Serif 4',serif;font-size:15px;font-weight:600;color:#14231C;}
  .story{padding:20px 32px;border-bottom:1px solid #DCE4D8;}
  .story h3{font-family:'Source Serif 4',serif;font-weight:600;font-size:18px;line-height:1.3;margin:0 0 8px;}
  .story h3 a{color:#14231C;text-decoration:none;}
  .story p{font-size:14px;line-height:1.6;color:#5C6B61;margin:0 0 8px;}
  .footer{background:#14231C;color:#A9C4AE;padding:28px 32px;}
  .footer .wordmark{margin-bottom:12px;}
  .footer p{font-size:12px;line-height:1.7;color:#93AC98;margin:0 0 12px;}
  .footer .fine{font-size:11px;color:#6B8570;border-top:1px solid #24352C;padding-top:14px;margin-top:14px;}
</style>
</head>
<body>
<div class="wrap">
  <div class="masthead">
    <div class="masthead-top">
      <a class="wordmark"><span class="dot"></span>The Cell Signal</a>
      <span class="issue-tag">CZRO Bio</span>
    </div>
    <h1>${escapeHtml(subject)}</h1>
  </div>
  <div class="hero">
    <div class="hero-img" style="background-image:url('${featImg}')"></div>
    <div class="hero-body">
      <div class="eyebrow"><span class="cell"></span>${escapeHtml(featured.category)}</div>
      <h2><a href="${siteUrl}/stories/${featured.slug}">${escapeHtml(featured.title)}</a></h2>
      <p class="dek">${escapeHtml(featured.dek)}</p>
      <p class="byline">By <b>${escapeHtml(featured.author)}</b> &middot; ${formatDate(featured.published_at)}</p>
    </div>
  </div>
  ${rest.length ? `<div class="section-label">Also this week</div>${restHtml}` : ''}
  <div class="footer">
    <a class="wordmark"><span class="dot"></span>The Cell Signal</a>
    <p>Published by CZRO Bio &mdash; cultivating microalgae to turn CO&#8322; , waste and light into cleaner soil, water and energy.</p>
    <div class="fine">Vancouver, Canada &middot; You're receiving this because you subscribed at thecellsignal.ca &middot; Unsubscribe</div>
  </div>
</div>
</body>
</html>`;
}
