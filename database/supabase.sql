-- Schema Supabase para Wedding Platform.
-- Execute no SQL Editor do Supabase.

create table if not exists public.event_config (
    id text primary key default 'default',
    config jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

create table if not exists public.rsvps (
    id uuid primary key default gen_random_uuid(),
    payload jsonb not null,
    created_at timestamptz not null default now()
);

alter table public.event_config enable row level security;
alter table public.rsvps enable row level security;

create policy "Admins autenticados gerenciam configuração do evento"
on public.event_config
for all
to authenticated
using (true)
with check (true);

create policy "Visitantes podem ler configuração do evento"
on public.event_config
for select
to anon
using (true);

create policy "Visitantes podem enviar RSVP"
on public.rsvps
for insert
to anon, authenticated
with check (true);

create policy "Admins autenticados leem RSVPs"
on public.rsvps
for select
to authenticated
using (true);
