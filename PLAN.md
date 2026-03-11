# Apiliga - Plan de desarrollo

Liga de League of Legends para el equipo, usando la Riot Games API.

---

## Stack tecnológico

- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Base de datos:** Supabase (PostgreSQL cloud)
- **API externa:** Riot Games API v4/v5
- **Deploy:** Vercel

---

## Estructura de pantallas

### 1. Dashboard `/dashboard`
Vista general del estado de la liga.
- Resumen de la liga (nombre, temporada, participantes)
- Top 3 del leaderboard
- Últimas 5 partidas jugadas
- Estadísticas destacadas (KDA medio, campeón más jugado)

### 2. Leaderboard `/leaderboard`
Tabla de clasificación de todos los jugadores.
- Tabla: posición, jugador, W/L, win rate, KDA, campeón más jugado
- Filtros por temporada
- Ordenación por columnas
- Indicador de subida/bajada de posición

### 3. Partidas `/matches`
Historial de todas las partidas de la liga.
- Lista ordenada por fecha
- Info rápida: jugadores, resultado, duración, fecha
- Filtros por jugador, campeón y resultado
- Enlace al detalle de cada partida

### 4. Detalle de partida `/matches/[matchId]`
Vista completa de una partida concreta.
- Info general: duración, fecha, modo de juego
- Tabla de jugadores: campeón, KDA, CS, items, daño, visión
- Estadísticas por equipo: oro, torres, dragones, barones
- Enlace al perfil de cada jugador

### 5. Perfil de jugador `/players/[summonerName]`
Perfil individual de cada jugador de la liga.
- Avatar e info del invocador (nivel, rango actual)
- Stats en la liga: W/L, win rate, KDA medio
- Campeones más jugados con estadísticas
- Historial de partidas en la liga
- Posición en el leaderboard

### 6. Configuración `/settings`
Administración de la liga.
- Gestión de jugadores (añadir/eliminar por summoner name + región)
- Configuración de la liga (nombre, temporada)
- Gestión de la Riot API key
- Tema claro/oscuro

---

## Estructura de carpetas

```
src/
├── app/
│   ├── dashboard/
│   ├── leaderboard/
│   ├── matches/
│   │   └── [matchId]/
│   ├── players/
│   │   └── [summonerName]/
│   └── settings/
├── components/
│   ├── layout/        # Sidebar, Navbar
│   ├── ui/            # Botones, badges, skeletons...
│   ├── player/        # PlayerCard, RankBadge
│   ├── match/         # MatchCard, StatsTable, ItemsDisplay
│   └── charts/        # Gráficos de rendimiento
├── lib/
│   ├── riot/          # Cliente y servicios de Riot API
│   └── db/            # Cliente Prisma
├── hooks/             # Custom hooks (usePlayer, useMatch...)
└── types/             # Types de Riot API y dominio propio
```

---

## Integración Riot API

### Endpoints necesarios

| Endpoint | Uso |
|---|---|
| `/summoner/v4/summoners/by-name/{name}` | Buscar invocador |
| `/summoner/v4/summoners/by-puuid/{puuid}` | Datos por PUUID |
| `/match/v5/matches/by-puuid/{puuid}/ids` | IDs de partidas |
| `/match/v5/matches/{matchId}` | Detalle de partida |
| `/league/v4/entries/by-summoner/{id}` | Rango del jugador |

### Consideraciones
- **Rate limiting:** 20 req/s, 100 req/2min (API key dev). Implementar cola/caché.
- **Caché:** Usar `revalidate` de Next.js o cachear en DB para no re-pedir lo mismo.
- **Data Dragon:** Para imágenes de campeones, items y runas (CDN de Riot, gratis).
- **Región:** Configurar la región del grupo (EUW1, EUN1, NA1...).

---

## Base de datos (Supabase)

PostgreSQL cloud. Acceso vía Supabase JS client o Prisma con connection string de Supabase.

### Tablas principales

```sql
-- Jugadores registrados en la liga
players (
  id           uuid primary key default gen_random_uuid(),
  summoner_name text not null,
  puuid        text unique not null,
  region       text not null,
  created_at   timestamptz default now()
)

-- Partidas registradas en la liga
league_matches (
  id         uuid primary key default gen_random_uuid(),
  match_id   text unique not null,  -- ID de Riot
  played_at  timestamptz not null,
  created_at timestamptz default now()
)

-- Configuración de la liga
league_config (
  key   text primary key,
  value text not null
)
```

### Variables de entorno adicionales
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
SUPABASE_SERVICE_ROLE_KEY=xxxx  # solo en servidor
```

---

## Orden de desarrollo recomendado

1. **Setup del proyecto** — Next.js + TypeScript + Tailwind + Prisma
2. **Riot API service** — Cliente base, types, caché
3. **Settings** — Añadir jugadores (base del resto)
4. **Leaderboard** — Primera pantalla con datos reales
5. **Dashboard** — Resumen usando datos del leaderboard
6. **Matches list** — Listado de partidas
7. **Match detail** — Detalle completo de partida
8. **Player profile** — Perfil individual
9. **UI polish** — Tema LoL, skeletons, responsive
10. **Deploy** — Vercel + variables de entorno

---

## Variables de entorno

```env
RIOT_API_KEY=RGAPI-xxxx-xxxx-xxxx
DEFAULT_REGION=euw1
LEAGUE_NAME=Apiliga
```
