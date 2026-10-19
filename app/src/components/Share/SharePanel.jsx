import React, { useState } from 'react';
import { Share2, Download } from 'lucide-react';

export default function SharePanel({ logs, avgPain, medAdherence, shareCode: propShareCode, onGenerateCode: propOnGenerateCode, onNavigateToDoctorPortal }) {
  const [localShareCode, setLocalShareCode] = useState('');
  const [shareExpiry, setShareExpiry] = useState('');

  const shareCode = propShareCode || localShareCode;

  const handleGenerateShareCode = () => {
    const code = 'CP-' + Math.floor(100000 + Math.random() * 900000);
    const exp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();
    setLocalShareCode(code);
    setShareExpiry(exp);
    if (propOnGenerateCode) {
      propOnGenerateCode(code, exp);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-teal-600" /> Secure Provider Sharing &amp; PDF Export
        </h2>
        <p className="text-xs text-slate-500">
          Provide your healthcare provider with temporary read access or printable health logs.
        </p>
      </div>

      {/* GENERATE ACCESS CODE */}
      <div className="bg-teal-50 p-5 rounded-xl border border-teal-200 space-y-3">
        <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider">
          Generate Temporary Provider Passcode
        </h3>
        <p className="text-xs text-teal-700">
          This passcode allows your provider to access a read-only clinical breakdown of your
          last 30 days.
        </p>

        {shareCode ? (
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-teal-300 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Passcode</span>
                <span className="text-xl font-mono font-bold text-teal-800">{shareCode}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Valid Until</span>
                <span className="text-xs font-semibold text-slate-700">{shareExpiry}</span>
              </div>
            </div>
            {onNavigateToDoctorPortal && (
              <button
                type="button"
                onClick={onNavigateToDoctorPortal}
                className="text-xs text-teal-700 hover:text-teal-850 font-bold underline flex items-center gap-1"
              >
                Open Doctor Portal with this passcode &rarr;
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={handleGenerateShareCode}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow transition"
          >
            Generate Passcode
          </button>
        )}
      </div>

      {/* PRINTABLE SUMMARY */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Doctor Visit Summary Prep
        </h3>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
          <p>
            <strong>Patient Logs Count:</strong> {logs.length} Total Daily Submissions
          </p>
          <p>
            <strong>Average Pain Rating:</strong> {avgPain} / 10
          </p>
          <p>
            <strong>Medication Adherence Rate:</strong> {medAdherence}%
          </p>
          <p>
            <strong>Recent Flare Summary:</strong> Rainy day joint stiffness logged on 2026-10-12.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Printable Clinical Report (PDF)
        </button>
      </div>
    </div>
  );
}
