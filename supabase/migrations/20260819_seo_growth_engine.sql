-- ===========================================================
-- GODMILL SEO GROWTH ENGINE
-- Migration: 20260819 SEO engine foundation
-- ===========================================================

create table if not exists public.seo_keywords (
  id uuid primary key default gen_random_uuid(),
  keyword text not null unique,
  target_page text not null,
  intent text not null,
  priority text not null,
  cluster text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seo_tasks (
  id text primary key,
  title text not null,
  description text not null,
  priority text not null,
  category text not null,
  status text not null default 'todo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seo_audits (
  id uuid primary key default gen_random_uuid(),
  page_route text not null,
  page_name text not null,
  primary_keyword text,
  score integer not null,
  passed_checks integer not null default 0,
  total_checks integer not null default 0,
  audit_json jsonb not null default '{}'::jsonb,
  audited_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.seo_content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text,
  target_keyword text,
  search_intent text,
  status text not null default 'idea',
  priority text not null default 'medium',
  notes text,
  published_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seo_competitors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  competitor_type text not null,
  location text,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists seo_audits_route_idx
  on public.seo_audits(page_route);

create index if not exists seo_audits_date_idx
  on public.seo_audits(audited_at desc);

create index if not exists seo_keywords_target_idx
  on public.seo_keywords(target_page);

alter table public.seo_keywords enable row level security;
alter table public.seo_tasks enable row level security;
alter table public.seo_audits enable row level security;
alter table public.seo_content enable row level security;
alter table public.seo_competitors enable row level security;

-- The application accesses these tables server-side
-- using the Supabase service-role client.
-- No anonymous/public policies are intentionally created.

insert into public.seo_keywords
(
  keyword,
  target_page,
  intent,
  priority,
  cluster,
  active
)
values
(
  'Godmill City Guesthouse',
  '/',
  'brand',
  'critical',
  'brand',
  true
),
(
  'accommodation in Taung',
  '/accommodation-taung',
  'transactional',
  'critical',
  'accommodation',
  true
),
(
  'guesthouse in Taung',
  '/guesthouse-taung',
  'transactional',
  'critical',
  'guesthouse',
  true
),
(
  'affordable accommodation Taung',
  '/affordable-accommodation-taung',
  'commercial',
  'high',
  'affordable',
  true
),
(
  'family accommodation Taung',
  '/family-accommodation-taung',
  'transactional',
  'high',
  'family',
  true
),
(
  'business accommodation Taung',
  '/business-accommodation-taung',
  'transactional',
  'high',
  'business',
  true
),
(
  'rooms in Taung',
  '/rooms-taung',
  'transactional',
  'high',
  'rooms',
  true
)
on conflict (keyword)
do update set
  target_page = excluded.target_page,
  intent = excluded.intent,
  priority = excluded.priority,
  cluster = excluded.cluster,
  active = excluded.active,
  updated_at = now();

insert into public.seo_tasks
(
  id,
  title,
  description,
  priority,
  category,
  status
)
values
(
  'reviews',
  'Grow genuine Google reviews',
  'Ask real checked-out guests for honest Google reviews and respond consistently to new reviews.',
  'critical',
  'reviews',
  'in_progress'
),
(
  'profile',
  'Keep Google Business Profile complete',
  'Maintain accurate rooms, amenities, website, phone number, address and property information.',
  'critical',
  'local',
  'in_progress'
),
(
  'citations',
  'Build reputable local citations',
  'Create consistent Godmill listings across trustworthy tourism, accommodation and business directories.',
  'high',
  'authority',
  'todo'
),
(
  'content',
  'Publish useful Taung visitor content',
  'Create genuinely helpful travel content instead of repetitive keyword landing pages.',
  'high',
  'content',
  'todo'
),
(
  'conversion',
  'Improve direct-booking conversion',
  'Keep booking actions prominent and remove unnecessary friction between search visitor and reservation.',
  'high',
  'conversion',
  'in_progress'
),
(
  'photos',
  'Add fresh original property photography',
  'Add genuine new room, exterior, pool and facility photos whenever they become available.',
  'medium',
  'content',
  'todo'
)
on conflict (id)
do update set
  title = excluded.title,
  description = excluded.description,
  priority = excluded.priority,
  category = excluded.category,
  updated_at = now();

insert into public.seo_competitors
(
  name,
  competitor_type,
  location,
  notes
)
values
(
  'Booking.com',
  'OTA',
  'Taung',
  'Major OTA competing for accommodation search visibility.'
),
(
  'Expedia',
  'OTA',
  'Taung',
  'Travel marketplace competing for accommodation visibility.'
),
(
  'Agoda',
  'OTA',
  'Taung',
  'Accommodation marketplace.'
),
(
  'Google Hotels',
  'Google',
  'Taung',
  'Google accommodation comparison environment.'
);
