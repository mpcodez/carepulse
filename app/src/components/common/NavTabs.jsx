import React from 'react';
import {
  Activity,
  Edit3,
  Calendar as CalendarIcon,
  FileText,
  Pill,
  Sparkles,
  Share2,
  Stethoscope,
  ClipboardList,
  Bot,
} from 'lucide-react';

const PATIENT_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'tracker', label: 'Daily Tracker', icon: Edit3 },
  { id: 'calendar', label: 'Calendar View', icon: CalendarIcon },
  { id: 'analytics', label: 'Analytics & Trends', icon: FileText },
  { id: 'reminders', label: 'Reminders & Care Plan', icon: Pill },
  { id: 'ai-insights', label: 'Gemini AI Insights', icon: Sparkles },
  { id: 'share', label: 'Doctor Sharing', icon: Share2 },
  { id: 'doctor-portal', label: 'Doctor Portal', icon: Stethoscope },
];

const DOCTOR_TABS = [
  { id: 'doctor-portal', label: 'Dashboard', icon: Stethoscope },

  { id: 'dashboard', label: 'Patient View Preview', icon: Activity },
];

export default function NavTabs({ activeTab, setActiveTab, userRole = 'patient' }) {
  const isDoctor = userRole === 'doctor';

  // Customize tabs based on role
  const visibleTabs = isDoctor ? DOCTOR_TABS : PATIENT_TABS;

  return (
    <nav 
      aria-label="Main Navigation" 
      className="bg-teal-800 border-t border-teal-600/50 shadow-inner"
    >
      <div 
        role="tablist" 
        className="max-w-7xl mx-auto px-4 flex overflow-x-auto space-x-1 sm:space-x-4 no-scrollbar"
      >
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 border-b-2 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-800 ${
                isActive
                  ? 'border-white text-white bg-teal-700/60 font-semibold'
                  : 'border-transparent text-teal-200 hover:text-white hover:bg-teal-700/30'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}