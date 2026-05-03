import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Play, 
  Layers, 
  Settings2, 
  FileWarning,
  Component,
  Award,
  BookOpen,
  Search,
  Hammer,
  ShieldAlert,
  Settings,
  ArrowLeft,
  Terminal,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PILLARS_OF_THE_CALL, CODE_OF_CONDUCT } from '../services/gillyKnowledge';
import { 
  TUNE_UP_SOP, 
  TROUBLESHOOTING_SPRINGS_SOP, 
  DOOR_WEIGHT_SOP, 
  HIGH_LIFT_SOP, 
  COUNTERBALANCE_SYSTEMS_SOP, 
  TRACK_ROLLER_GEOMETRY_SOP, 
  EXTREME_TENSION_SAFETY_SOP,
  ROLLING_STEEL_SOP
} from '../services/academyContent';
import { LEAD_GEN_TACTICS } from '../services/leadGenTactics';
import { PRICING_SOP } from '../services/pricingSop';
import { COMMERCIAL_OPERATOR_SOP } from '../services/commercialSop';
import {
  FIELD_SAFETY_SOP,
  SITE_INSPECTION_SOP,
  INSTALL_SECTIONAL_SOP,
  OPERATOR_INSTALL_SOP,
  ROLLER_REPLACEMENT_SOP,
  FIELD_RESOURCES_SOP
} from '../services/fieldSops';

const TOPICS = [
  { id: 1, title: 'Preventative Maintenance', desc: 'The 54-point "Read the door like a book" inspection.', icon: Settings2, fullContent: TUNE_UP_SOP },
  { id: 10, title: 'Field Safety Protocols', desc: 'PPE, sterilization, and high-tension stabilization.', icon: ShieldAlert, fullContent: FIELD_SAFETY_SOP },
  { id: 11, title: 'Site Inspection SOP', desc: 'Critical measurements and clearance verification.', icon: Search, fullContent: SITE_INSPECTION_SOP },
  { id: 12, title: 'Door Installation SOP', desc: 'Procedures for standard lift sectional doors.', icon: Hammer, fullContent: INSTALL_SECTIONAL_SOP },
  { id: 13, title: 'Operator Installation SOP', desc: 'Trolley and Jackshaft deployment steps.', icon: Settings, fullContent: OPERATOR_INSTALL_SOP },
  { id: 14, title: 'Roller Replacement SOP', desc: 'Track removal, hinge removal, and spread methods.', icon: Component, fullContent: ROLLER_REPLACEMENT_SOP },
  { id: 15, title: 'Tools & Components', desc: 'Essential kit lists and standard lift parts.', icon: Hammer, fullContent: FIELD_RESOURCES_SOP },
  { id: 2, title: 'Troubleshooting Springs', desc: 'Diagnostics, balance checks, and the 10-15lb rule.', icon: FileWarning, fullContent: TROUBLESHOOTING_SPRINGS_SOP },
  { id: 3, title: 'Determining Door Weight', desc: 'Scales vs. Charts: finding the true dead weight.', icon: Layers, fullContent: DOOR_WEIGHT_SOP },
  { id: 4, title: 'High Lift Conversion SOP', desc: 'Floor-to-ceiling math and Adder piece selection.', icon: Terminal, fullContent: HIGH_LIFT_SOP },
  { id: 5, title: 'Field Growth & Leads', desc: '99+ tactics for technician-driven business growth.', icon: Award, fullContent: LEAD_GEN_TACTICS },
  { id: 9, title: 'I.C. Service Charges', desc: 'Labor rate charts and 2.0x/1.5x pricing formulas.', icon: Clock, fullContent: PRICING_SOP },
  { id: 16, title: 'Commercial Ops (CDX)', desc: 'Maintenance, duty cycles, and troubleshooting codes.', icon: ShieldAlert, fullContent: COMMERCIAL_OPERATOR_SOP },
  { id: 6, title: 'Track & Roller Geometry', desc: 'Graduate slope, radius realities, and rear pitch.', icon: Component, fullContent: TRACK_ROLLER_GEOMETRY_SOP },
  { id: 7, title: 'Extreme High-Tension Safety', desc: 'Procedures for zero-risk hardware handling.', icon: FileWarning, fullContent: EXTREME_TENSION_SAFETY_SOP },
  { id: 8, title: 'Rolling Steel Systems', desc: 'Curtain coiling, initial tension, and DBCI specs.', icon: Terminal, fullContent: ROLLING_STEEL_SOP },
];

