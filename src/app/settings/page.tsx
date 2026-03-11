import { supabase } from '@/lib/db/supabase';
import { Player } from '@/types/league';
import Card from '@/components/ui/Card';
import { addPlayer, removePlayer, updateConfig } from './actions';

const REGIONS = [
  { value: 'euw1', label: 'EUW' },
  { value: 'eun1', label: 'EUNE' },
  { value: 'na1', label: 'NA' },
  { value: 'kr', label: 'KR' },
  { value: 'br1', label: 'BR' },
  { value: 'la1', label: 'LAN' },
  { value: 'la2', label: 'LAS' },
];

export default async function SettingsPage() {
  const [playersRes, configRes] = await Promise.all([
    supabase.from('players').select('*').order('created_at', { ascending: true }),
    supabase.from('league_config').select('*'),
  ]);

  const players = (playersRes.data ?? []) as Player[];
  const config = configRes.data ?? [];
  const leagueName = config.find((c) => c.key === 'league_name')?.value ?? 'Apiliga';
  const season = config.find((c) => c.key === 'season')?.value ?? '2025';

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Configuración</h1>
        <p className="text-slate-400 mt-1">Gestiona tu liga</p>
      </div>

      {/* Liga config */}
      <Card title="Liga">
        <form action={updateConfig} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Nombre de la liga</label>
            <input
              name="leagueName"
              defaultValue={leagueName}
              className="w-full bg-[#1f2937] border border-[#374151] rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-[#c89b3c]"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Temporada</label>
            <input
              name="season"
              defaultValue={season}
              className="w-full bg-[#1f2937] border border-[#374151] rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-[#c89b3c]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#c89b3c] hover:bg-[#f0e6a2] text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Guardar
          </button>
        </form>
      </Card>

      {/* Jugadores */}
      <Card title="Jugadores">
        <form action={addPlayer} className="flex gap-2 mb-6">
          <input
            name="summonerName"
            placeholder="Nombre de invocador"
            required
            className="flex-1 bg-[#1f2937] border border-[#374151] rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-[#c89b3c]"
          />
          <select
            name="region"
            className="bg-[#1f2937] border border-[#374151] rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-[#c89b3c]"
          >
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-[#c89b3c] hover:bg-[#f0e6a2] text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Añadir
          </button>
        </form>

        {players.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">No hay jugadores.</p>
        ) : (
          <ul className="space-y-2">
            {players.map((player) => (
              <li
                key={player.id}
                className="flex items-center justify-between p-3 bg-[#1f2937] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#374151] flex items-center justify-center text-xs font-bold text-[#c89b3c]">
                    {player.summoner_name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{player.summoner_name}</p>
                    <p className="text-xs text-slate-500">{player.region.toUpperCase()}</p>
                  </div>
                </div>
                <form action={removePlayer.bind(null, player.id)}>
                  <button
                    type="submit"
                    className="text-red-400 hover:text-red-300 text-xs transition-colors"
                  >
                    Eliminar
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* API Key info */}
      <Card title="Riot API">
        <p className="text-sm text-slate-400 mb-3">
          La API key se configura como variable de entorno <code className="text-[#c89b3c] bg-[#1f2937] px-1 rounded">RIOT_API_KEY</code> en el servidor.
        </p>
        <div className="bg-[#1f2937] rounded-lg p-3 font-mono text-xs text-slate-400">
          RIOT_API_KEY=RGAPI-xxxx-xxxx-xxxx
        </div>
      </Card>
    </div>
  );
}
