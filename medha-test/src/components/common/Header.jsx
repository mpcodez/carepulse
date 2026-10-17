import React from 'react';
import { Activity, Bell, LogOut } from 'lucide-react';
import { logOut } from '../../firebase/auth';
import NavTabs from './NavTabs';

export default function Header({ user, activeTab, setActiveTab, notificationsEnabled, setNotificationsEnabled }) {
  return (
    <header className="bg-teal-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="bg-white p-2 rounded-xl text-teal-700 shadow-inner">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">CarePulse</h1>
            <p className="text-xs text-teal-200">Chronic Care &amp; Daily Health Tracker</p>
          </div>
        </div>

        {/* Right-side controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`p-2 rounded-lg transition ${
              notificationsEnabled
                ? 'bg-teal-600 text-yellow-300'
                : 'bg-teal-800 text-teal-300'
            }`}
            title="Toggle Alert Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-teal-100">Patient ID</span>
            <span className="text-xs font-mono bg-teal-800 px-2 py-0.5 rounded text-teal-200">
              {user ? user.uid.substring(0, 10) + '...' : 'Guest Patient'}
            </span>
          </div>

          {user && (
            <button
              onClick={() => logOut()}
              className="flex items-center gap-1 text-xs bg-teal-800 hover:bg-teal-900 px-3 py-1.5 rounded-lg text-teal-100 font-medium transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          )}
        </div>
      </div>

      {/* Navigation tabs */}
      <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </header>
  );
}
