interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export default function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`bg-[#111827] border border-[#374151] rounded-xl p-6 ${className}`}>
      {title && (
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
