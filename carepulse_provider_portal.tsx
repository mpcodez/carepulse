import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Key,
  Calendar,
  FileText,
  BrainCircuit,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  PlusCircle,
  Activity,
  Heart,
  Droplet,
  Moon,
  Pill,
  ChevronRight,
  ShieldAlert,
  Send,
  UserCheck,
  Zap,
  Lock,
  Unlock,
  Filter,
  Download,
  Stethoscope,
  Sparkles,
  X,
  MessageSquare,
  Check,
  RefreshCw
} from 'lucide-react';

// --- MOCK DATA FOR PATIENTS & PASSCODES ---
const initialPatients = {
  'SJ-4092': {
    id: 'p1',
    passcode: 'SJ-4092',
    name: 'Sarah Jenkins',
    age: 42,
    gender: 'Female',
    condition: 'Fibromyalgia & ME/CFS',
    riskLevel: 'High',
    riskColor: 'bg-amber-100 text-amber-800 border-amber-300',
    emergencyContact: 'Mark Jenkins (Spouse) - (555) 234-5678',
    primaryDoctor: 'Dr. Evelyn Vance, MD',
    lastSync: '10 mins ago',
    vitals: {
      avgPain: 6.2,
      avgFatigue: 7.1,
      bp: '128/82',
      glucose: 102,
      sleep: 6.1,
      medAdherence: 85,
    },
    medications: [
      { name: 'Duloxetine', dosage: '60mg daily', schedule: 'Morning', status: 'Active' },
      { name: 'Pregabalin', dosage: '150mg BID', schedule: 'Morning & Night', status: 'Active' },
      { name: 'Low Dose Naltrexone', dosage: '4.5mg nightly', schedule: 'Bedtime', status: 'Active' },
    ],
    logs: [
      { id: 'l1', date: '2026-10-17', painLevel: 7, fatigueLevel: 8, mood: 'Low', bp: '130/84', glucose: 105, sleep: 5.5, medsTaken: true, notes: 'Severe flare up after light grocery shopping. Widespread joint aching.' },
      { id: 'l2', date: '2026-10-16', painLevel: 6, fatigueLevel: 7, mood: 'Fair', bp: '126/80', glucose: 98, sleep: 6.0, medsTaken: true, notes: 'Brain fog made reading difficult today. Rested most of afternoon.' },
      { id: 'l3', date: '2026-10-15', painLevel: 5, fatigueLevel: 6, mood: 'Good', bp: '124/82', glucose: 101, sleep: 7.2, medsTaken: true, notes: 'Felt slightly improved. Completed 15 min gentle stretching.' },
      { id: 'l4', date: '2026-10-14', painLevel: 8, fatigueLevel: 9, mood: 'Severe Pain', bp: '132/86', glucose: 108, sleep: 4.8, medsTaken: false, notes: 'Missed evening medication. Triggered high pain spike.' },
      { id: 'l5', date: '2026-10-13', painLevel: 5, fatigueLevel: 6, mood: 'Fair', bp: '125/81', glucose: 99, sleep: 6.5, medsTaken: true, notes: 'Stable day overall.' },
      { id: 'l6', date: '2026-10-12', painLevel: 6, fatigueLevel: 7, mood: 'Fair', bp: '127/83', glucose: 100, sleep: 6.2, medsTaken: true, notes: 'Mild headache in morning.' },
      { id: 'l7', date: '2026-10-11', painLevel: 6, fatigueLevel: 6, mood: 'Good', bp: '122/79', glucose: 96, sleep: 7.0, medsTaken: true, notes: 'Slept well.' },
    ]
  },
  'MC-8819': {
    id: 'p2',
    passcode: 'MC-8819',
    name: 'Marcus Chen',
    age: 58,
    gender: 'Male',
    condition: 'Type 2 Diabetes & Hypertension',
    riskLevel: 'Moderate',
    riskColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    emergencyContact: 'Lin Chen (Daughter) - (555) 876-5432',
    primaryDoctor: 'Dr. Evelyn Vance, MD',
    lastSync: '1 hour ago',
    vitals: {
      avgPain: 2.1,
      avgFatigue: 4.0,
      bp: '138/88',
      glucose: 142,
      sleep: 7.4,
      medAdherence: 94,
    },
    medications: [
      { name: 'Metformin XR', dosage: '1000mg BID', schedule: 'Breakfast & Dinner', status: 'Active' },
      { name: 'LisinoPril', dosage: '20mg daily', schedule: 'Morning', status: 'Active' },
      { name: 'Atorvastatin', dosage: '20mg nightly', schedule: 'Bedtime', status: 'Active' },
    ],
    logs: [
      { id: 'l21', date: '2026-10-17', painLevel: 2, fatigueLevel: 4, mood: 'Good', bp: '136/86', glucose: 148, sleep: 7.5, medsTaken: true, notes: 'Fasting glucose elevated after high-carb dinner last night.' },
      { id: 'l22', date: '2026-10-16', painLevel: 2, fatigueLevel: 3, mood: 'Good', bp: '138/88', glucose: 135, sleep: 8.0, medsTaken: true, notes: 'Walked 30 mins in neighborhood.' },
      { id: 'l23', date: '2026-10-15', painLevel: 3, fatigueLevel: 5, mood: 'Fair', bp: '140/90', glucose: 152, sleep: 6.8, medsTaken: true, notes: 'Slight dizziness in early morning.' },
      { id: 'l24', date: '2026-10-14', painLevel: 1, fatigueLevel: 4, mood: 'Good', bp: '135/85', glucose: 130, sleep: 7.2, medsTaken: true, notes: 'BP steady.' },
    ]
  },
  'ER-1204': {
    id: 'p3',
    passcode: 'ER-1204',
    name: 'Elena Rostova',
    age: 34,
    gender: 'Female',
    condition: 'Systemic Lupus Erythematosus (SLE)',
    riskLevel: 'Critical Alert',
    riskColor: 'bg-rose-100 text-rose-800 border-rose-300',
    emergencyContact: 'Dmitri Rostov (Brother) - (555) 901-2345',
    primaryDoctor: 'Dr. Evelyn Vance, MD',
    lastSync: '25 mins ago',
    vitals: {
      avgPain: 7.8,
      avgFatigue: 8.5,
      bp: '134/86',
      glucose: 110,
      sleep: 4.5,
      medAdherence: 70,
    },
    medications: [
      { name: 'Hydroxychloroquine', dosage: '200mg BID', schedule: 'Morning & Night', status: 'Active' },
      { name: 'Prednisone', dosage: '10mg daily', schedule: 'Morning', status: 'Tapering' },
      { name: 'Methotrexate', dosage: '15mg weekly', schedule: 'Sundays', status: 'Active' },
    ],
    logs: [
      { id: 'l31', date: '2026-10-17', painLevel: 9, fatigueLevel: 9, mood: 'Severe Pain', bp: '138/88', glucose: 112, sleep: 4.0, medsTaken: true, notes: 'Malar rash severe today. Joint swelling in both hands. High fatigue.' },
      { id: 'l32', date: '2026-10-16', painLevel: 8, fatigueLevel: 8, mood: 'Low', bp: '135/85', glucose: 108, sleep: 4.5, medsTaken: false, notes: 'Extreme morning stiffness lasting >2 hours.' },
      { id: 'l33', date: '2026-10-15', painLevel: 7, fatigueLevel: 8, mood: 'Fair', bp: '130/84', glucose: 110, sleep: 5.0, medsTaken: true, notes: 'Feverish sensation (99.8F).' },
    ]
  }
};

