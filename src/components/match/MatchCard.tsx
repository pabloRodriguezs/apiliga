import Link from 'next/link';
import { Match } from '@/types/riot';
import { Player } from '@/types/league';

interface MatchCardProps {
  match: Match;
  leaguePlayers: Player[];
  ddVersion: string;
}

export default function MatchCard({ match, leaguePlayers, ddVersion }: MatchCardProps) {
  const puuids = new Set(leaguePlayers.map((p) => p.puuid));
  const participants = match.info.participants.filter((p) => puuids.has(p.puuid));

  const duration = Math.floor(match.info.gameDuration / 60);
  const playedAt = new Date(match.info.gameStartTimestamp).toLocaleDateString('es-ES');

  return (
    <Link
      href={`/matches/${match.metadata.matchId}`}
      className="block bg-[#111827] border border-[#374151] rounded-xl p-4 hover:border-[#c89b3c]/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-400">{playedAt} · {duration}m</span>
        <span className="text-xs text-slate-500">{match.info.gameMode}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {participants.slice(0, 6).map((p) => (
          <div key={p.puuid} className="flex items-center gap-2">
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/${ddVersion}/img/champion/${p.championName}.png`}
              alt={p.championName}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-xs text-slate-300 truncate max-w-20">{p.summonerName}</p>
              <p className={`text-xs font-medium ${p.win ? 'text-green-400' : 'text-red-400'}`}>
                {p.kills}/{p.deaths}/{p.assists}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Link>
  );
}
