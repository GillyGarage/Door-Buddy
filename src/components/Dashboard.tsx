import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  Calculator, 
  Brain, 
  CheckSquare, 
  GraduationCap,
  Search,
  Wrench,
  FileText,
  ClipboardCheck,
  Award,
  Sparkles,
  Zap,
  Star,
  ChevronRight,
  Video,
  ShieldAlert
} from 'lucide-react';
import { cn } from '../lib/utils';
import { KNOWLEDGE_BOMBS } from '../services/knowledgeBombs';
import { useAuth } from './FirebaseProvider';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [tipIndex, setTipIndex] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % KNOWLEDGE_BOMBS.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const currentTip = KNOWLEDGE_BOMBS[tipIndex];

  const cards = [
    { id: 'springs', icon: Calculator, accentIcon: Wrench, label: 'Spring Calculations', color: 'bg-brand-accent text-white', shadow: 'shadow-brand-accent/20', desc: 'Spring Math & Counterbalance Specs' },
    { id: 'checklists', icon: CheckSquare, accentIcon: ClipboardCheck, label: 'Site Checklists', color: 'bg-brand-accent text-white', shadow: 'shadow-brand-accent/20', desc: 'Safety & 54-Point Inspections' },
    { id: 'edu', icon: GraduationCap, accentIcon: Award, label: 'Field Training', color: 'bg-brand-accent text-white', shadow: 'shadow-brand-accent/20', desc: 'Advanced Technical Education' },
    { id: 'studio', icon: Video, accentIcon: Zap, label: 'Field Studio', color: 'bg-brand-accent text-white', shadow: 'shadow-brand-accent/20', desc: 'Visual Training & Demos' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900 p-6 sm:p-8 text-white shadow-2xl border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/40 to-transparent z-0" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent/20 rounded-full blur-[100px] -mr-32 -mt-32 animate-pulse" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-6 sm:space-y-4 order-2 sm:order-1">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-white/10 text-brand-accent text-[9px] font-black uppercase tracking-[0.2em] border border-white/5 backdrop-blur-md italic">
                Advanced Technician Liaison
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_10px_rgba(var(--brand-accent),0.8)] animate-pulse" />
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-black leading-tight tracking-tighter italic">
              Door Buddy
            </h2>
            <p className="text-brand-accent/80 font-bold text-xs sm:text-sm italic tracking-tight">
              "You've got door problems, I've got door solutions"
            </p>
          </div>

          {/* Gilly Avatar */}
          <div className="order-1 sm:order-2 self-end sm:self-auto -mt-2 sm:mt-0">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('gilly')}
              className="relative group"
            >
              <div className="absolute -inset-2 bg-brand-accent/50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl relative bg-zinc-800">
                <img 
                  src="/regenerated_image_1777672651196.png" 
                  alt="Gilly"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover bg-[#0e530e]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                  <div className="px-3 py-1 rounded-md bg-brand-accent text-[9px] font-black uppercase tracking-widest text-white flex items-center gap-1 shadow-lg">
                    <Zap className="w-3 h-3 fill-current" /> Ask Gilly
                  </div>
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-gray-400 italic">Command Center</h3>
          <Zap className="w-3 h-3 text-gray-300" />
        </div>
        
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {cards.map((card, idx) => (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, type: 'spring', damping: 20 }}
              onClick={() => onNavigate(card.id)}
              className={cn(
                "group flex items-center gap-3 sm:gap-5 p-3 sm:p-4 bg-zinc-900 rounded-3xl border border-white/5 hover:border-brand-accent/50 shadow-lg transition-all text-left active:scale-[0.98]",
                "hover:shadow-brand-accent/5 hover:-translate-y-1"
              )}
            >
              <div className={cn("w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg", card.color, card.shadow)}>
                <card.icon className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5px]" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-black text-base sm:text-lg leading-none tracking-tight text-white uppercase italic">{card.label}</h4>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter leading-none">{card.desc}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-brand-accent group-hover:rotate-12 transition-all">
                <card.accentIcon className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-600 group-hover:text-white" />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Seasonal Tip */}
      <div className="relative group">
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setTipIndex((prev) => (prev + 1) % KNOWLEDGE_BOMBS.length)}
              className="p-1 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div 
              key={tipIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-start gap-4"
            >
              <div className="p-3 bg-brand-accent/10 rounded-2xl text-brand-accent shrink-0">
                <Zap className="w-5 h-5 fill-brand-accent" />
              </div>
              <div className="space-y-1">
                <h5 className="font-black text-[8px] uppercase tracking-[0.2em] text-brand-accent flex items-center gap-2">
                  <span>{currentTip.category}</span>
                  <span className="w-1 h-1 rounded-full bg-brand-accent/30" />
                  <span className="text-zinc-500 font-bold">{currentTip.title}</span>
                </h5>
                <p className="text-sm font-medium text-zinc-300 italic leading-relaxed">
                  "{currentTip.content}"
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Brain & Admin Icons (Admin Only) */}
        {user?.email === 'joshua@garageup.com' && (
          <div className="absolute -bottom-2 -right-2 z-20 flex gap-2 items-center">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 12 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate('admin')}
              className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] border-2 border-[#124728] group/admin"
              title="Admin Panel"
            >
              <ShieldAlert className="w-5 h-5 text-zinc-900" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 12 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate('guides')}
              className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(var(--brand-accent),0.4)] border-2 border-[#124728] group/brain"
              title="Gilly's Brain"
            >
              <Brain className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