const initialAppointments = [
  { id: 'a1', patientName: 'Elena Rostova', passcode: 'ER-1204', time: '09:00 AM', date: '2026-10-18', type: 'Urgent Flare Follow-up', mode: 'In-Person', status: 'Confirmed', notes: 'Evaluate lupus flare and joint swelling. Review steroid dosage.' },
  { id: 'a2', patientName: 'Sarah Jenkins', passcode: 'SJ-4092', time: '11:30 AM', date: '2026-10-18', type: 'Chronic Care Review', mode: 'Telehealth', status: 'Confirmed', notes: 'Monthly check on fibromyalgia pacing & fatigue scores.' },
  { id: 'a3', patientName: 'Marcus Chen', passcode: 'MC-8819', time: '02:15 PM', date: '2026-10-18', type: 'HbA1c & BP Lab Review', mode: 'In-Person', status: 'Confirmed', notes: 'Discuss recent fasting glucose trends and Lisinopril efficacy.' },
  { id: 'a4', patientName: 'Sarah Jenkins', passcode: 'SJ-4092', time: '10:00 AM', date: '2026-10-25', type: 'Medication Management', mode: 'Telehealth', status: 'Scheduled', notes: 'Assess LDN response.' },
];

const initialClinicalNotes = [
  {
    id: 'n1',
    passcode: 'SJ-4092',
    patientName: 'Sarah Jenkins',
    date: '2026-09-20',
    provider: 'Dr. Evelyn Vance, MD',
    subjective: 'Patient reports increased fatigue over the past 2 weeks following prolonged physical activity. Pain average around 6/10.',
    objective: 'Vitals stable. BP 124/80. No acute joint erythema, but tender points positive at upper trapezius.',
    assessment: 'Fibromyalgia flare secondary to overexertion.',
    plan: '1. Re-emphasize pacing strategy. 2. Continue Pregabalin 150mg BID. 3. Follow up in 4 weeks via telehealth.'
  },
  {
    id: 'n2',
    passcode: 'ER-1204',
    patientName: 'Elena Rostova',
    date: '2026-10-02',
    provider: 'Dr. Evelyn Vance, MD',
    subjective: 'Complains of facial rash flare up and severe morning stiffness.',
    objective: 'Mild malar erythema noted. Hand PIP joint tenderness present bilateral.',
    assessment: 'SLE mild-to-moderate systemic flare.',
    plan: '1. Temporary Prednisone burst at 10mg daily. 2. Recheck ESR/CRP in 2 weeks.'
  }
];

