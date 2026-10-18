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
} from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'tracker', label: 'Daily Tracker', icon: Edit3 },
  { id: 'calendar', label: 'Calendar View', icon: CalendarIcon },
  { id: 'analytics', label: 'Analytics & Trends', icon: FileText },
  { id: 'reminders', label: 'Reminders & Care Plan', icon: Pill },
  { id: 'ai-insights', label: 'Gemini AI Insights', icon: Sparkles },
  { id: 'share', label: 'Doctor Sharing', icon: Share2 },
  { id: 'doctor-portal', label: 'Doctor Portal', icon: Stethoscope },
];

export default function NavTabs({ activeTab, setActiveTab, userRole = 'patient' }) {
  const isDoctor = userRole === 'doctor';

  // Customize tabs based on role
  const visibleTabs = isDoctor
    ? [
        { id: 'doctor-portal', label: 'Clinical Chart', icon: Stethoscope },
        { id: 'analytics', label: 'Patient Analytics & Vitals', icon: FileText },
        { id: 'calendar', label: 'Calendar Timeline', icon: CalendarIcon },
        { id: 'reminders', label: 'Active Care Plan', icon: Pill },
        { id: 'ai-insights', label: 'Gemini Clinical AI', icon: Sparkles },
        { id: 'dashboard', label: 'Patient View Preview', icon: Activity },
      ]
    : TABS;

  return (
    <div className="bg-teal-800 border-t border-teal-600/50">
      <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto space-x-1 sm:space-x-4">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition border-b-2 ${
                isActive
                  ? 'border-white text-white bg-teal-700/60'
                  : 'border-transparent text-teal-200 hover:text-white hover:bg-teal-700/30'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
