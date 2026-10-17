import React from 'react';
import { Activity, Heart, FileText } from 'lucide-react';

export default function TrackerForm({ logForm, setLogForm, onSave, onCancel }) {
  const handleChange = (field, value) => {
    setLogForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Daily Health Entry</h2>
          <p className="text-xs text-slate-500">Record symptoms, vitals, mood, and daily metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Date:</label>
          <input
            type="date"
            value={logForm.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
      </div>

      <form onSubmit={onSave} className="space-y-6">
        {/* SYMPTOM SEVERITY */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-teal-800 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4" /> Symptom Severity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl">
            {/* Pain */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Pain Level</span>
                <span className="text-rose-600 font-bold">{logForm.painLevel} / 10</span>
              </div>
              <input
                type="range" min="0" max="10"
                value={logForm.painLevel}
                onChange={(e) => handleChange('painLevel', e.target.value)}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>None (0)</span><span>Moderate (5)</span><span>Severe (10)</span>
              </div>
            </div>
            {/* Fatigue */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Fatigue Level</span>
                <span className="text-amber-600 font-bold">{logForm.fatigueLevel} / 10</span>
              </div>
              <input
                type="range" min="0" max="10"
                value={logForm.fatigueLevel}
                onChange={(e) => handleChange('fatigueLevel', e.target.value)}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Energized</span><span>Moderate</span><span>Exhausted</span>
              </div>
            </div>
          </div>
        </div>

        {/* MOOD & MENTAL WELL-BEING */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-teal-800 uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4" /> Mood &amp; Mental Well-being
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Overall Mood</span>
                <span className="text-emerald-600 font-bold">{logForm.mood} / 5</span>
              </div>
              <input
                type="range" min="1" max="5"
                value={logForm.mood}
                onChange={(e) => handleChange('mood', e.target.value)}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Low (1)</span><span>Neutral (3)</span><span>Great (5)</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Stress Level</span>
                <span className="text-purple-600 font-bold">{logForm.stress} / 5</span>
              </div>
              <input
                type="range" min="1" max="5"
                value={logForm.stress}
                onChange={(e) => handleChange('stress', e.target.value)}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Calm (1)</span><span>Moderate (3)</span><span>High (5)</span>
              </div>
            </div>
          </div>
        </div>

        {/* VITAL SIGNS & DAILY METRICS */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-teal-800 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4" /> Vital Signs &amp; Daily Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl">
            {[
              { label: 'BP Systolic (mmHg)', field: 'systolic' },
              { label: 'BP Diastolic (mmHg)', field: 'diastolic' },
              { label: 'Heart Rate (bpm)', field: 'heartRate' },
              { label: 'Blood Glucose (mg/dL)', field: 'glucose' },
              { label: 'Sleep (Hours)', field: 'sleepHours', step: '0.5' },
              { label: 'Water Intake (mL)', field: 'waterIntake', step: '100' },
            ].map(({ label, field, step }) => (
              <div key={field}>
                <label className="text-xs font-semibold text-slate-700 block mb-1">{label}</label>
                <input
                  type="number"
                  step={step}
                  value={logForm[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* JOURNAL NOTES */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
            Daily Notes &amp; Flare Observations
          </label>
          <textarea
            rows="3"
            value={logForm.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Record triggers, food intake, weather changes, or specific flare locations..."
            className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            Save Log Entry
          </button>
        </div>
      </form>
    </div>
  );
}