export default function App() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [patients, setPatients] = useState(initialPatients);
  const [unlockedCodes, setUnlockedCodes] = useState(['SJ-4092', 'MC-8819']); // Default unlocked
  const [selectedPasscode, setSelectedPasscode] = useState('SJ-4092');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Appointments state
  const [appointments, setAppointments] = useState(initialAppointments);
  const [showAddApptModal, setShowAddApptModal] = useState(false);
  const [newAppt, setNewAppt] = useState({
    patientName: 'Sarah Jenkins',
    passcode: 'SJ-4092',
    time: '10:00 AM',
    date: new Date().toISOString().split('T')[0],
    type: 'Routine Follow-up',
    mode: 'Telehealth',
    notes: ''
  });

  // Clinical Notes state
  const [clinicalNotes, setClinicalNotes] = useState(initialClinicalNotes);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteForm, setNoteForm] = useState({
    passcode: 'SJ-4092',
    patientName: 'Sarah Jenkins',
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });

  // AI State
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Hello Dr. Vance. I am your CarePulse Clinical Decision Support AI. I can analyze unlocked patient logs, flag dangerous symptom trends, or draft clinical notes.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Active Selected Patient Data
  const currentPatient = useMemo(() => {
    return patients[selectedPasscode] || null;
  }, [patients, selectedPasscode]);

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- PASSCODE UNLOCK HANDLER ---
  const handleUnlockPatient = (e) => {
    e.preventDefault();
    const cleanCode = passcodeInput.trim().toUpperCase();
    if (!cleanCode) {
      setPasscodeError('Please enter a valid patient passcode.');
      return;
    }

    // Check if passcode exists in database
    if (patients[cleanCode]) {
      if (!unlockedCodes.includes(cleanCode)) {
        setUnlockedCodes([...unlockedCodes, cleanCode]);
      }
      setSelectedPasscode(cleanCode);
      setPasscodeInput('');
      setPasscodeError('');
      showToast(`Successfully unlocked record for ${patients[cleanCode].name} (${cleanCode})`);
    } else {
      // Demo auto-generator if an unknown code is provided!
      const newGeneratedPatient = {
        id: `p_${Date.now()}`,
        passcode: cleanCode,
        name: `Patient (${cleanCode})`,
        age: Math.floor(Math.random() * 30) + 30,
        gender: Math.random() > 0.5 ? 'Female' : 'Male',
        condition: 'Auto-Imported Chronic Condition',
        riskLevel: 'Moderate',
        riskColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        emergencyContact: 'Primary Guardian - (555) 000-0000',
        primaryDoctor: 'Dr. Evelyn Vance, MD',
        lastSync: 'Just now',
        vitals: {
          avgPain: 4.5,
          avgFatigue: 5.0,
          bp: '120/80',
          glucose: 100,
          sleep: 7.0,
          medAdherence: 90,
        },
        medications: [
          { name: 'Standard Maintenance Therapy', dosage: '1 tablet daily', schedule: 'Morning', status: 'Active' }
        ],
        logs: [
          { id: 'l_gen1', date: new Date().toISOString().split('T')[0], painLevel: 4, fatigueLevel: 5, mood: 'Fair', bp: '120/80', glucose: 100, sleep: 7.0, medsTaken: true, notes: 'Patient connected via secure passcode authorization code.' }
        ]
      };

      setPatients(prev => ({ ...prev, [cleanCode]: newGeneratedPatient }));
      setUnlockedCodes(prev => [...prev, cleanCode]);
      setSelectedPasscode(cleanCode);
      setPasscodeInput('');
      setPasscodeError('');
      showToast(`New patient profile unlocked and loaded for Passcode ${cleanCode}`);
    }
  };

  // --- ADD APPOINTMENT HANDLER ---
  const handleAddAppointment = (e) => {
    e.preventDefault();
    const appt = {
      ...newAppt,
      id: `a_${Date.now()}`,
      status: 'Confirmed'
    };
    setAppointments([appt, ...appointments]);
    setShowAddApptModal(false);
    showToast(`Appointment scheduled for ${newAppt.patientName} on ${newAppt.date}`);
  };

  // --- TOGGLE APPOINTMENT STATUS ---
  const handleToggleApptStatus = (id) => {
    setAppointments(appointments.map(a => {
      if (a.id === id) {
        const statuses = ['Confirmed', 'In-Progress', 'Completed', 'Rescheduled'];
        const nextIdx = (statuses.indexOf(a.status) + 1) % statuses.length;
        return { ...a, status: statuses[nextIdx] };
      }
      return a;
    }));
  };

  // --- SAVE CLINICAL NOTE HANDLER ---
  const handleSaveNote = (e) => {
    e.preventDefault();
    const note = {
      ...noteForm,
      id: `n_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      provider: 'Dr. Evelyn Vance, MD'
    };
    setClinicalNotes([note, ...clinicalNotes]);
    setShowNoteModal(false);
    showToast(`SOAP Note saved for ${noteForm.patientName}`);
  };

  // --- GEMINI API CALL HANDLER ---
  const callGeminiApi = async (prompt, systemInstruction = '') => {
    try {
      const apiKey = ""; // API key supplied dynamically by Canvas runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
      };

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to retrieve clinical analysis at this time.";
    } catch (err) {
      console.error(err);
      return "Clinical AI service unavailable. Please check system connectivity.";
    }
  };

  // --- GENERATE AI CLINICAL SUMMARY ---
  const handleGenerateClinicalSummary = async () => {
    if (!currentPatient) return;
    setAiLoading(true);

    const prompt = `Act as an advanced physician decision-support AI tool.
Analyze the following patient history:
Patient Name: ${currentPatient.name}
Condition: ${currentPatient.condition}
Vitals Averages: Pain: ${currentPatient.vitals.avgPain}/10, Fatigue: ${currentPatient.vitals.avgFatigue}/10, BP: ${currentPatient.vitals.bp}, Glucose: ${currentPatient.vitals.glucose} mg/dL, Med Adherence: ${currentPatient.vitals.medAdherence}%
Recent Patient Logs: ${JSON.stringify(currentPatient.logs.slice(0, 5))}
Current Medications: ${JSON.stringify(currentPatient.medications)}

Please generate a high-precision Doctor's Clinical Briefing containing:
1. **Clinical Impression & Trajectory Summary**
2. **Key Flare-up Triggers & Biomarker Anomaly Detection**
3. **Recommended Treatment Plan Adjustments & Laboratory Orders**
4. **Draft SOAP Note Snippet** for the upcoming consultation.

Format cleanly with bold headers and bullet points.`;

    const systemPrompt = "You are a specialized clinical care assistant supporting physicians. Provide objective, high-value clinical insights based strictly on evidence in patient records.";

    const response = await callGeminiApi(prompt, systemPrompt);
    setAiAnalysis(response);
    setAiLoading(false);
  };

  // --- AI CHAT CONSULTATION ---
  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    const unlockedData = unlockedCodes.map(code => ({
      name: patients[code]?.name,
      condition: patients[code]?.condition,
      risk: patients[code]?.riskLevel,
      avgPain: patients[code]?.vitals?.avgPain
    }));

    const contextPrompt = `You are CarePulse Physician AI Assistant.
Cohort context (Unlocked Patients): ${JSON.stringify(unlockedData)}.
Active Selected Patient Context: ${currentPatient ? JSON.stringify({ name: currentPatient.name, condition: currentPatient.condition, logs: currentPatient.logs }) : 'None selected'}.

Doctor Question: ${userMsg}`;

    const answer = await callGeminiApi(contextPrompt, "Respond as a knowledgeable clinical decision support bot for medical doctors. Keep responses concise, precise, and professional.");
    setChatMessages(prev => [...prev, { role: 'assistant', text: answer }]);
    setChatLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col antialiased">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-teal-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-teal-500 to-indigo-600 rounded-lg shadow-inner">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">CarePulse</span>
                <span className="text-xs bg-teal-500/20 text-teal-300 font-semibold px-2 py-0.5 rounded border border-teal-500/30">PROVIDER PORTAL</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Physician Clinical Dashboard & Multi-Patient Care Engine</p>
            </div>
          </div>

          {/* Doctor Profile Info */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-100">Dr. Evelyn Vance, MD</span>
              <span className="text-xs text-teal-400">Rheumatology & Internal Med</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-600 border-2 border-teal-400 flex items-center justify-center font-bold text-white shadow-sm">
              EV
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-slate-800/90 backdrop-blur border-t border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none">
            {[
              { id: 'dashboard', label: 'Patient Access & Dashboard', icon: Users },
              { id: 'schedule', label: 'Appointments & Schedule', icon: Calendar },
              { id: 'notes', label: 'Clinical Notes & Care Plans', icon: FileText },
              { id: 'ai-insights', label: 'AI Provider Insights', icon: BrainCircuit },
              { id: 'analytics', label: 'Cohort Population Analytics', icon: TrendingUp },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* QUICK CLINICAL ALERT BANNER */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm font-medium">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Clinical Flag:</strong> 1 patient in unlocked list (Elena Rostova - ER-1204) logged severe pain spike (9/10) today.
            </span>
          </div>
          <button
            onClick={() => { setSelectedPasscode('ER-1204'); setActiveTab('dashboard'); }}
            className="text-amber-800 underline hover:text-amber-950 font-semibold text-xs ml-2"
          >
            Review Profile &rarr;
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">

        {/* ==================================================================== */}
        {/* TAB 1: PATIENT ACCESS & DASHBOARD */}
        {/* ==================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* HERO / PASSCODE INPUT ENTRY CARD */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Left Passcode Input */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="flex items-center space-x-2 text-indigo-900">
                    <Key className="w-5 h-5 text-teal-600" />
                    <h2 className="font-bold text-lg">Access Patient Portal via Passcode</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Enter the 6-character secure code provided by your patient (e.g. <code className="bg-slate-100 px-1.5 py-0.5 rounded text-teal-700 font-mono">SJ-4092</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded text-teal-700 font-mono">MC-8819</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded text-teal-700 font-mono">ER-1204</code>) to authorize access.
                  </p>

                  <form onSubmit={handleUnlockPatient} className="flex flex-col sm:flex-row gap-2 pt-1">
                    <div className="relative flex-1">
                      <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. PAT-8921 or SJ-4092"
                        value={passcodeInput}
                        onChange={(e) => { setPasscodeInput(e.target.value); setPasscodeError(''); }}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm uppercase font-mono tracking-wider text-slate-900 focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm shadow-sm transition flex items-center justify-center space-x-2"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Authorize Access</span>
                    </button>
                  </form>
                  {passcodeError && <p className="text-xs text-rose-600 font-medium">{passcodeError}</p>}
                </div>

                {/* Right Quick Switch Bar */}
                <div className="lg:col-span-6 bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Unlocked Active Patient Cohort ({unlockedCodes.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {unlockedCodes.map(code => {
                      const p = patients[code];
                      const isSelected = selectedPasscode === code;
                      return (
                        <button
                          key={code}
                          onClick={() => setSelectedPasscode(code)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium border transition ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <UserCheck className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                          <span>{p ? p.name : code}</span>
                          <span className={`text-[10px] font-mono px-1 rounded ${isSelected ? 'bg-slate-800 text-teal-300' : 'bg-slate-100 text-slate-500'}`}>
                            {code}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* UNLOCKED PATIENT CLINICAL DASHBOARD */}
            {currentPatient ? (
              <div className="space-y-6">

                {/* Patient Profile Header Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-teal-700 text-xl shadow-inner">
                        {currentPatient.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h1 className="text-xl font-bold text-slate-900">{currentPatient.name}</h1>
                          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${currentPatient.riskColor}`}>
                            {currentPatient.riskLevel} Risk
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {currentPatient.age} Yrs &bull; {currentPatient.gender} &bull; Condition: <strong className="text-slate-700">{currentPatient.condition}</strong>
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Passcode: <code className="font-mono text-slate-600 bg-slate-100 px-1 rounded">{currentPatient.passcode}</code> &bull; Last Patient Log: {currentPatient.lastSync}
                        </p>
                      </div>
                    </div>

                    {/* Actions & Emergency Contact */}
                    <div className="flex flex-wrap gap-2 items-center">
                      <button
                        onClick={() => {
                          setNoteForm(prev => ({ ...prev, passcode: currentPatient.passcode, patientName: currentPatient.name }));
                          setShowNoteModal(true);
                        }}
                        className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add SOAP Note</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('ai-insights');
                          handleGenerateClinicalSummary();
                        }}
                        className="px-3 py-2 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center space-x-1.5"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>AI Clinical Brief</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                    <div>
                      <strong className="text-slate-800">Emergency Contact:</strong> {currentPatient.emergencyContact}
                    </div>
                    <div>
                      <strong className="text-slate-800">Attending Physician:</strong> {currentPatient.primaryDoctor}
                    </div>
                  </div>
                </div>

                {/* 7-DAY & 30-DAY VITALS SUMMARY GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-medium">Avg Pain (7d)</span>
                      <Activity className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{currentPatient.vitals.avgPain}<span className="text-xs text-slate-400 font-normal">/10</span></div>
                    <span className={`text-[10px] font-semibold mt-1 inline-block px-1.5 py-0.5 rounded ${currentPatient.vitals.avgPain > 6 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {currentPatient.vitals.avgPain > 6 ? 'Elevated' : 'Normal Range'}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-medium">Avg Fatigue</span>
                      <Zap className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{currentPatient.vitals.avgFatigue}<span className="text-xs text-slate-400 font-normal">/10</span></div>
                    <span className="text-[10px] font-semibold mt-1 inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      High Impact
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-medium">Blood Pressure</span>
                      <Heart className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="text-xl font-bold text-slate-900">{currentPatient.vitals.bp}</div>
                    <span className="text-[10px] font-semibold text-slate-500">mmHg (Mean)</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-medium">Avg Glucose</span>
                      <Droplet className="w-4 h-4 text-sky-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{currentPatient.vitals.glucose}<span className="text-xs text-slate-400 font-normal"> mg/dL</span></div>
                    <span className="text-[10px] font-semibold text-slate-500">Fasting Trend</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-medium">Avg Sleep</span>
                      <Moon className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{currentPatient.vitals.sleep}<span className="text-xs text-slate-400 font-normal"> hrs</span></div>
                    <span className="text-[10px] font-semibold text-slate-500">Rest Efficiency</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-medium">Med Adherence</span>
                      <Pill className="w-4 h-4 text-teal-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{currentPatient.vitals.medAdherence}%</div>
                    <span className={`text-[10px] font-semibold mt-1 inline-block px-1.5 py-0.5 rounded ${currentPatient.vitals.medAdherence >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {currentPatient.vitals.medAdherence >= 80 ? 'Good' : 'Needs Review'}
                    </span>
                  </div>
                </div>

                {/* INTERACTIVE SYMPTOM COMPARISON CHART SIMULATION */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">7-Day Symptom Trajectory & Correlation</h3>
                      <p className="text-xs text-slate-500">Pain severity vs Fatigue score over recent patient entries</p>
                    </div>
                    <div className="flex items-center space-x-4 text-xs font-medium">
                      <span className="flex items-center"><span className="w-3 h-3 bg-rose-500 rounded-full mr-1.5"></span> Pain (1-10)</span>
                      <span className="flex items-center"><span className="w-3 h-3 bg-amber-400 rounded-full mr-1.5"></span> Fatigue (1-10)</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    {currentPatient.logs.map((log) => (
                      <div key={log.id} className="grid grid-cols-12 gap-2 items-center text-xs">
                        <span className="col-span-3 sm:col-span-2 font-medium text-slate-600 font-mono">{log.date}</span>
                        <div className="col-span-9 sm:col-span-10 space-y-1">
                          {/* Pain Bar */}
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-rose-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${(log.painLevel / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className="w-6 text-right font-bold text-slate-700">{log.painLevel}</span>
                          </div>
                          {/* Fatigue Bar */}
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${(log.fatigueLevel / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className="w-6 text-right text-slate-500">{log.fatigueLevel}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FULL PATIENT LOG HISTORY TIMELINE TABLE */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Historical Patient Log Entries</h3>
                      <p className="text-xs text-slate-500">Real-time daily entries submitted by patient</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Pain</th>
                          <th className="px-4 py-3">Fatigue</th>
                          <th className="px-4 py-3">BP / Glucose</th>
                          <th className="px-4 py-3">Sleep</th>
                          <th className="px-4 py-3">Meds Taken</th>
                          <th className="px-4 py-3">Patient Notes & Symptoms</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {currentPatient.logs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50/80 transition">
                            <td className="px-4 py-3 font-medium font-mono text-slate-900 whitespace-nowrap">{log.date}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full font-semibold ${log.painLevel >= 7 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'}`}>
                                {log.painLevel} / 10
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap font-medium">{log.fatigueLevel} / 10</td>
                            <td className="px-4 py-3 whitespace-nowrap font-mono">{log.bp} | {log.glucose} mg/dL</td>
                            <td className="px-4 py-3 whitespace-nowrap">{log.sleep} hrs</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {log.medsTaken ? (
                                <span className="text-emerald-600 font-semibold flex items-center"><Check className="w-3.5 h-3.5 mr-1" /> Yes</span>
                              ) : (
                                <span className="text-rose-600 font-semibold flex items-center"><X className="w-3.5 h-3.5 mr-1" /> Missed</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-slate-600 max-w-xs italic">{log.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
                <Lock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-semibold text-base text-slate-800">No Patient Record Currently Unlocked</p>
                <p className="text-xs text-slate-500 mt-1">Please enter a passcode above to load patient history.</p>
              </div>
            )}

          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: APPOINTMENTS & SCHEDULE */}
        {/* ==================================================================== */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Provider Daily Consultation Agenda</h2>
                <p className="text-xs text-slate-500">Manage patient appointments, telehealth calls, and visit statuses</p>
              </div>
              <button
                onClick={() => setShowAddApptModal(true)}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs shadow-sm transition flex items-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Schedule New Appointment</span>
              </button>
            </div>

            {/* APPOINTMENT LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((appt) => (
                <div key={appt.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-teal-300 transition space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
                        {appt.date} &bull; {appt.time}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 mt-0.5">{appt.patientName}</h3>
                      <p className="text-xs text-teal-700 font-medium">{appt.type} ({appt.mode})</p>
                    </div>
                    <button
                      onClick={() => handleToggleApptStatus(appt.id)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition ${
                        appt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        appt.status === 'In-Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        appt.status === 'Completed' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {appt.status}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                    "{appt.notes}"
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                    <span className="text-slate-400 text-[11px]">Passcode: <code className="font-mono">{appt.passcode}</code></span>
                    <button
                      onClick={() => {
                        setSelectedPasscode(appt.passcode);
                        setActiveTab('dashboard');
                      }}
                      className="text-teal-600 hover:text-teal-800 font-semibold flex items-center space-x-1"
                    >
                      <span>Open Patient Vitals</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: CLINICAL NOTES & CARE PLANS */}
        {/* ==================================================================== */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Clinical SOAP Notes & Care Plan Repository</h2>
                <p className="text-xs text-slate-500">Official medical records and treatment adjustments</p>
              </div>
              <button
                onClick={() => setShowNoteModal(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-sm transition flex items-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New SOAP Note</span>
              </button>
            </div>

            {/* NOTES LIST */}
            <div className="space-y-4">
              {clinicalNotes.map((note) => (
                <div key={note.id} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-base text-slate-900">{note.patientName}</h3>
                        <span className="text-xs text-slate-400 font-mono">({note.passcode})</span>
                      </div>
                      <p className="text-xs text-slate-500">Enc. Date: {note.date} &bull; Attending: {note.provider}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                      <strong className="text-slate-800 uppercase tracking-wider text-[10px] block mb-1">Subjective (S)</strong>
                      <p className="text-slate-700">{note.subjective}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                      <strong className="text-slate-800 uppercase tracking-wider text-[10px] block mb-1">Objective (O)</strong>
                      <p className="text-slate-700">{note.objective}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                      <strong className="text-slate-800 uppercase tracking-wider text-[10px] block mb-1">Assessment (A)</strong>
                      <p className="text-slate-700">{note.assessment}</p>
                    </div>
                    <div className="bg-teal-50/50 p-3 rounded-xl border border-teal-200/60">
                      <strong className="text-teal-900 uppercase tracking-wider text-[10px] block mb-1">Plan & Care Strategy (P)</strong>
                      <p className="text-teal-950 font-medium">{note.plan}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: AI PROVIDER INSIGHTS */}
        {/* ==================================================================== */}
        {activeTab === 'ai-insights' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: AI Clinical Brief Generator */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2">
                  <BrainCircuit className="w-6 h-6 text-indigo-600" />
                  <div>
                    <h2 className="font-bold text-base text-slate-900">AI Clinical Briefing Generator</h2>
                    <p className="text-xs text-slate-500">Automated log analysis & flare trigger detection</p>
                  </div>
                </div>
                <button
                  onClick={handleGenerateClinicalSummary}
                  disabled={aiLoading}
                  className="px-4 py-2 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-xs shadow-sm transition flex items-center space-x-2 disabled:opacity-50"
                >
                  {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{aiLoading ? 'Analyzing...' : 'Generate Brief'}</span>
                </button>
              </div>

              {currentPatient && (
                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  Targeting Active Patient: <strong className="text-slate-800">{currentPatient.name}</strong> ({currentPatient.passcode}) &bull; Condition: {currentPatient.condition}
                </div>
              )}

              <div className="min-h-[350px] bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-800 font-sans leading-relaxed overflow-y-auto max-h-[500px]">
                {aiAnalysis ? (
                  <div className="whitespace-pre-line space-y-2">{aiAnalysis}</div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2 py-16">
                    <BrainCircuit className="w-10 h-10 text-slate-300" />
                    <p className="font-medium">Click "Generate Brief" above to analyze patient history.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: AI Assistant Chat */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col h-[580px]">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-3">
                <MessageSquare className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900">Clinical Consultation Assistant</h3>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-xl ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="text-slate-400 italic text-[11px] flex items-center space-x-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>AI is formulating response...</span>
                  </div>
                )}
              </div>

              <div className="pt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about drug interactions, cohort stats..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={handleSendChatMessage}
                  className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: COHORT POPULATION ANALYTICS */}
        {/* ==================================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Population Health & Risk Stratification</h2>
              <p className="text-xs text-slate-500">Cohort insights across all authorized chronic patient records</p>
            </div>

            {/* HIGH LEVEL STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Total Active Cohort</span>
                  <div className="text-3xl font-bold text-slate-900 mt-1">{Object.keys(patients).length}</div>
                </div>
                <Users className="w-8 h-8 text-indigo-500" />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium">High / Critical Flares</span>
                  <div className="text-3xl font-bold text-rose-600 mt-1">2 Patients</div>
                </div>
                <AlertCircle className="w-8 h-8 text-rose-500" />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Cohort Med Adherence</span>
                  <div className="text-3xl font-bold text-emerald-600 mt-1">83%</div>
                </div>
                <Pill className="w-8 h-8 text-emerald-500" />
              </div>
            </div>

            {/* PATIENT RISK LIST */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Patient Risk Breakdown</h3>
              <div className="space-y-3">
                {Object.values(patients).map((p) => (
                  <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                        {p.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900">{p.name}</span>
                          <span className="text-xs text-slate-400 font-mono">({p.passcode})</span>
                        </div>
                        <p className="text-xs text-slate-500">{p.condition}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Avg Pain</span>
                        <span className="font-bold text-slate-800">{p.vitals.avgPain}/10</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Adherence</span>
                        <span className="font-bold text-slate-800">{p.vitals.medAdherence}%</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.riskColor}`}>
                        {p.riskLevel}
                      </span>
                      <button
                        onClick={() => { setSelectedPasscode(p.passcode); setActiveTab('dashboard'); }}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-medium text-xs hover:bg-slate-800 transition"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-4 h-4 text-teal-400" />
            <span className="font-semibold text-slate-200">CarePulse Healthcare Provider Network</span>
          </div>
          <p>&copy; 2026 CarePulse Inc. HIPAA Compliant Authorized Provider Interface.</p>
        </div>
      </footer>

      {/* ==================================================================== */}
      {/* MODAL: ADD APPOINTMENT */}
      {/* ==================================================================== */}
      {showAddApptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Schedule Patient Visit</h3>
              <button onClick={() => setShowAddApptModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAppointment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Select Patient</label>
                <select
                  value={newAppt.passcode}
                  onChange={(e) => {
                    const code = e.target.value;
                    setNewAppt({
                      ...newAppt,
                      passcode: code,
                      patientName: patients[code]?.name || 'Patient'
                    });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                >
                  {Object.values(patients).map(p => (
                    <option key={p.passcode} value={p.passcode}>
                      {p.name} ({p.passcode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={newAppt.date}
                    onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Time</label>
                  <input
                    type="text"
                    value={newAppt.time}
                    onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Visit Type</label>
                  <input
                    type="text"
                    value={newAppt.type}
                    onChange={(e) => setNewAppt({ ...newAppt, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Mode</label>
                  <select
                    value={newAppt.mode}
                    onChange={(e) => setNewAppt({ ...newAppt, mode: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  >
                    <option value="Telehealth">Telehealth</option>
                    <option value="In-Person">In-Person</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Consultation Agenda Notes</label>
                <textarea
                  rows={3}
                  value={newAppt.notes}
                  onChange={(e) => setNewAppt({ ...newAppt, notes: e.target.value })}
                  placeholder="Primary objective for consultation..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddApptModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-sm"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: CREATE SOAP NOTE */}
      {/* ==================================================================== */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Create Clinical SOAP Note</h3>
              <button onClick={() => setShowNoteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Patient</label>
                <select
                  value={noteForm.passcode}
                  onChange={(e) => {
                    const code = e.target.value;
                    setNoteForm({
                      ...noteForm,
                      passcode: code,
                      patientName: patients[code]?.name || 'Patient'
                    });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                >
                  {Object.values(patients).map(p => (
                    <option key={p.passcode} value={p.passcode}>
                      {p.name} ({p.passcode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Subjective (S)</label>
                <textarea
                  rows={2}
                  required
                  value={noteForm.subjective}
                  onChange={(e) => setNoteForm({ ...noteForm, subjective: e.target.value })}
                  placeholder="Patient reported symptoms..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Objective (O)</label>
                <textarea
                  rows={2}
                  required
                  value={noteForm.objective}
                  onChange={(e) => setNoteForm({ ...noteForm, objective: e.target.value })}
                  placeholder="Physical exam, vitals, labs..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Assessment (A)</label>
                <textarea
                  rows={2}
                  required
                  value={noteForm.assessment}
                  onChange={(e) => setNoteForm({ ...noteForm, assessment: e.target.value })}
                  placeholder="Clinical diagnostic assessment..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Plan (P)</label>
                <textarea
                  rows={2}
                  required
                  value={noteForm.plan}
                  onChange={(e) => setNoteForm({ ...noteForm, plan: e.target.value })}
                  placeholder="Medication adjustments, follow-up..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm"
                >
                  Save Note to Chart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}