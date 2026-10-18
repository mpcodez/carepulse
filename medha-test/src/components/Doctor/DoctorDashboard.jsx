import React, { useState, useMemo } from 'react';
import {
  ShieldCheck, Lock, UserCheck, AlertTriangle, FileText, Activity,
  Heart, Download, RefreshCw, CheckCircle, Clock, Pill, Calendar, ChevronRight
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function DoctorDashboard({ logs, medications, appointments, shareCode, user, userRole }) {
  const [enteredCode, setEnteredCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(userRole === 'doctor');
  const [authError, setAuthError] = useState('');

  // Auto authenticate if logged in as a doctor
  React.useEffect(() => {
    if (userRole === 'doctor') {
      setIsAuthenticated(true);
    }
  }, [userRole]);

  const [selectedLog, setSelectedLog] = useState(null);

  // Authentication check: matches active shareCode or demo code 'CP-DEMO'
  const handleVerifyPasscode = (e) => {
    e.preventDefault();
    setAuthError('');
    const cleanCode = enteredCode.trim().toUpperCase();

    if (!cleanCode) {
      setAuthError('Please enter a provider access passcode.');
      return;
    }

    if (cleanCode === 'CP-DEMO' || (shareCode && cleanCode === shareCode.toUpperCase())) {
      setIsAuthenticated(true);
    } else {
      setAuthError('Invalid or expired passcode. Please ask the patient for their current active passcode.');
    }
  };

  // Metrics
  const avgPain = useMemo(() => {
    if (!logs.length) return 0;
    return (logs.reduce((acc, l) => acc + (l.painLevel || 0), 0) / logs.length).toFixed(1);
  }, [logs]);

  const avgFatigue = useMemo(() => {
    if (!logs.length) return 0;
    return (logs.reduce((acc, l) => acc + (l.fatigueLevel || 0), 0) / logs.length).toFixed(1);
  }, [logs]);

  const adherenceRate = useMemo(() => {
    if (!medications.length) return 100;
    const taken = medications.filter(m => m.takenToday).length;
    return Math.round((taken / medications.length) * 100);
  }, [medications]);

  // High flare episodes (Pain >= 6 or Fatigue >= 7)
  const flaggedFlares = useMemo(() => {
    return logs.filter(l => (l.painLevel >= 6 || l.fatigueLevel >= 7));
  }, [logs]);

  // LOCKED STATE: Doctor must enter valid access passcode
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl mx-auto flex items-center justify-center backdrop-blur-md mb-3 border border-white/20">
            <ShieldCheck className="w-8 h-8 text-teal-300" />
          </div>
          <h2 className="text-2xl font-bold">Healthcare Provider Portal</h2>
          <p className="text-xs text-teal-200 mt-1 max-w-sm mx-auto">
            HIPAA-aligned read-only clinical dashboard. Enter the patient's temporary access passcode to review longitudinal health data.
          </p>
        </div>

        <form onSubmit={handleVerifyPasscode} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Patient Access Passcode
            </label>
            <div className="relative">
              <input
                type="text"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                placeholder="e.g. CP-123456"
                className="w-full px-4 py-3.5 pl-11 rounded-xl border border-slate-300 text-sm font-mono tracking-widest focus:ring-2 focus:ring-teal-500 outline-none uppercase font-bold"
              />
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            {shareCode && (
              <p className="text-[11px] text-teal-700 mt-1">
                Tip for testing: Current active patient code is <span className="font-mono font-bold bg-teal-50 px-1.5 py-0.5 rounded">{shareCode}</span> or <span className="font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded">CP-DEMO</span>.
              </p>
            )}
            {!shareCode && (
              <p className="text-[11px] text-slate-500 mt-1">
                Tip for testing: You can enter <span className="font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded">CP-DEMO</span> to test the provider view.
              </p>
            )}
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold tracking-wider uppercase shadow-md transition flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" /> Verify Passcode &amp; Access Chart
          </button>

          <p className="text-[10px] text-center text-slate-400">
            All records are encrypted and read-only. Access sessions expire after 7 days or upon patient revocation.
          </p>
        </form>
      </div>
    );
  }

  // AUTHENTICATED STATE: Complete Doctor Dashboard
  return (
    <div className="space-y-6">
      {/* TOP HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Provider Session Active
            </span>
            <span className="text-xs text-slate-400 font-mono">Patient: {user ? user.uid.slice(0, 10) + '...' : 'PT-89421'}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">Clinical Encounter Overview</h2>
          <p className="text-xs text-slate-500">Longitudinal chronic symptom trajectory &amp; objective vitals history</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Print / PDF Chart
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition"
          >
            Exit Provider Mode
          </button>
        </div>
      </div>

      {/* QUICK CLINICAL METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Pain (14d)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-slate-800">{avgPain}</span>
            <span className="text-xs text-slate-400">/ 10</span>
          </div>
          <span className="text-[10px] text-rose-600 font-semibold block mt-1">Chronic baseline</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Fatigue (14d)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-slate-800">{avgFatigue}</span>
            <span className="text-xs text-slate-400">/ 10</span>
          </div>
          <span className="text-[10px] text-amber-600 font-semibold block mt-1">Significant fatigue impact</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Regimen Adherence</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-teal-700">{adherenceRate}%</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">{medications.length} prescribed medications</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Flagged Flare Episodes</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-rose-600">{flaggedFlares.length}</span>
            <span className="text-xs text-slate-400">in 7 days</span>
          </div>
          <span className="text-[10px] text-rose-500 font-semibold block mt-1">Requires review</span>
        </div>
      </div>

      {/* CHARTS: PAIN/FATIGUE TRAJECTORY & BLOOD PRESSURE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Pain &amp; Fatigue Longitudinal Plot</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[...logs].reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="painLevel" name="Pain (0-10)" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="fatigueLevel" name="Fatigue (0-10)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="sleepHours" name="Sleep (Hours)" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Hemodynamic Stability (Blood Pressure &amp; HR)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[...logs].reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={[50, 150]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="systolic" name="Systolic (mmHg)" stroke="#0d9488" strokeWidth={2} />
                <Line type="monotone" dataKey="diastolic" name="Diastolic (mmHg)" stroke="#0284c7" strokeWidth={2} />
                <Line type="monotone" dataKey="heartRate" name="Heart Rate (bpm)" stroke="#e11d48" strokeWidth={1.5} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: ACTIVE MEDICATIONS & RECENT DETAILED LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Medication Regimen */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Pill className="w-4 h-4 text-teal-600" /> Prescribed Regimen
          </h3>
          <div className="space-y-3">
            {medications.map((med) => (
              <div key={med.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-800">{med.name}</p>
                  <p className="text-[11px] text-slate-500">{med.dosage} &bull; {med.frequency}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  med.takenToday ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {med.takenToday ? 'Taken Today' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Daily Logs Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" /> Patient Daily Journal Entries
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {logs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="p-3.5 bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 rounded-2xl transition cursor-pointer space-y-1.5"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">{log.date}</span>
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      log.painLevel >= 6 ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      Pain: {log.painLevel}/10
                    </span>
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-800">
                      Fatigue: {log.fatigueLevel}/10
                    </span>
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 text-blue-800">
                      Sleep: {log.sleepHours}h
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic line-clamp-2">
                  "{log.notes || 'No notes added for this date.'}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}