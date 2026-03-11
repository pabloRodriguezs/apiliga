-- Jugadores registrados en la liga
create table if not exists players (
  id           uuid primary key default gen_random_uuid(),
  summoner_name text not null,
  puuid        text unique not null,
  region       text not null,
  created_at   timestamptz default now()
);

-- Partidas registradas en la liga
create table if not exists league_matches (
  id         uuid primary key default gen_random_uuid(),
  match_id   text unique not null,
  played_at  timestamptz not null,
  created_at timestamptz default now()
);

-- Configuración de la liga
create table if not exists league_config (
  key   text primary key,
  value text not null
);

-- Valores por defecto
insert into league_config (key, value) values
  ('league_name', 'Apiliga'),
  ('season', '2025')
on conflict (key) do nothing;

-- RLS: solo lectura pública, escritura desde service role
alter table players enable row level security;
alter table league_matches enable row level security;
alter table league_config enable row level security;

create policy "Public read players" on players for select using (true);
create policy "Public read matches" on league_matches for select using (true);
create policy "Public read config" on league_config for select using (true);
