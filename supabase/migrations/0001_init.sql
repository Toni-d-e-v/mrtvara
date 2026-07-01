-- Mrtvara Liga — inicijalna shema
-- Rezultat se računa iz golova; ne sprema se ručno.
-- Model pristupa: javno čitanje (anon), pisanje samo za admina (public.admins).

-- ==================== TABLICE ====================

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  team text not null default 'UNASSIGNED' check (team in ('SPID','BELO','UNASSIGNED')),
  created_at timestamptz not null default now()
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  match_date date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.match_lineups (
  match_id uuid not null references public.matches(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  team text not null check (team in ('SPID','BELO')),
  primary key (match_id, player_id)
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  team text not null check (team in ('SPID','BELO')),
  scorer_id uuid references public.players(id) on delete set null,
  assist_id uuid references public.players(id) on delete set null,
  minute int check (minute >= 0 and minute <= 200),
  created_at timestamptz not null default now()
);

create index if not exists goals_match_id_idx on public.goals(match_id);
create index if not exists match_lineups_player_idx on public.match_lineups(player_id);

-- ==================== ADMIN GATING ====================
-- Članovi public.admins smiju pisati. Svaki prijavljeni korisnik može
-- pročitati SAMO svoj red (za prikaz admin UI-ja); ostali redovi skriveni.
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;

drop policy if exists "admins_self_read" on public.admins;
create policy "admins_self_read" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));
grant select on public.admins to authenticated;

-- ==================== RLS ====================
alter table public.players enable row level security;
alter table public.matches enable row level security;
alter table public.match_lineups enable row level security;
alter table public.goals enable row level security;

do $$
declare
  t text;
  is_admin text := 'exists (select 1 from public.admins a where a.user_id = (select auth.uid()))';
begin
  foreach t in array array['players','matches','match_lineups','goals'] loop
    execute format('drop policy if exists "read_%1$s" on public.%1$s', t);
    execute format('drop policy if exists "ins_%1$s" on public.%1$s', t);
    execute format('drop policy if exists "upd_%1$s" on public.%1$s', t);
    execute format('drop policy if exists "del_%1$s" on public.%1$s', t);

    execute format('create policy "read_%1$s" on public.%1$s for select to anon, authenticated using (true)', t);
    execute format('create policy "ins_%1$s"  on public.%1$s for insert to authenticated with check (%2$s)', t, is_admin);
    execute format('create policy "upd_%1$s"  on public.%1$s for update to authenticated using (%2$s) with check (%2$s)', t, is_admin);
    execute format('create policy "del_%1$s"  on public.%1$s for delete to authenticated using (%2$s)', t, is_admin);
  end loop;
end $$;

-- ==================== GRANTS (Data API) ====================
grant select on public.players, public.matches, public.match_lineups, public.goals to anon, authenticated;
grant insert, update, delete on public.players, public.matches, public.match_lineups, public.goals to authenticated;

-- ==================== VIEW: player_stats ====================
create or replace view public.player_stats
with (security_invoker = true) as
with match_results as (
  select
    m.id as match_id,
    coalesce(sum((g.team = 'SPID')::int), 0) as spid_goals,
    coalesce(sum((g.team = 'BELO')::int), 0) as belo_goals
  from public.matches m
  left join public.goals g on g.match_id = m.id
  group by m.id
),
appearances as (
  select ml.player_id, ml.match_id, ml.team, mr.spid_goals, mr.belo_goals
  from public.match_lineups ml
  join match_results mr on mr.match_id = ml.match_id
)
select
  p.id   as player_id,
  p.name,
  p.team,
  count(a.match_id) as appearances,
  (select count(*) from public.goals g where g.scorer_id = p.id) as goals,
  (select count(*) from public.goals g where g.assist_id = p.id) as assists,
  coalesce(sum(case
      when a.team = 'SPID' and a.spid_goals > a.belo_goals then 1
      when a.team = 'BELO' and a.belo_goals > a.spid_goals then 1 else 0 end), 0) as wins,
  coalesce(sum(case
      when a.team = 'SPID' and a.spid_goals < a.belo_goals then 1
      when a.team = 'BELO' and a.belo_goals < a.spid_goals then 1 else 0 end), 0) as losses,
  coalesce(sum(case when a.spid_goals = a.belo_goals then 1 else 0 end), 0) as draws
from public.players p
left join appearances a on a.player_id = p.id
group by p.id, p.name, p.team;

grant select on public.player_stats to anon, authenticated;

-- ==================== REALTIME ====================
do $$
begin
  begin execute 'alter publication supabase_realtime add table public.goals'; exception when duplicate_object then null; end;
  begin execute 'alter publication supabase_realtime add table public.matches'; exception when duplicate_object then null; end;
  begin execute 'alter publication supabase_realtime add table public.match_lineups'; exception when duplicate_object then null; end;
end $$;

-- ==================== SEED IGRAČA ====================
insert into public.players (name, team) values
  ('culjke','SPID'), ('dasa','SPID'), ('vucko','SPID'),
  ('cosic','SPID'),  ('Nikola','SPID'), ('dzonsta','SPID'),
  ('Dika','BELO'),   ('komsic','BELO'), ('zvone','BELO'),
  ('zoka','BELO'),   ('leo','BELO'),    ('leca','BELO')
on conflict (name) do nothing;

-- ==================== ADMIN RAČUN ====================
-- Admin korisnik se kreira ručno (izvan migracije, bez lozinke u repou):
--   Dashboard → Authentication → Users → Add user  (ili preko SQL-a),
-- zatim: insert into public.admins (user_id) values ('<auth-user-id>');
