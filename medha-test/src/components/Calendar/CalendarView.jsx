import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DayCell from './DayCell';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView({ logs, setLogForm, setActiveTab }) {
  const [calendarView, setCalendarView] = useState('month');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const monthLabel = currentMonth.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const pad = (n) => String(n).padStart(2, '0');

  const handleClickEntry = (entry) => {
    alert(
      `Log for ${entry.date}:\nPain: ${entry.painLevel}/10\nFatigue: ${entry.fatigueLevel}/10\nSleep: ${entry.sleepHours}h\nNotes: ${entry.notes}`
    );
  };

  const handleClickEmpty = (dayNum) => {
    const dateStr = `${year}-${pad(month + 1)}-${pad(dayNum)}`;
    setLogForm((prev) => ({ ...prev, date: dateStr }));
    setActiveTab('tracker');
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Health Calendar</h2>
          <p className="text-xs text-slate-500">
            View severity trends and click any date to view log details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {['month', 'week', 'day'].map((view) => (
            <button
              key={view}
              onClick={() => setCalendarView(view)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                calendarView === view
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {calendarView === 'month' && (
        <div className="space-y-4">
          {/* Month navigation */}
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
            <button
              onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              className="p-1 hover:bg-slate-200 rounded"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <span className="font-bold text-slate-700 text-sm">{monthLabel}</span>
            <button
              onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              className="p-1 hover:bg-slate-200 rounded"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for offset */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${pad(month + 1)}-${pad(dayNum)}`;
              const entry = logs.find((l) => l.date === dateStr);

              return (
                <DayCell
                  key={dayNum}
                  dayNum={dayNum}
                  entry={entry}
                  onClickEntry={handleClickEntry}
                  onClickEmpty={handleClickEmpty}
                />
              );
            })}
          </div>
        </div>
      )}

      {(calendarView === 'week' || calendarView === 'day') && (
        <div className="p-8 text-center text-slate-500 border border-dashed rounded-xl">
          <p className="text-sm">Detailed Timeline View for {calendarView.toUpperCase()}</p>
          <p className="text-xs mt-1">
            Select entries from the monthly grid to inspect individual metric breakdowns.
          </p>
        </div>
      )}
    </div>
  );
}
