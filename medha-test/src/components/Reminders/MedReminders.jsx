import React from 'react';
import { Pill } from 'lucide-react';

export default function MedReminders({ medications, handleToggleMed }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Pill className="w-5 h-5 text-teal-600" /> Medication Reminders
        </h3>
      </div>
      <div className="space-y-3">
        {medications.map((med) => (
          <div
            key={med.id}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold text-slate-800">{med.name}</p>
              <p className="text-[11px] text-slate-500">
                {med.dosage} &bull; {med.frequency}
              </p>
              <p className="text-[10px] text-teal-700 font-medium mt-1">
                Scheduled Time: {med.time}
              </p>
            </div>
            <button
              onClick={() => handleToggleMed(med.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                med.takenToday
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-teal-700 text-white hover:bg-teal-800'
              }`}
            >
              {med.takenToday ? '✓ Taken Today' : 'Mark as Taken'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
