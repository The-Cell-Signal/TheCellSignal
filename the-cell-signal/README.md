# The Cell Signal

A blog/newsletter site for CZRO Bio, built with Next.js (App Router) and Supabase.

- Public homepage in an editorial layout: full-width hero, a text-only "Latest" list,
  and a horizontally scrolling "More stories" carousel.
- `/admin` — sign in, publish/edit/delete stories, upload photos.
- `/newsletter` — pick recent stories, preview an email built from them, copy the HTML
  or download it.
- `/api/newsletter` — the same email, generated on demand as raw HTML (useful later if
  you want to automate sending via cron/Zapier/etc).

I could not run `npm install`, start a dev server, or deploy this myself — this sandbox
has no network access. Everything below has been written carefully against Next.js 15 /
React 19 conventions, but you should run it locally and fix anything that comes up
before deploying.

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the SQL editor, paste and run everything in `supabase/schema.sql`. This creates
   the `stories` table, row-level security policies, and a public `story-images`
   storage bucket.
3. Under **Authentication → Users**, manually create one or more users (email +
   password) for whoever should be able to publish stories. There's no public sign-up
   page — this is an internal tool.
4. Under **Project Settings → API**, copy the **Project URL** and the **anon public**
   key.

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the values from step 1:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://thecellsignal.ca
```

## 3. Run it locally

```
npm install
npm run dev
```

Visit `http://localhost:3000` for the site and `http://localhost:3000/admin` to sign
in and publish your first story.

## 4. Deploy to Vercel

1. Push this project to a GitHub repo.
2. In Vercel, "Add New Project" and import that repo. Vercel auto-detects Next.js.
3. Add the same three environment variables from `.env.local` in the Vercel project
   settings (Settings → Environment Variables), for Production (and Preview if you
   want).
4. Deploy.
5. In Vercel → Settings → Domains, add `thecellsignal.ca`. Vercel will give you DNS
   records (usually an A record and/or CNAME) to add at your domain registrar. Once DNS
   propagates, Vercel issues an SSL certificate automatically.

## Notes on how things work

- **Auth**: Supabase Auth (email/password). Middleware (`middleware.ts`) protects every
  `/admin/*` route except `/admin/login`.
- **Images**: uploaded directly from the browser to the `story-images` Supabase Storage
  bucket, which is public-read. Stories without a photo fall back to a small
  brand-colored illustration per category (`public/placeholders/*.svg`).
- **Newsletter**: `lib/newsletter-template.ts` builds the email HTML from an array of
  stories — this same function powers both the `/newsletter` preview page and the
  `/api/newsletter` route, so they'll never drift apart.
- **Categories** are fixed to `Partnerships`, `Research`, `Sustainability`, `Company` in
  `lib/types.ts`. Add or rename categories there and in `supabase/schema.sql`'s check
  constraint if you want different ones.

## What this doesn't do yet

- **Sending email.** The newsletter feature generates HTML — it doesn't send it. You'd
  still paste the copied HTML into whatever you send campaigns from (Mailchimp,
  Resend, Postmark, etc.), or wire the `/api/newsletter` route into a script that calls
  a sending API. Happy to build that next if useful.
- **Rich text.** Story bodies are plain text (line breaks are preserved). If you want
  bold, links, or images inline in the body, that needs a rich text editor added to
  `StoryForm.tsx`.
- **Multiple authors with different permissions.** Right now any signed-in Supabase
  user can create/edit/delete any story.
