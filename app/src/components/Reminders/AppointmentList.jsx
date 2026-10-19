import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function AppointmentList({ appointments }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-teal-600" /> Doctor Appointments
        </h3>
      </div>
      <div className="space-y-3">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-800">{appt.doctor}</p>
                <p className="text-[11px] text-teal-700 font-semibold">{appt.specialty}</p>
              </div>
              <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">
                {appt.date} @ {appt.time}
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              <strong>Location:</strong> {appt.location}
            </p>
            <p className="text-[11px] text-slate-500 italic">
              <strong>Prep Notes:</strong> {appt.notes}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
