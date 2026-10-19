import React from 'react';

/**
 * Reusable stat card for the dashboard grid.
 *
 * @param {object} props
 * @param {string} props.title - uppercase label
 * @param {React.ReactNode} props.icon - Lucide icon element
 * @param {string|number} props.value - main display value
 * @param {string} [props.suffix] - e.g. "/ 10"
 * @param {string} [props.subtitle] - descriptive note below the value
 * @param {string} [props.subtitleColor] - tailwind text-color class
 */
export default function StatsCard({ title, icon, value, suffix, subtitle, subtitleColor = 'text-slate-500' }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-500 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-800">{value}</span>
        {suffix && <span className="text-xs text-slate-400">{suffix}</span>}
      </div>
      {subtitle && (
        <div className={`mt-2 text-xs font-medium ${subtitleColor}`}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
