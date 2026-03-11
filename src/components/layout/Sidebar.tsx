'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '⚔️' },
  { href: '/leaderboard', label: 'Clasificación', icon: '🏆' },
  { href: '/matches', label: 'Partidas', icon: '🎮' },
  { href: '/settings', label: 'Configuración', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#111827] border-r border-[#374151] flex flex-col">
      <div className="p-6 border-b border-[#374151]">
        <h1 className="text-xl font-bold text-[#c89b3c]">Apiliga</h1>
        <p className="text-xs text-slate-400 mt-1">Liga LoL</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#1f2937] text-[#c89b3c] border border-[#c89b3c]/30'
                  : 'text-slate-400 hover:bg-[#1f2937] hover:text-slate-200'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#374151]">
        <p className="text-xs text-slate-500 text-center">Season 2025</p>
      </div>
    </aside>
  );
}
