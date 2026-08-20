-- Godmill City Guesthouse V2 operations upgrade
-- Safe additive migration. Run once in Supabase SQL Editor before deploying V2 code.

alter table public.bookings
  add column if not exists booking_source text not null default 'website',
  add column if not exists company_name text,
  add column if not exists rate_plan text not null default 'standard',
  add column if not exists discount_amount numeric(12,2) not null default 0,
  add column if not exists deposit_required numeric(12,2) not null default 0;

alter table public.rooms
  add column if not exists maintenance_note text,
  add column if not exists maintenance_since timestamptz;

create index if not exists bookings_check_in_idx
  on public.bookings (check_in);

create index if not exists bookings_check_out_idx
  on public.bookings (check_out);

create index if not exists bookings_room_dates_idx
  on public.bookings (room_id, check_in, check_out);

create index if not exists bookings_source_idx
  on public.bookings (booking_source);

create index if not exists rooms_status_idx
  on public.rooms (status);

-- Normalise blank sources on old records.
update public.bookings
set booking_source = 'website'
where booking_source is null or btrim(booking_source) = '';

-- Keep discount and deposit values non-negative.
alter table public.bookings
  drop constraint if exists bookings_discount_amount_nonnegative;

alter table public.bookings
  add constraint bookings_discount_amount_nonnegative
  check (discount_amount >= 0);

alter table public.bookings
  drop constraint if exists bookings_deposit_required_nonnegative;

alter table public.bookings
  add constraint bookings_deposit_required_nonnegative
  check (deposit_required >= 0);