import { KNOWLEDGE_BOMBS } from '../services/knowledgeBombs';

export default function Edu() {
  const [activeTab, setActiveTab] = React.useState<'training' | 'philosophy'>('training');
  const [selectedTopic, setSelectedTopic] = React.useState<typeof TOPICS[0] | null>(null);
  const [activeBombIdx, setActiveBombIdx] = React.useState(0);

  // Rotate knowledge bombs
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveBombIdx((prev) => (prev + 1) % KNOWLEDGE_BOMBS.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const currentBomb = KNOWLEDGE_BOMBS[activeBombIdx];

  const tabs = [
    { id: 'training', label: 'Technical SOPs', icon: BookOpen },
    { id: 'philosophy', label: 'Field Philosophy', icon: Award },
  ];

  if (selectedTopic && selectedTopic.fullContent) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 pb-20"
      >
        <button 
          onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors p-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Academy</span>
        </button>

        <div className="bg-zinc-900 rounded-[2.5rem] border border-white/5 p-8 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <selectedTopic.icon className="w-40 h-40 text-brand-accent" />
          </div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded bg-brand-accent/20 text-brand-accent text-[8px] font-black uppercase tracking-widest">Formal SOP</span>
              <span className="flex items-center gap-1 text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                <Clock className="w-3 h-3" /> 15 MIN READ
              </span>
            </div>
            
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-tight">
              {selectedTopic.title}
            </h3>
            
            <div className="prose prose-invert max-w-none">
              <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
                {selectedTopic.fullContent.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-black text-white italic uppercase mt-8 border-b border-white/10 pb-2">{line.replace('# ', '')}</h1>;
                  if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-black text-brand-accent uppercase mt-6">{line.replace('## ', '')}</h2>;
                  if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc">{line.replace('- ', '')}</li>;
                  if (line.startsWith('---')) return <hr key={i} className="border-white/5 my-8" />;
                  return <p key={i}>{line}</p>;
                })}
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setSelectedTopic(null)}
          className="w-full py-4 bg-zinc-900 border border-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl active:scale-[0.98] transition-all"
        >
          Finish Reading Lesson
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold tracking-tight text-white uppercase italic tracking-tighter">Field Engineering</h2>
        <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20">
          <GraduationCap className="w-4 h-4 text-brand-accent" />
        </div>
      </div>

      {/* Sub-tabs Navigation - Enhanced Prominence */}
      <div className="p-1.5 bg-zinc-900 border border-white/10 rounded-2xl mx-1 shadow-2xl">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative overflow-hidden",
                activeTab === tab.id 
                  ? "bg-brand-accent text-white shadow-xl shadow-brand-accent/20" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              )}
            >
              <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-white" : "text-zinc-600")} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-white/10 pointer-events-none"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'training' ? (
          <motion.div
            key="training"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
            {/* Academy Overview / Progress */}
            <section className="bg-zinc-900 rounded-[2rem] border border-white/5 p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-3xl" />
              <div className="flex justify-between items-end mb-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em]">Your Progress</span>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Senior Tech Path</h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-brand-accent">68%</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '68%' }}
                    className="h-full bg-brand-accent shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  />
                </div>
                <div className="flex justify-between text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                  <span>Entry Level</span>
                  <span>Master Tech</span>
                </div>
              </div>
            </section>

            {/* Featured Content - Technical Insights */}
            <section className="relative min-h-[16rem] rounded-[2.5rem] overflow-hidden group shadow-2xl border border-white/5 bg-zinc-900">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBombIdx}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 z-0"
                >
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-accent/5 rounded-full blur-[100px]" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-0 left-0 right-0 p-8 z-20 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-brand-accent text-white text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Terminal className="w-3 h-3" /> Technical Insight
                  </span>
                  <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">{currentBomb.category}</span>
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeBombIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    <h4 className="text-2xl font-black text-white italic uppercase leading-none tracking-tighter">
                      {currentBomb.title}
                    </h4>
                    <p className="text-xs font-medium text-zinc-400 leading-relaxed max-w-[90%]">
                      {currentBomb.content}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => setActiveBombIdx((prev) => (prev + 1) % KNOWLEDGE_BOMBS.length)}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-[0.95] transition-all hover:bg-brand-accent hover:text-white"
                  >
                    Next Insight
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all">
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <BookOpen className="w-4 h-4 text-brand-accent" />
                <h3 className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Technical Knowledge</h3>
              </div>
              
              <div className="grid gap-3">
                {TOPICS.map((topic, idx) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => topic.fullContent && setSelectedTopic(topic)}
                    className={cn(
                      "group bg-zinc-900 p-5 rounded-2xl border border-white/5 flex items-start gap-4 hover:border-brand-accent/50 transition-all cursor-pointer shadow-xl active:scale-95",
                      !topic.fullContent && "opacity-80 grayscale-[0.5]"
                    )}
                  >
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-brand-accent/10 transition-colors">
                      <topic.icon className="w-6 h-6 text-zinc-500 group-hover:text-brand-accent transition-all" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-black text-sm text-white">{topic.title}</h5>
                      <p className="text-[10px] text-zinc-500 leading-relaxed font-bold uppercase tracking-tight">
                        {topic.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="philosophy"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-8"
          >
            {/* The 6 Pillars - Refined Horizontal Scroll */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-accent" />
                  <h3 className="text-[10px] uppercase font-black tracking-widest text-zinc-400">The 6 Pillars of the Call</h3>
                </div>
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest underline decoration-brand-accent/30 decoration-2">Full Guide</span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-6 px-2 no-scrollbar">
                {PILLARS_OF_THE_CALL.map((pillar, idx) => (
                  <motion.div 
                    key={pillar.title} 
                    whileTap={{ scale: 0.98 }}
                    className="min-w-[210px] bg-zinc-900 p-6 rounded-[2rem] border border-white/5 shadow-xl space-y-4 relative overflow-hidden active:border-brand-accent/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-brand-accent italic uppercase">Pillar 0{idx + 1}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-accent/20" />
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-black text-base text-white italic leading-none">{pillar.title}</h5>
                      <p className="text-[10px] font-medium text-zinc-500 leading-relaxed italic">{pillar.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Code of Conduct - Integrated Board Style */}
            <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Award className="w-40 h-40 text-brand-accent" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-brand-accent/10 rounded-2xl text-brand-accent">
                    <Award className="w-5 h-5 fill-brand-accent" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Technician Code</h3>
                    <p className="text-[9px] font-bold text-brand-accent uppercase tracking-widest opacity-60">The Garage Up Standard</p>
                  </div>
                </div>
                <div className="grid gap-3">
                  {CODE_OF_CONDUCT.slice(0, 5).map((rule, idx) => (
                    <div key={idx} className="flex gap-4 items-start bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-brand-accent/20 transition-all">
                      <span className="text-[10px] font-black text-brand-accent bg-brand-accent/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0">{idx + 1}</span>
                      <p className="text-xs font-semibold leading-relaxed text-zinc-100">{rule}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-4 rounded-2xl bg-zinc-800 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all text-zinc-400">
                  View All 12 Rules
                </button>
              </div>
            </div>

            {/* Pro Tip Highlight */}
            <div className="bg-brand-accent/5 border-2 border-dashed border-brand-accent/10 rounded-2xl p-6 relative overflow-hidden mx-1">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <GraduationCap className="w-12 h-12 text-brand-accent" />
              </div>
              <div className="relative z-10">
                <h4 className="font-black text-[10px] uppercase tracking-widest mb-2 text-brand-accent italic flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                  Gilly's Pro Tip
                </h4>
                <p className="text-sm italic text-zinc-300 leading-relaxed font-semibold">
                  "Never oil your tracks. Friction is actually needed for the rollers to roll correctly. Use a dry silicone spray instead for the hinges and rollers!"
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
