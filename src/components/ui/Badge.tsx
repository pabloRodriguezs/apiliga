interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'blue' | 'green' | 'red' | 'gray';
  size?: 'sm' | 'md';
}

const variants = {
  gold: 'bg-[#c89b3c]/20 text-[#f0e6a2] border border-[#c89b3c]/40',
  blue: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
  green: 'bg-green-500/20 text-green-300 border border-green-500/40',
  red: 'bg-red-500/20 text-red-300 border border-red-500/40',
  gray: 'bg-slate-700/50 text-slate-300 border border-slate-600',
};

export default function Badge({ children, variant = 'gray', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      {children}
    </span>
  );
}
