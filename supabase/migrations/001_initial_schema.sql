-- ============================================================
-- polArg News — Initial Schema
-- ============================================================

-- Categories
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  description text,
  created_at  timestamptz not null default now()
);

-- Articles
create table if not exists public.articles (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  excerpt      text,
  content      text,
  image_url    text,
  category     text,
  tags         text[],
  author       text,
  published_at timestamptz,
  source_url   text unique,
  created_at   timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists articles_category_idx    on public.articles (category);
create index if not exists articles_published_at_idx on public.articles (published_at desc);
create index if not exists articles_tags_idx         on public.articles using gin (tags);

-- Row Level Security (public read)
alter table public.articles   enable row level security;
alter table public.categories enable row level security;

create policy "Public articles are viewable by everyone"
  on public.articles for select using (true);

create policy "Public categories are viewable by everyone"
  on public.categories for select using (true);
