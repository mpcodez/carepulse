import React, { useState, useMemo } from 'react';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useFirestore } from './hooks/useFirestore';
import { useAi } from './hooks/useAi';

// Data
import { initialLogs, initialMeds, initialAppointments } from './data/initialData';

// Layout
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AlertBanner from './components/common/AlertBanner';

// Views
import Dashboard from './components/Dashboard/Dashboard';
import TrackerForm from './components/Tracker/TrackerForm';
import CalendarView from './components/Calendar/CalendarView';
import Analytics from './components/Analytics/Analytics';
import MedReminders from './components/Reminders/MedReminders';
import AppointmentList from './components/Reminders/AppointmentList';
import AiReport from './components/AiInsights/AiReport';
import AiChat from './components/AiInsights/AiChat';
import SharePanel from './components/Share/SharePanel';
import DoctorDashboard from './components/Doctor/DoctorDashboard';
import VoiceCheckinModal from './components/Tracker/VoiceCheckinModal';

export default function App() {
  // --- Auth ---
  const { user, loading: authLoading } = useAuth();

  // --- Navigation ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // --- Voice Check-in Modal State ---
  const [isGlobalVoiceOpen, setIsGlobalVoiceOpen] = useState(false);

  // --- Doctor Sharing Passcode State ---
  const [shareCode, setShareCode] = useState('CP-482910');

  // --- Firestore-backed data ---
  const {
    data: logs,
    add: addLog,
    update: updateLog,
  } = useFirestore(user?.uid, 'healthLogs', initialLogs, {
    sort: (a, b) => new Date(b.date) - new Date(a.date),
  });

  const {
    data: medications,
    update: updateMed,
    add: addMed,
  } = useFirestore(user?.uid, 'medications', initialMeds);

  const { data: appointments, add: addAppointment } = useFirestore(
    user?.uid,
    'appointments',
    initialAppointments
  );

  // --- Daily Log Form ---
  const [logForm, setLogForm] = useState({
    date: new Date().toISOString().split('T')[0],
    painLevel: 3,
    fatigueLevel: 3,
    mood: 4,
    stress: 3,
    systolic: 120,
    diastolic: 80,
    heartRate: 72,
    glucose: 95,
    sleepHours: 7,
    waterIntake: 2000,
    notes: '',
    medsTaken: true,
  });

  // Direct save handler for 1-click voice submissions
  const handleDirectSubmitLog = async (entryData) => {
    const entry = {
      ...logForm,
      ...entryData,
      painLevel: Number(entryData.painLevel ?? logForm.painLevel),
      fatigueLevel: Number(entryData.fatigueLevel ?? logForm.fatigueLevel),
      mood: Number(entryData.mood ?? logForm.mood),
      stress: Number(entryData.stress ?? logForm.stress),
      systolic: Number(entryData.systolic ?? logForm.systolic),
      diastolic: Number(entryData.diastolic ?? logForm.diastolic),
      heartRate: Number(entryData.heartRate ?? logForm.heartRate),
      glucose: Number(entryData.glucose ?? logForm.glucose),
      sleepHours: Number(entryData.sleepHours ?? logForm.sleepHours),
      waterIntake: Number(entryData.waterIntake ?? logForm.waterIntake),
      notes: entryData.notes ?? logForm.notes,
      medsTaken: entryData.medsTaken ?? logForm.medsTaken,
      date: entryData.date ?? logForm.date,
    };

    const existing = logs.find((l) => l.date === entry.date);
    if (existing) {
      await updateLog(existing.id, entry);
    } else {
      await addLog(entry);
    }

    alert('Voice health entry saved successfully!');
    setActiveTab('dashboard');
  };

  const handleSaveLog = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    await handleDirectSubmitLog(logForm);
  };

  // --- Medication toggle ---
  const handleToggleMed = async (medId) => {
    const med = medications.find((m) => m.id === medId);
    if (!med) return;
    await updateMed(medId, { takenToday: !med.takenToday });
  };

  // --- AI state ---
  const { generate, loading: aiLoading } = useAi();
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am your CarePulse AI Health Assistant. Ask me anything about your health trends, symptom pacing, or preparation questions for your doctor!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const generateAiAnalysis = async () => {
    const prompt = `You are an expert AI clinical health assistant analyzing a chronic illness patient's recent 7-day health logs.
Log Summary Data: ${JSON.stringify(logs.slice(0, 7))}

Please provide:
1. Executive Summary & Symptom Trajectory (Pain vs Fatigue vs Sleep correlations).
2. Key Observations (e.g. identify potential triggers or patterns like poor sleep leading to higher pain/fatigue).
3. Practical Self-Care Pacing & Lifestyle Recommendations.
4. Suggested Questions or Notes to present to their Doctor at the next visit.

Format cleanly with readable Markdown bold headers and bullet points. Include a short medical disclaimer at the bottom.`;

    const text = await generate(
      prompt,
      'Act as an empathetic, encouraging, high-precision chronic illness health analyst. Always maintain patient safety and suggest clinical verification.'
    );
    setAiAnalysis(text);
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    const contextPrompt = `User's Health Logs: ${JSON.stringify(logs.slice(0, 5))}.
User Query: ${userMsg}.
Answer empathetically, concisely, and accurately based on patient care guidelines for chronic condition management. Always include a brief note that advice should be reviewed with a clinician.`;

    const answer = await generate(contextPrompt);
    setChatMessages((prev) => [...prev, { role: 'assistant', text: answer }]);
    setChatLoading(false);
  };

  // --- Computed stats ---
  const avgPain = useMemo(() => {
    if (!logs.length) return 0;
    return (logs.reduce((acc, l) => acc + (l.painLevel || 0), 0) / logs.length).toFixed(1);
  }, [logs]);

  const avgFatigue = useMemo(() => {
    if (!logs.length) return 0;
    return (logs.reduce((acc, l) => acc + (l.fatigueLevel || 0), 0) / logs.length).toFixed(1);
  }, [logs]);

  const medAdherence = useMemo(() => {
    if (!medications.length) return 100;
    const taken = medications.filter((m) => m.takenToday).length;
    return Math.round((taken / medications.length) * 100);
  }, [medications]);

  // --- Render ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notificationsEnabled={notificationsEnabled}
        setNotificationsEnabled={setNotificationsEnabled}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Alert banner */}
        {notificationsEnabled && (
          <AlertBanner onViewSchedule={() => setActiveTab('reminders')} />
        )}

        {/* Global Voice Check-in Modal */}
        <VoiceCheckinModal
          isOpen={isGlobalVoiceOpen}
          onClose={() => setIsGlobalVoiceOpen(false)}
          currentForm={logForm}
          onApplyMetrics={(metrics) => {
            setLogForm((prev) => ({ ...prev, ...metrics }));
            setActiveTab('tracker');
          }}
          onDirectSubmit={handleDirectSubmitLog}
        />

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <Dashboard
            logs={logs}
            medications={medications}
            avgPain={avgPain}
            avgFatigue={avgFatigue}
            medAdherence={medAdherence}
            setActiveTab={setActiveTab}
            setLogForm={setLogForm}
            handleToggleMed={handleToggleMed}
            onOpenVoiceCheckin={() => setIsGlobalVoiceOpen(true)}
          />
        )}

        {/* Daily Tracker */}
        {activeTab === 'tracker' && (
          <TrackerForm
            logForm={logForm}
            setLogForm={setLogForm}
            onSave={handleSaveLog}
            onDirectSubmit={handleDirectSubmitLog}
            onCancel={() => setActiveTab('dashboard')}
          />
        )}

        {/* Calendar */}
        {activeTab === 'calendar' && (
          <CalendarView logs={logs} setLogForm={setLogForm} setActiveTab={setActiveTab} />
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && <Analytics logs={logs} />}

        {/* Reminders & Care Plan */}
        {activeTab === 'reminders' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MedReminders medications={medications} handleToggleMed={handleToggleMed} />
            <AppointmentList appointments={appointments} />
          </div>
        )}

        {/* AI Insights */}
        {activeTab === 'ai-insights' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AiReport
              aiAnalysis={aiAnalysis}
              aiLoading={aiLoading}
              onGenerate={generateAiAnalysis}
            />
            <AiChat
              chatMessages={chatMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              chatLoading={chatLoading}
              onSend={handleSendChatMessage}
            />
          </div>
        )}

        {/* Doctor Sharing */}
        {activeTab === 'share' && (
          <SharePanel
            logs={logs}
            avgPain={avgPain}
            medAdherence={medAdherence}
            shareCode={shareCode}
            onGenerateCode={(code) => setShareCode(code)}
            onNavigateToDoctorPortal={() => setActiveTab('doctor-portal')}
          />
        )}

        {/* Doctor / Healthcare Provider Portal */}
        {activeTab === 'doctor-portal' && (
          <DoctorDashboard
            logs={logs}
            medications={medications}
            appointments={appointments}
            shareCode={shareCode}
            user={user}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
