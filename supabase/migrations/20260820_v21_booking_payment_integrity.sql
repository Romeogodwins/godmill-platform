-- Godmill Operations V2.1: booking/payment integrity
-- Safe additive migration. It does not delete or rewrite existing bookings.

create or replace function public.prevent_room_double_booking()
returns trigger
language plpgsql
as $$
begin
  if new.room_id is null or new.status = 'cancelled' then
    return new;
  end if;

  if exists (
    select 1
    from public.bookings b
    where b.room_id = new.room_id
      and b.id is distinct from new.id
      and b.status in ('pending', 'confirmed', 'checked-in')
      and new.status in ('pending', 'confirmed', 'checked-in')
      and b.check_in < new.check_out
      and b.check_out > new.check_in
  ) then
    raise exception using
      errcode = '23P01',
      message = 'ROOM_DOUBLE_BOOKING',
      detail = 'The selected room already has an active overlapping booking.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_prevent_room_double_booking on public.bookings;
create trigger trg_prevent_room_double_booking
before insert or update of room_id, check_in, check_out, status
on public.bookings
for each row
execute function public.prevent_room_double_booking();

create index if not exists idx_bookings_room_dates_active
on public.bookings (room_id, check_in, check_out)
where status in ('pending', 'confirmed', 'checked-in');

create index if not exists idx_payments_booking_id
on public.payments (booking_id);
