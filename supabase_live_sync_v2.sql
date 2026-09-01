-- Better Days Studios - LIVE WEBSITE <-> ADMIN SYNC
-- Run AFTER BetterDaysdb.txt in Supabase SQL Editor.
-- This keeps the original UI/flow but gives bookings enough information
-- for Wedding, Prenup, and Wedding + Prenup to be reflected correctly.

alter table public.bookings
  add column if not exists package_type text,
  add column if not exists prenup_date date,
  add column if not exists prenup_location text,
  add column if not exists package_total numeric(12,2),
  add column if not exists reservation_amount numeric(12,2),
  add column if not exists balance numeric(12,2);

-- Backfill package type for bookings that already existed before this migration.
update public.bookings b
set package_type = case
  when upper(coalesce(i.event_type, '')) like '%PRENUP%'
       and upper(coalesce(i.event_type, '')) like '%WEDDING%' then 'wedding_prenup'
  when upper(coalesce(i.event_type, '')) like '%PRENUP%' then 'prenup'
  else 'wedding'
end
from public.inquiries i
where b.inquiry_id = i.id
  and b.package_type is null;

-- Public booking RPC. Because the website is anonymous, it must NOT insert
-- directly into RLS-protected tables; this function safely performs the inserts.
create or replace function public.create_public_booking(
  p_name text,
  p_email text,
  p_phone text,
  p_package_type text,
  p_event_date date,
  p_prenup_date date,
  p_location text,
  p_prenup_location text,
  p_package_total numeric,
  p_reservation_amount numeric,
  p_balance numeric,
  p_payment_method text,
  p_payment_reference text,
  p_notes text
) returns table(booking_id uuid, client_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client_id uuid;
  v_inquiry_id uuid;
  v_booking_id uuid;
begin
  if p_package_type not in ('wedding', 'prenup', 'wedding_prenup') then
    raise exception 'Invalid package type';
  end if;

  select id into v_client_id
  from public.clients
  where lower(email) = lower(p_email)
  limit 1;

  if v_client_id is null then
    insert into public.clients (full_name, email, phone)
    values (p_name, p_email, p_phone)
    returning id into v_client_id;
  else
    update public.clients
    set full_name = p_name,
        phone = p_phone,
        updated_at = now()
    where id = v_client_id;
  end if;

  insert into public.inquiries (
    client_id, event_type, event_date, location, project_notes, status, source
  ) values (
    v_client_id,
    case
      when p_package_type = 'wedding_prenup' then 'WEDDING + PRENUP'
      when p_package_type = 'prenup' then 'PRENUP'
      else 'WEDDING'
    end,
    p_event_date,
    p_location,
    coalesce(p_notes, ''),
    'CONFIRMED',
    'WEBSITE'
  ) returning id into v_inquiry_id;

  insert into public.bookings (
    inquiry_id, client_id, event_date, prenup_date,
    location, prenup_location, package_type,
    package_total, reservation_amount, balance, status
  ) values (
    v_inquiry_id, v_client_id, p_event_date, p_prenup_date,
    p_location, p_prenup_location, p_package_type,
    p_package_total, p_reservation_amount, p_balance, 'CONFIRMED'
  ) returning id into v_booking_id;

  insert into public.payments (
    booking_id, client_id, amount, currency, method, provider,
    provider_payment_id, status, paid_at
  ) values (
    v_booking_id, v_client_id, p_reservation_amount, 'PHP', p_payment_method,
    'paymongo', p_payment_reference, 'paid', now()
  );

  insert into public.notifications (type, title, message)
  values (
    'NEW_BOOKING',
    'New Booking',
    p_name || ' booked ' || replace(p_package_type, '_', ' ') || ' for ' || p_event_date
  );

  return query select v_booking_id, v_client_id;
end;
$$;

grant execute on function public.create_public_booking(
  text, text, text, text, date, date, text, text,
  numeric, numeric, numeric, text, text, text
) to anon;

grant execute on function public.create_public_booking(
  text, text, text, text, date, date, text, text,
  numeric, numeric, numeric, text, text, text
) to authenticated;

-- Helpful admin query: run this anytime to verify the numbers independently.
-- A Wedding + Prenup booking counts once in each category.
create or replace view public.admin_booking_summary as
select
  count(*) as total_bookings,
  count(*) filter (
    where status in ('PENDING','PENDING_PAYMENT','CONFIRMED','COMPLETED')
      and event_date >= current_date
      and package_type in ('wedding','wedding_prenup')
  ) as upcoming_weddings,
  count(*) filter (
    where status in ('PENDING','PENDING_PAYMENT','CONFIRMED','COMPLETED')
      and coalesce(prenup_date, event_date) >= current_date
      and package_type in ('prenup','wedding_prenup')
  ) as upcoming_prenups
from public.bookings;

-- Public calendar availability: return the actual status for every booked date,
-- including the separate prenup date for Wedding + Prenup bookings.
drop function if exists public.get_public_availability(date, date);
create or replace function public.get_public_availability(
  req_start_date date,
  req_end_date date
) returns table(event_date date, status text)
language sql
stable
security definer
set search_path = public
as $$
  select d.event_date, d.status
  from (
    select b.event_date, b.status
    from public.bookings b
    where b.event_date between req_start_date and req_end_date
      and b.status in ('PENDING', 'PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED')

    union all

    select b.prenup_date as event_date, b.status
    from public.bookings b
    where b.prenup_date between req_start_date and req_end_date
      and b.package_type in ('prenup', 'wedding_prenup')
      and b.status in ('PENDING', 'PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED')
      and b.prenup_date is not null
  ) d
  order by d.event_date;
$$;

grant execute on function public.get_public_availability(date, date) to anon;
grant execute on function public.get_public_availability(date, date) to authenticated;
