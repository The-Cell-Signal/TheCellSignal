-- Run this once in the Supabase SQL editor for your project.

create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  dek text not null,
  category text not null check (category in ('Partnerships','Research','Sustainability','Company')),
  author text not null default 'CZRO Bio',
  published_at date not null default current_date,
  image_url text,
  body text not null,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists stories_published_at_idx on stories (published_at desc);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists stories_set_updated_at on stories;
create trigger stories_set_updated_at
  before update on stories
  for each row execute procedure set_updated_at();

-- Row level security: anyone can read published stories,
-- only signed-in users (your team) can write.
alter table stories enable row level security;

create policy "Public can read stories"
  on stories for select
  using (true);

create policy "Authenticated users can insert stories"
  on stories for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update stories"
  on stories for update
  to authenticated
  using (true);

create policy "Authenticated users can delete stories"
  on stories for delete
  to authenticated
  using (true);

-- Storage bucket for story photos
insert into storage.buckets (id, name, public)
values ('story-images', 'story-images', true)
on conflict (id) do nothing;

create policy "Public can view story images"
  on storage.objects for select
  using (bucket_id = 'story-images');

create policy "Authenticated users can upload story images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'story-images');

create policy "Authenticated users can delete story images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'story-images');
