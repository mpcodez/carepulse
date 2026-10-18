import React from 'react';
import { Pill, ShieldCheck } from 'lucide-react';

export default function MedReminders({ medications = [], handleToggleMed, userRole = 'patient' }) {
  const isDoctor = userRole === 'doctor';

  // DOCTOR MODE: Pure Read-Only Regimen Overview (No Reminders/Action Buttons)
  if (isDoctor) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" /> Prescribed Medication Regimen
          </h3>
          <span className="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold rounded-lg flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Clinical Record
          </span>
        </div>

        <div className="space-y-3">
          {medications.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">No active medications recorded for this patient.</p>
          ) : (
            medications.map((med) => (
              <div
                key={med.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{med.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {med.dosage} &bull; {med.frequency}
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-600 bg-slate-200/60 px-2.5 py-1 rounded-md">
                  {med.time}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // PATIENT MODE: Interactive Reminders & Logging
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Pill className="w-5 h-5 text-teal-600" /> Medication Reminders
        </h3>
      </div>

      <div className="space-y-3">
        {medications.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">No active medication reminders configured.</p>
        ) : (
          medications.map((med) => (
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
                type="button"
                onClick={() => handleToggleMed && handleToggleMed(med.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  med.takenToday
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-teal-700 text-white hover:bg-teal-800'
                }`}
              >
                {med.takenToday ? '✓ Taken Today' : 'Mark as Taken'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}