import { LeagueEntry } from '@/types/riot';

const tierColors: Record<string, string> = {
  IRON: 'text-slate-400',
  BRONZE: 'text-amber-700',
  SILVER: 'text-slate-300',
  GOLD: 'text-yellow-400',
  PLATINUM: 'text-teal-400',
  EMERALD: 'text-emerald-400',
  DIAMOND: 'text-blue-400',
  MASTER: 'text-purple-400',
  GRANDMASTER: 'text-red-400',
  CHALLENGER: 'text-[#f0e6a2]',
  UNRANKED: 'text-slate-500',
};

interface RankBadgeProps {
  entry?: LeagueEntry | null;
}

export default function RankBadge({ entry }: RankBadgeProps) {
  if (!entry) {
    return <span className="text-sm text-slate-500">Sin rango</span>;
  }

  const color = tierColors[entry.tier] ?? 'text-slate-400';
  const soloEntry = entry;

  return (
    <div className="flex flex-col">
      <span className={`text-sm font-bold ${color}`}>
        {soloEntry.tier} {soloEntry.rank}
      </span>
      <span className="text-xs text-slate-400">
        {soloEntry.leaguePoints} LP · {soloEntry.wins}W {soloEntry.losses}L
      </span>
    </div>
  );
}
