import React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { marked } from 'marked'; // 1. Import marked

export default function AiReport({ aiAnalysis, aiLoading, onGenerate }) {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" /> Gemini AI Health Clinical Summary
          </h2>
          <p className="text-xs text-slate-500">
            Automated pattern detection &amp; symptom correlations.
          </p>
        </div>
        <button
          onClick={onGenerate}
          disabled={aiLoading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-2 disabled:opacity-50"
        >
          {aiLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {aiAnalysis ? 'Regenerate Analysis' : 'Generate AI Report'}
        </button>
      </div>

      {aiAnalysis ? (
        /* 2. Render markdown output as safe HTML */
        <div 
          className="bg-purple-50/50 p-5 rounded-xl border border-purple-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 markdown-content"
          dangerouslySetInnerHTML={{ __html: marked.parse(aiAnalysis) }}
        />
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 space-y-2">
          <Sparkles className="w-8 h-8 text-purple-400 mx-auto" />
          <p className="text-xs font-semibold">
            Click &quot;Generate AI Report&quot; to perform an automated Gemini AI analysis on
            your logged health metrics.
          </p>
        </div>
      )}
    </div>
  );
}