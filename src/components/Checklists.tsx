import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  ClipboardCheck, 
  Clock, 
  MapPin,
  Camera,
  ChevronRight,
  ShieldCheck,
  Zap,
  Users,
  ChevronDown,
  LayoutGrid
} from 'lucide-react';
import { cn } from '../lib/utils';
import { TUNE_UP_CHECKLIST, LADDER_SAFETY_CHECKLIST, SITE_INSPECTION_CHECKLIST } from '../services/gillyKnowledge';

interface ChecklistsProps {
  activeChecklist: 'tuneup' | 'ladder' | 'survey' | null;
  onChecklistChange: (checklist: 'tuneup' | 'ladder' | 'survey' | null) => void;
}

export default function Checklists({ activeChecklist, onChecklistChange }: ChecklistsProps) {
  const [doneItems, setDoneItems] = useState<string[]>([]);
  
  const activeData = activeChecklist === 'tuneup' 
    ? TUNE_UP_CHECKLIST 
    : activeChecklist === 'ladder' 
      ? LADDER_SAFETY_CHECKLIST 
      : activeChecklist === 'survey'
        ? SITE_INSPECTION_CHECKLIST
        : [];

  const [activeCategory, setActiveCategory] = useState<string>('');

  // Reset category when checklist changes
  React.useEffect(() => {
    if (activeData.length > 0) {
      setActiveCategory(activeData[0].category);
    }
  }, [activeChecklist, activeData]);

  const toggleItem = (text: string) => {
    setDoneItems(prev => 
      prev.includes(text) ? prev.filter(i => i !== text) : [...prev, text]
    );
  };

  const allItems = activeData.flatMap(c => c.items);
  const doneCount = doneItems.filter(item => allItems.includes(item)).length;
  const progress = allItems.length > 0 ? Math.round((doneCount / allItems.length) * 100) : 0;

  const selectorOptions = [
    { id: 'tuneup', label: 'Tune Up', icon: Zap, color: 'text-brand-accent', bg: 'bg-brand-accent/20' },
    { id: 'ladder', label: 'Ladder', icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-500/20' },
    { id: 'survey', label: 'Site', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/20' },
  ] as const;

  const currentOption = selectorOptions.find(o => o.id === activeChecklist);

  return (
    <div className="space-y-6 pb-20 pt-2">
      {!activeChecklist ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="px-2 text-center py-12">
            <div className="w-16 h-16 rounded-3xl bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20 mx-auto mb-4">
              <ClipboardCheck className="w-8 h-8 text-brand-accent" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white italic uppercase">Select Checklist</h2>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mt-2 flex items-center justify-center gap-2">
              <div className="w-1 h-1 rounded-full bg-brand-accent animate-ping" />
              Choose inspection type above
            </p>
          </div>
          
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-dashed border-white/5 text-center">
            <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-[0.2em] leading-relaxed">
              Standardized safety protocols must be followed on every job site. Select a module to begin documentation.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Progress Card */}
          <section className="bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              {activeChecklist === 'tuneup' ? <CheckCircle2 className="w-32 h-32 text-brand-accent" /> : activeChecklist === 'ladder' ? <ShieldCheck className="w-32 h-32 text-brand-accent" /> : <Users className="w-32 h-32 text-brand-accent" />}
            </div>
            <div className="relative z-10 space-y-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-black italic tracking-tight uppercase">
                  {activeChecklist === 'tuneup' ? '54-Point Tune Up' : activeChecklist === 'ladder' ? 'A-Frame Ladder Inspection' : 'Site Inspection & Intake'}
                </h3>
                <div className="flex items-center gap-3 text-[10px] uppercase font-bold text-white/40 tracking-widest">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {activeChecklist === 'tuneup' ? '20-30 MIN' : activeChecklist === 'ladder' ? '5-10 MIN' : '15 MIN'}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {activeChecklist === 'tuneup' ? 'RESIDENTIAL SITE' : activeChecklist === 'ladder' ? 'SAFETY PROTOCOL' : 'SALES & TECH'}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] uppercase font-black tracking-widest text-white/20">Inspection Progress</span>
                  <span className="text-3xl font-black text-brand-accent">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    key={activeChecklist}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-brand-accent shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
            {activeData.map(cat => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  activeCategory === cat.category 
                    ? "bg-brand-accent text-white shadow-xl shadow-brand-accent/20" 
                    : "bg-zinc-900 text-zinc-500 border border-white/5"
                )}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* active category content */}
          <div className="space-y-3 min-h-[300px]">
            {activeData.find(c => c.category === activeCategory)?.items.map((item, idx) => {
              const isDone = doneItems.includes(item);
              return (
                <motion.button
                  key={`${activeChecklist}-${item}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => toggleItem(item)}
                  className={cn(
                    "w-full flex items-center gap-4 p-5 rounded-3xl border transition-all text-left group",
                    isDone 
                      ? "bg-brand-accent/5 border-brand-accent/20" 
                      : "bg-zinc-900 border-white/5 hover:border-brand-accent/30 shadow-sm"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                    isDone ? "bg-brand-accent text-white" : "border-2 border-zinc-800 group-hover:border-brand-accent/50"
                  )}>
                    {isDone && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span className={cn(
                    "text-sm font-semibold flex-1 leading-tight",
                    isDone ? "text-brand-accent opacity-40 line-through" : "text-zinc-100"
                  )}>
                    {item}
                  </span>
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-all text-zinc-700",
                    isDone ? "opacity-0" : "opacity-40 group-hover:opacity-100 group-hover:translate-x-1"
                  )} />
                </motion.button>
              );
            })}
          </div>

          {/* Sticky Actions */}
          <div className="fixed bottom-24 left-4 right-4 grid grid-cols-2 gap-3 z-30">
            <button className="flex items-center justify-center gap-2 p-4 bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-white/5 font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all text-white">
              <Camera className="w-4 h-4 text-brand-accent" />
              Evidence
            </button>
            <button className="flex items-center justify-center gap-2 p-4 bg-brand-accent rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-accent/30 text-white active:scale-95 transition-all">
              Submit Report
            </button>
          </div>
        </>
      )}
    </div>
  );
}
