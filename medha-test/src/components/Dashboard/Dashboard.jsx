import React from 'react';
import { Activity, Clock, Pill, Sparkles, Plus } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import StatsCard from './StatsCard';

export default function Dashboard({
  logs,
  medications,
  avgPain,
  avgFatigue,
  medAdherence,
  setActiveTab,
  setLogForm,
  handleToggleMed,
}) {
  const chartData = [...logs].reverse().slice(-7);

  return (
    <div className="space-y-6">
      {/* WELCOME BANNER */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Welcome Back to Your Health Dashboard</h2>
          <p className="text-teal-100 text-sm mt-1">
            Tracking daily symptoms helps build long-term trends for better care decisions
            with your medical team.
          </p>
        </div>
        <button
          onClick={() => {
            setLogForm((prev) => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
            setActiveTab('tracker');
          }}
          className="bg-white text-teal-700 font-bold px-5 py-2.5 rounded-xl shadow hover:bg-teal-50 transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-5 h-5" /> Log Today's Entry
        </button>
      </div>

      {/* KEY STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Avg Pain (7 Days)"
          icon={<Activity className="w-4 h-4 text-rose-500" />}
          value={avgPain}
          suffix="/ 10"
          subtitle="Stable compared to last week"
          subtitleColor="text-emerald-600"
        />
        <StatsCard
          title="Avg Fatigue"
          icon={<Clock className="w-4 h-4 text-amber-500" />}
          value={avgFatigue}
          suffix="/ 10"
          subtitle="Moderate Energy Levels"
          subtitleColor="text-amber-600"
        />
        <StatsCard
          title="Meds Adherence"
          icon={<Pill className="w-4 h-4 text-teal-600" />}
          value={`${medAdherence}%`}
          subtitle={`${medications.filter((m) => m.takenToday).length} of ${medications.length} taken today`}
        />
        <StatsCard
          title="Logging Streak"
          icon={<Sparkles className="w-4 h-4 text-purple-500" />}
          value={`${logs.length} Days`}
          subtitle="Keep up the great routine!"
          subtitleColor="text-purple-600"
        />
      </div>

      {/* CHART + TODAY'S MEDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Symptom Trajectory */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">7-Day Symptom Trajectory</h3>
              <p className="text-xs text-slate-500">
                Correlation between daily Pain level &amp; Fatigue
              </p>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              View Full Analytics &rarr;
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Legend />
                <Line type="monotone" dataKey="painLevel" name="Pain Level (0-10)" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="fatigueLevel" name="Fatigue (0-10)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="sleepHours" name="Sleep (Hours)" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Medication Quick List */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800 text-lg">Today's Medications</h3>
              <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded font-semibold">
                {medications.filter((m) => m.takenToday).length} / {medications.length}
              </span>
            </div>
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {medications.map((med) => (
                <div
                  key={med.id}
                  onClick={() => handleToggleMed(med.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    med.takenToday
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${med.takenToday ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">{med.name}</p>
                      <p className="text-[11px] text-slate-500">{med.dosage} &bull; {med.time}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={med.takenToday}
                    onChange={() => {}}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setActiveTab('reminders')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            Manage Care Plan &amp; Reminders
          </button>
        </div>
      </div>

      {/* RECENT LOG RECAP */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-lg">Recent Health Journal Entries</h3>
          <button onClick={() => setActiveTab('calendar')} className="text-xs text-teal-600 font-semibold">
            View Full Calendar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {logs.slice(0, 3).map((log) => (
            <div key={log.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">{log.date}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    log.painLevel >= 6
                      ? 'bg-rose-100 text-rose-700'
                      : log.painLevel >= 4
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  Pain: {log.painLevel}/10
                </span>
              </div>
              <p className="text-xs text-slate-600 italic line-clamp-2">
                "{log.notes || 'No detailed journal notes added.'}"
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                <span>Fatigue: {log.fatigueLevel}/10</span>
                <span>Sleep: {log.sleepHours}h</span>
                <span>BP: {log.systolic}/{log.diastolic}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
