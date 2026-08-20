set -e

# --- New component: parses story body text, renders inline images via ![caption](url) syntax ---
cat > components/StoryBody.tsx << 'PYEOF'
export default function StoryBody({ body }: { body: string }) {
  const blocks = body.split(/\n\s*\n/);

  return (
    <div className="detail-content">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        const imageMatch = trimmed.match(/^!\[(.*)\]\((\S+)\)$/);

        if (imageMatch) {
          const [, caption, url] = imageMatch;
          return (
            <figure key={i} className="story-figure">
              <img src={url} alt={caption} />
              {caption && <figcaption>{caption}</figcaption>}
            </figure>
          );
        }

        const lines = trimmed.split('\n');
        return (
          <p key={i}>
            {lines.map((line, j) => (
              <span key={j}>
                {line}
                {j < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
PYEOF

# --- Rewrite the story detail page: Related Stories sidebar + StoryBody rendering ---
cat > "app/stories/[slug]/page.tsx" << 'PYEOF'
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Story } from '@/lib/types';
import { formatDate, placeholderImage } from '@/lib/format';
import { categoryColor } from '@/lib/category-colors';
import StoryBody from '@/components/StoryBody';

export const revalidate = 60;

export default async function StoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: story } = await supabase.from('stories').select('*').eq('slug', slug).single();

  if (!story) notFound();
  const s = story as Story;
  const img = s.image_url || placeholderImage(s.category);

  const { data: relatedData } = await supabase
    .from('stories')
    .select('*')
    .eq('category', s.category)
    .neq('id', s.id)
    .order('published_at', { ascending: false })
    .limit(5);
  const related = (relatedData ?? []) as Story[];

  return (
    <div className="story-grid">
      <article className="story-main">
        <span className="eyebrow">
          <span className="sq" style={{ background: categoryColor(s.category) }} />
          {s.category}
        </span>
        <div className="detail-img" style={{ backgroundImage: `url(${img})`, marginTop: 12 }} />
        <div className="detail-body">
          <h2>{s.title}</h2>
          <p className="dek">{s.dek}</p>
          <p className="byline">
            By <b>{s.author}</b> &middot; {formatDate(s.published_at)}
          </p>
          <StoryBody body={s.body} />
        </div>
        <p style={{ marginTop: 30 }}>
          <Link href="/" className="btn">
            &#8592; Back to all stories
          </Link>
        </p>
      </article>

      {related.length > 0 && (
        <aside>
          <div className="sidebar-label">Related Stories</div>
          <div className="latest-sidebar">
            {related.map((r) => {
              const rimg = r.image_url || placeholderImage(r.category);
              return (
                <Link key={r.id} href={`/stories/${r.slug}`} className="latest-card">
                  <div className="latest-card-img" style={{ backgroundImage: `url(${rimg})` }} />
                  <span className="eyebrow">
                    <span className="sq" style={{ background: categoryColor(r.category) }} />
                    {r.category}
                  </span>
                  <h3>{r.title}</h3>
                  <p className="byline">
                    By <b>{r.author}</b> &middot; {formatDate(r.published_at)}
                  </p>
                </Link>
              );
            })}
          </div>
        </aside>
      )}
    </div>
  );
}
PYEOF

# --- CSS: story page layout + inline image/figure styling ---
python3 << 'PYEOF'
with open('app/globals.css', 'r') as f:
    content = f.read()

content = content.replace(
    ".detail-content{font-size:15px;line-height:1.75;color:var(--ink);white-space:pre-wrap;margin-top:18px;}",
    ".detail-content{font-size:15px;line-height:1.75;color:var(--ink);margin-top:18px;}\n.detail-content p{margin:0 0 18px;}\n.story-figure{margin:26px 0;}\n.story-figure img{width:100%;display:block;border-radius:4px;}\n.story-figure figcaption{font-size:12.5px;color:var(--muted);margin-top:8px;font-style:italic;}\n.story-grid{display:grid;grid-template-columns:1fr 300px;gap:44px;padding-top:36px;padding-bottom:60px;}\n.story-main{min-width:0;}\n@media (max-width:900px){.story-grid{grid-template-columns:1fr;}}"
)

with open('app/globals.css', 'w') as f:
    f.write(content)
print("globals.css updated")
PYEOF

# --- Add a hint in the admin story form explaining the inline-image syntax ---
python3 << 'PYEOF'
with open('components/StoryForm.tsx', 'r') as f:
    content = f.read()

old = '''      <div className={`field ${errors.body ? 'has-err' : ''}`}>
        <label>Story body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write the full story here..."
        />
        {errors.body && <p className="err">{errors.body}</p>}
      </div>'''

new = '''      <div className={`field ${errors.body ? 'has-err' : ''}`}>
        <label>Story body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write the full story here..."
        />
        <p className="muted" style={{ marginTop: -4, marginBottom: 0 }}>
          Tip: add a photo inline by putting <code>![Caption text](image URL)</code> on its own line,
          with a blank line before and after it.
        </p>
        {errors.body && <p className="err">{errors.body}</p>}
      </div>'''

if old not in content:
    print("ABORT: expected block not found in StoryForm.tsx")
    exit(1)

content = content.replace(old, new)
with open('components/StoryForm.tsx', 'w') as f:
    f.write(content)
print("StoryForm.tsx updated")
PYEOF

git add components/StoryBody.tsx "app/stories/[slug]/page.tsx" app/globals.css components/StoryForm.tsx
git commit -m "Add Related Stories sidebar and inline image support in story bodies"
git push origin main
