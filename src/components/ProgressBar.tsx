'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const remaining = total - current;

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm text-slate-400">Progresso de hoje</span>
        <span className="text-sm font-medium text-blue-400">
          {remaining} {remaining === 1 ? 'card restando' : 'cards restando'}
        </span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
