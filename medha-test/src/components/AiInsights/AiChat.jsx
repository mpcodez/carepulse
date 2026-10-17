import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function AiChat({ chatMessages, chatInput, setChatInput, chatLoading, onSend }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSend();
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-[500px]">
      <div>
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-teal-600" /> Health Q&amp;A Chatbot
        </h3>
        <div className="space-y-3 mt-3 max-h-[350px] overflow-y-auto pr-1 text-xs">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl ${
                msg.role === 'user'
                  ? 'bg-teal-700 text-white ml-6'
                  : 'bg-slate-100 text-slate-800 mr-6'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {chatLoading && (
            <div className="text-slate-400 text-[11px] italic">Gemini is thinking...</div>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t border-slate-200">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 outline-none"
        />
        <button
          onClick={onSend}
          className="px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold"
        >
          Send
        </button>
      </div>
    </div>
  );
}
