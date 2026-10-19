import React from 'react';
import { Activity, Bell, LogOut, User, Stethoscope, ArrowLeftRight } from 'lucide-react';
import { logOut } from '../../firebase/auth';
import NavTabs from './NavTabs';

export default function Header({
  user,
  userRole,
  activeTab,
  setActiveTab,
  notificationsEnabled,
  setNotificationsEnabled,
  onOpenAuth,
  onSwitchRole,
}) {
  const isDoctor = userRole === 'doctor';

  return (
    <header className="bg-teal-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setActiveTab(isDoctor ? 'doctor-portal' : 'dashboard')}
        >
          <div className="bg-white p-2 rounded-xl text-teal-700 shadow-inner">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">CarePulse</h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isDoctor ? 'bg-amber-400 text-slate-900' : 'bg-emerald-400 text-slate-900'
              }`}>
                {isDoctor ? 'Doctor Mode' : 'Patient Mode'}
              </span>
            </div>
            <p className="text-xs text-teal-200">
              {isDoctor ? 'Clinical Healthcare Provider View' : 'Chronic Care & Daily Health Tracker'}
            </p>
          </div>
        </div>

        {/* Right-side controls */}
        <div className="flex items-center gap-3">
          {/* Quick Switch Role Demo button */}
          <button
            onClick={onSwitchRole}
            className="hidden sm:flex items-center gap-1.5 text-xs bg-teal-800/80 hover:bg-teal-800 px-3 py-1.5 rounded-xl border border-teal-600/60 font-semibold transition text-teal-100"
            title="Switch between Patient and Doctor views"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Switch to {isDoctor ? 'Patient' : 'Doctor'}</span>
          </button>

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

          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-semibold text-teal-100">
              {user?.displayName || (isDoctor ? 'Dr. Sarah Jenkins' : 'Active Patient')}
            </span>
            <span className="text-[10px] font-mono bg-teal-800 px-2 py-0.5 rounded text-teal-200 truncate max-w-[140px]">
              {user ? user.email || user.uid.substring(0, 10) + '...' : 'Not signed in'}
            </span>
          </div>

          {user ? (
            <button
              onClick={async () => {
                await logOut();
                if (onLogoutSuccess) onLogoutSuccess();
              }}
              className="flex items-center gap-1 text-xs bg-teal-800 hover:bg-teal-900 px-3 py-1.5 rounded-lg text-teal-100 font-medium transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 text-xs bg-white text-teal-800 hover:bg-teal-50 px-3.5 py-1.5 rounded-lg font-bold shadow transition"
            >
              <User className="w-3.5 h-3.5" /> Sign In
            </button>
          )}
        </div>
      </div>

      {/* Navigation tabs */}
      <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />
    </header>
  );
}

