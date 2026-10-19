import React from 'react';

/**
 * A single day cell in the monthly calendar grid.
 */
export default function DayCell({ dayNum, entry, onClickEntry, onClickEmpty }) {
  const bgClass = entry
    ? entry.painLevel >= 6
      ? 'bg-rose-50 border-rose-200'
      : entry.painLevel >= 4
      ? 'bg-amber-50 border-amber-200'
      : 'bg-emerald-50 border-emerald-200'
    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100';

  const handleClick = () => {
    if (entry) {
      onClickEntry(entry);
    } else {
      onClickEmpty(dayNum);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`min-h-[75px] p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition hover:shadow-md ${bgClass}`}
    >
      <span className="text-xs font-bold text-slate-700">{dayNum}</span>
      {entry ? (
        <div className="space-y-1">
          <span
            className={`text-[10px] block px-1 py-0.5 rounded text-center font-bold ${
              entry.painLevel >= 6
                ? 'bg-rose-200 text-rose-800'
                : entry.painLevel >= 4
                ? 'bg-amber-200 text-amber-800'
                : 'bg-emerald-200 text-emerald-800'
            }`}
          >
            Pain: {entry.painLevel}
          </span>
          <span className="text-[9px] text-slate-500 block truncate">
            Fatigue: {entry.fatigueLevel}
          </span>
        </div>
      ) : (
        <span className="text-[10px] text-slate-400 text-center italic">+ Log</span>
      )}
    </div>
  );
}
