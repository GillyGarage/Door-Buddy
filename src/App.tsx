/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Wrench, 
  Calculator, 
  Brain, 
  CheckSquare, 
  GraduationCap,
  Hammer,
  HelpCircle,
  Zap,
  ShieldCheck,
  Users,
  ChevronDown,
  LayoutGrid,
  Video
} from 'lucide-react';
import { cn } from './lib/utils';
import Dashboard from './components/Dashboard';
import GillyChat from './components/GillyChat';
import SpringCalc from './components/SpringCalc';
import Guides from './components/Guides';
import AdminPanel from './components/AdminPanel';
import Checklists from './components/Checklists';
import Edu from './components/Edu';
import VideoLibrary from './components/VideoLibrary';
import { FirebaseProvider, useAuth } from './components/FirebaseProvider';

type Tab = 'home' | 'gilly' | 'springs' | 'guides' | 'checklists' | 'edu' | 'studio' | 'admin';
type ChecklistType = 'tuneup' | 'ladder' | 'survey';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const { user, profile, loading, signIn, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeChecklist, setActiveChecklist] = useState<ChecklistType | null>(null);
  const [isChecklistDropdownOpen, setIsChecklistDropdownOpen] = useState(false);
  const checklistDropdownRef = useRef<HTMLDivElement>(null);
  const [isLogoDropdownOpen, setIsLogoDropdownOpen] = useState(false);
  const logoDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (checklistDropdownRef.current && !checklistDropdownRef.current.contains(event.target as Node)) {
        setIsChecklistDropdownOpen(false);
      }
      if (logoDropdownRef.current && !logoDropdownRef.current.contains(event.target as Node)) {
        setIsLogoDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#124728] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <Zap className="w-12 h-12 text-brand-accent animate-pulse" />
          <p className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px]">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#124728] flex items-center justify-center p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent/20 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-primary/20 rounded-full blur-[100px] -ml-32 -mb-32" />
        
        <div className="max-w-md w-full space-y-12 relative z-10 text-center">
          <div className="space-y-6">
             <div className="w-24 h-24 mx-auto drop-shadow-2xl">
               <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect x="10" y="10" width="180" height="180" rx="45" fill="#024C4E"></rect>
                <g transform="translate(0, -15)">
                  <path d="M 100 45 L 30 90 L 30 120 L 55 120 L 55 100 L 100 70 L 145 100 L 145 120 L 170 120 L 170 90 Z" fill="white"></path>
                  <line x1="25" y1="135" x2="175" y2="135" stroke="white" strokeWidth="6" opacity="0.5"></line>
                  <rect x="30" y="125" width="12" height="20" rx="2" fill="#10B981"></rect>
                  <rect x="158" y="125" width="12" height="20" rx="2" fill="#10B981"></rect>
                  <rect x="45" y="128" width="50" height="14" rx="2" fill="#10B981"></rect>
                  <rect x="105" y="128" width="50" height="14" rx="2" fill="#10B981"></rect>
                  <rect x="96" y="122" width="8" height="26" rx="2" fill="white"></rect>
                </g>
              </svg>
             </div>
             <div className="space-y-2">
               <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Door Buddy</h1>
               <p className="text-brand-accent/60 font-bold tracking-widest text-[10px] uppercase">Automated Field Intelligence</p>
             </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={signIn}
            className="w-full py-4 bg-white text-[#124728] rounded-2xl font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
             <Users className="w-5 h-5" />
             Technician Login
          </motion.button>
        </div>
      </div>
    );
  }

  if (profile?.status === 'pending' && user.email !== 'joshua@garageup.com') {
    return (
      <div className="min-h-screen bg-[#124728] flex items-center justify-center p-6 text-center">
        <div className="max-w-sm w-full space-y-8 bg-zinc-900/50 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 shadow-2xl">
          <div className="w-20 h-20 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto text-brand-accent mb-6 animate-pulse">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Awaiting Approval</h2>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed italic">
              "Your account has been created. A notification has been sent to joshua@garageup.com for technical clearance."
            </p>
          </div>
          <div className="pt-4 space-y-3">
             <div className="px-4 py-2 rounded-full border border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                Status: Deployment Pending
             </div>
             <button 
               onClick={logout}
               className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-widest transition-colors"
             >
               Switch Account
             </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'home', icon: Home, label: 'Dashboard' },
    { id: 'springs', icon: Calculator, label: 'Spring Calculations' },
    { id: 'checklists', icon: CheckSquare, label: 'Site Checks' },
    { id: 'edu', icon: GraduationCap, label: 'Training' },
    { id: 'studio', icon: Video, label: 'Studio' },
  ];

  return (
    <div className="min-h-screen bg-[#124728] text-zinc-100 font-sans selection:bg-brand-accent selection:text-white">

      {/* Header */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 flex items-center justify-between",
          isScrolled ? "bg-zinc-900/90 backdrop-blur-md border-b border-white/5 py-3 shadow-xl" : "bg-transparent"
        )}
      >
        <div className="flex items-center gap-4">
          <div ref={logoDropdownRef} className="relative">
            <button 
              onClick={() => setIsLogoDropdownOpen(!isLogoDropdownOpen)}
              className="flex items-center gap-3 active:scale-95 transition-all text-left group"
            >
              <div className={cn(
                "w-10 h-10 drop-shadow-xl transition-all",
                isLogoDropdownOpen ? "scale-110 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : ""
              )}>
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <rect x="10" y="10" width="180" height="180" rx="45" fill="#024C4E"></rect>
                  <g transform="translate(0, -15)">
                    <path d="M 100 45 L 30 90 L 30 120 L 55 120 L 55 100 L 100 70 L 145 100 L 145 120 L 170 120 L 170 90 Z" fill="white"></path>
                    <line x1="25" y1="135" x2="175" y2="135" stroke="white" strokeWidth="6" opacity="0.5"></line>
                    <rect x="30" y="125" width="12" height="20" rx="2" fill="#10B981"></rect>
                    <rect x="158" y="125" width="12" height="20" rx="2" fill="#10B981"></rect>
                    <rect x="45" y="128" width="50" height="14" rx="2" fill="#10B981"></rect>
                    <rect x="105" y="128" width="50" height="14" rx="2" fill="#10B981"></rect>
                    <rect x="96" y="122" width="8" height="26" rx="2" fill="white"></rect>
                  </g>
                </svg>
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest leading-none mb-0.5">Garage Up</span>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-black tracking-tighter text-xl italic leading-none transition-colors text-white">Door Buddy</h1>
                  <ChevronDown className={cn("w-3 h-3 text-zinc-500 transition-transform", isLogoDropdownOpen && "rotate-180")} />
                </div>
              </div>
            </button>

            <AnimatePresence>
              {isLogoDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-3 p-2 rounded-2xl bg-zinc-900 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[60] min-w-[200px] backdrop-blur-xl bg-zinc-900/90"
                >
                  <div className="p-2 mb-2 border-b border-white/5">
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Main Modules</span>
                  </div>
                  <div className="grid gap-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as Tab);
                          setIsLogoDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                          activeTab === tab.id 
                            ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20" 
                            : "hover:bg-white/5 text-zinc-400 hover:text-white"
                        )}
                      >
                        <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-white" : "text-zinc-500")} />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">{tab.label}</span>
                        {activeTab === tab.id && <div className="ml-auto w-1 h-1 rounded-full bg-white animate-pulse" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'checklists' ? (
            <div ref={checklistDropdownRef} className="relative">
              <button
                onClick={() => setIsChecklistDropdownOpen(!isChecklistDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 shadow-lg active:scale-95 transition-all"
              >
                {activeChecklist === 'tuneup' && <Zap className="w-3.5 h-3.5 text-brand-accent" />}
                {activeChecklist === 'ladder' && <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />}
                {activeChecklist === 'survey' && <Users className="w-3.5 h-3.5 text-blue-500" />}
                {!activeChecklist && <LayoutGrid className="w-3.5 h-3.5 text-zinc-500" />}
                <span className="text-[10px] font-black text-white italic uppercase tracking-tight">
                  {activeChecklist === 'tuneup' ? 'Tune Up' : activeChecklist === 'ladder' ? 'Ladder' : activeChecklist === 'survey' ? 'Site' : 'Task'}
                </span>
                <ChevronDown className={cn("w-3 h-3 text-zinc-500 transition-transform", isChecklistDropdownOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isChecklistDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 p-1.5 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl z-[60] min-w-[140px]"
                  >
                    {[
                      { id: 'tuneup', label: 'Tune Up', icon: Zap, color: 'text-brand-accent', bg: 'bg-brand-accent/20' },
                      { id: 'ladder', label: 'Ladder', icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-500/20' },
                      { id: 'survey', label: 'Site', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/20' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setActiveChecklist(opt.id as ChecklistType);
                          setIsChecklistDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-2.5 rounded-lg transition-all",
                          activeChecklist === opt.id ? "bg-white/10" : "hover:bg-white/5"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <opt.icon className={cn("w-3.5 h-3.5", opt.color)} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{opt.label}</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <div className={cn("text-[8px] uppercase tracking-[0.2em] font-black transition-opacity", isScrolled ? "text-white/50" : "text-white/40")}>v1.1.0</div>
              <div className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="pb-20 pt-20 px-4 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'home' && <Dashboard onNavigate={(t) => setActiveTab(t as Tab)} />}
            {activeTab === 'gilly' && <GillyChat />}
            {activeTab === 'springs' && <SpringCalc />}
            {activeTab === 'guides' && user?.email === 'joshua@garageup.com' && <Guides />}
            {activeTab === 'checklists' && (
              <Checklists 
                activeChecklist={activeChecklist} 
                onChecklistChange={setActiveChecklist} 
              />
            )}
            {activeTab === 'edu' && <Edu />}
            {activeTab === 'studio' && <VideoLibrary />}
            {activeTab === 'admin' && user?.email === 'joshua@garageup.com' && <AdminPanel />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  );
}

