# 🏟️ Mrtvara Liga

SofaScore-style aplikacija za praćenje petkovnih utakmica **SPID** vs **BELO** na Mrtvari —
postave, golovi (strijelac + asistent + minuta), rezultati i statistika igrača kroz sezonu.
Podaci su zajednički i osvježavaju se **uživo** na svim uređajima.

## Stack

- **Next.js 16** (App Router) + **React 19** + **Tailwind CSS 4**
- **Supabase** — Postgres + Realtime + Auth (`@supabase/ssr`)

## Model pristupa

- **Svi** vide rezultate i statistiku (javno čitanje).
- **Samo admin** (član `public.admins`) može unositi utakmice, golove i igrače.
  Ograničeno na razini baze (RLS), ne samo u UI-ju.

## Lokalno pokretanje

```bash
npm install
cp .env.example .env.local   # popuni URL i publishable key iz Supabase Dashboarda
npm run dev                  # http://localhost:3000
```

Potrebne varijable (`.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

## Baza

Shema, RLS, `player_stats` view i seed igrača su u
[`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).

### Admin račun

1. Supabase Dashboard → **Authentication → Users → Add user** (email + lozinka, potvrdi email).
2. Dodaj tog korisnika u admine:
   ```sql
   insert into public.admins (user_id) values ('<auth-user-id>');
   ```

## Deploy (Vercel)

1. Import GitHub repo u Vercel.
2. Dodaj env varijable (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
3. Deploy. (Framework: Next.js — automatski.)

## Ekrani

- `/` — povijest utakmica + međusobni omjer
- `/matches/[id]` — SofaScore prikaz (rezultat, timeline golova, postave)
- `/matches/new` — nova utakmica (admin)
- `/stats` — rang liste + tablica igrača
- `/players` — igrači (admin dodaje/uređuje)
