import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRightLeft, 
  AlertTriangle,
  Settings2,
  RefreshCw,
  Zap,
  ChevronLeft, 
  Ruler, 
  Disc, 
  Menu, 
  Scale,
  Sparkles,
  Info,
  ChevronDown,
  Wrench,
  Compass,
  Plus,
  Minus,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  calculateTorsionSprings, 
  CalculationInput, 
  DRUMS, 
  findBestSpringForCycles,
  getUpcycleOptions,
  WIRE_COLORS,
  calculatePhysicalIppt,
  calculateSpringMetrics,
  WIRE_DIAMETERS,
  INNER_DIAMETERS
} from '../lib/springMath';

export default function SpringCalc() {
  const [subTab, setSubTab] = useState<'menu' | 'engineering' | 'conversion'>('menu');
  const [input, setInput] = useState<CalculationInput & { assembly: string, cycles: number, doorWidthFt: number, doorWidthIn: number, doorHeightFt: number, doorHeightIn: number, targetId: number }>({
    doorWidth: 16,
    doorWidthFt: 16,
    doorWidthIn: 0,
    doorHeight: 7,
    doorHeightFt: 7,
    doorHeightIn: 0,
    doorWeight: 140,
    liftSystem: 'standard',
    drumType: '400-8 (Std)',
    trackRadius: '12',
    highLiftInches: 0,
    assembly: 'Single',
    cycles: 10000,
    pitch: 0,
    targetId: 2.0
  });

  const [notes, setNotes] = useState(() => {
    return localStorage.getItem('gilly_spring_notes') || '';
  });

  const [springCount, setSpringCount] = useState(2);
  
  // New unified conversion state
  const [setupCurrent, setSetupCurrent] = useState({ count: 1, wire: 0.218, id: 2.0, length: 25 });
  const [setupReplace, setSetupReplace] = useState({ count: 1, wire: 0.218, id: 2.0, length: 25 });
  const [isMismatched, setIsMismatched] = useState(false);
  const [selectedSpring, setSelectedSpring] = useState<any>(null);

  const metricsCurrent = useMemo(() => 
    calculateSpringMetrics(setupCurrent.wire, setupCurrent.id, setupCurrent.length, setupCurrent.count),
    [setupCurrent]
  );

  const metricsReplace = useMemo(() => 
    calculateSpringMetrics(setupReplace.wire, setupReplace.id, setupReplace.length, setupReplace.count),
    [setupReplace]
  );

  // Sync decimal dimensions whenever ft/in change
  React.useEffect(() => {
    setInput(prev => ({
      ...prev,
      doorWidth: prev.doorWidthFt + (prev.doorWidthIn / 12),
      doorHeight: prev.doorHeightFt + (prev.doorHeightIn / 12)
    }));
  }, [input.doorWidthFt, input.doorWidthIn, input.doorHeightFt, input.doorHeightIn]);

  const filteredDrums = useMemo(() => {
    return Object.entries(DRUMS).filter(([_, drum]) => {
      if (input.liftSystem === 'high-lift') return drum.isHighLift;
      if (input.liftSystem === 'vertical-lift') return drum.isVerticalLift;
      return !drum.isHighLift && !drum.isVerticalLift;
    });
  }, [input.liftSystem]);

  const isSetupComplete = useMemo(() => {
    return input.drumType !== '' && input.doorWeight > 0;
  }, [input.drumType, input.doorWeight]);

  const results = useMemo(() => calculateTorsionSprings(input), [input]);
  const ipptPerSpring = results.ippt / springCount;

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    localStorage.setItem('gilly_spring_notes', val);
  };

  const activeBaselineIppt = useMemo(() => {
    if (subTab === 'conversion') return metricsCurrent.totalIppt;
    return results.ippt;
  }, [subTab, metricsCurrent.totalIppt, results.ippt]);

  const upcycleOptions = useMemo(() => {
    if (!isSetupComplete) return [];
    return getUpcycleOptions(ipptPerSpring, results.torque / springCount, results.turns);
  }, [isSetupComplete, ipptPerSpring, results.torque, results.turns, springCount]);

  const bestOption = useMemo(() => {
    if (!upcycleOptions.length) return null;
    
    // Pick the best match for user's selected target cycles
    const match = upcycleOptions.find(o => o.cycles >= input.cycles);
    return match || upcycleOptions[upcycleOptions.length - 1];
  }, [upcycleOptions, input.cycles]);

  const SimpleResultTable = ({ option, turns }: { option: any, turns: number }) => {
    if (!option) return null;
    const isLowCycle = option.cycles < 10000;
    
    return (
      <div className={cn(
        "bg-zinc-900/50 rounded-[32px] border overflow-hidden shadow-2xl transition-all",
        isLowCycle ? "border-red-500/50" : "border-white/5"
      )}>
        <div className="grid grid-cols-3 bg-zinc-900 border-b border-white/5 px-6 py-4">
          <div className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Spring Spec</div>
          <div className="text-[9px] font-black uppercase tracking-widest text-zinc-500 text-center">Cycle Life</div>
          <div className="text-[9px] font-black uppercase tracking-widest text-zinc-500 text-right">Turns Req.</div>
        </div>
        <div className={cn(
          "px-6 py-6 items-center grid grid-cols-3",
          isLowCycle ? "bg-red-500/5" : "bg-brand-accent/[0.03]"
        )}>
          <div className="text-sm font-black text-zinc-300 italic">
            {option.wire}" x {option.id}" x {option.length}"
          </div>
          <div className="text-center">
            <div className={cn(
              "text-sm font-black italic",
              isLowCycle ? "text-red-500" : "text-white"
            )}>
              {option.cycles.toLocaleString()}
            </div>
            <div className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest">Est. Cycles</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-black text-brand-accent italic">{turns.toFixed(1)}</div>
            <div className="text-[7px] font-bold text-zinc-500 uppercase tracking-widest">Full Turns</div>
          </div>
        </div>
        <div className={cn(
          "px-6 py-3 border-t border-white/5",
          isLowCycle ? "bg-red-500/20" : "bg-brand-accent/10"
        )}>
           <p className={cn(
             "text-[8px] font-black uppercase tracking-widest italic text-center animate-pulse",
             isLowCycle ? "text-red-500" : "text-brand-accent"
           )}>
             {isLowCycle 
               ? "Warning: Under 10k Cycles - Do Not Install" 
               : `Professional Engineering Match for ${option.cycles.toLocaleString()} cycles`
             }
           </p>
        </div>
      </div>
    );
  };

  const menuItems = [
    { id: 'conversion', label: 'SPRING CONVERSION', icon: RefreshCw, active: true },
    { id: 'engineering', label: 'Spring Engineering', icon: Settings2, active: true },
    { id: 'rolling', label: 'Rolling Steel', icon: Menu },
    { id: 'weight', label: 'Weight Calculator', icon: Scale },
  ];

  if (subTab === 'menu') {
    return (
      <div className="space-y-6">
         <h2 className="text-2xl font-black px-2 uppercase tracking-tighter italic text-brand-accent">Spring Calculator</h2>
         <div className="grid grid-cols-2 gap-px bg-zinc-800 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
           {menuItems.map((item) => (
             <button
               key={item.label}
                onClick={() => {
                  if (item.active) {
                    if (item.id === 'engineering') {
                      setInput({
                        doorWidth: 16,
                        doorWidthFt: 16,
                        doorWidthIn: 0,
                        doorHeight: 7,
                        doorHeightFt: 7,
                        doorHeightIn: 0,
                        doorWeight: 140,
                        liftSystem: 'standard',
                        drumType: '400-8 (Std)',
                        trackRadius: '12',
                        highLiftInches: 0,
                        assembly: 'Single',
                        cycles: 10000,
                        pitch: 0,
                        targetId: 2.0
                      });
                      setSpringCount(2);
                    }
                    setSubTab(item.id as any);
                  }
                }}
               className={cn(
                 "flex flex-col items-center justify-center aspect-square p-6 transition-all active:scale-[0.95] group",
                 item.active ? "bg-brand-accent text-white shadow-xl shadow-brand-accent/20" : "bg-zinc-900 text-zinc-500 hover:text-brand-accent"
               )}
             >
               <item.icon className={cn("w-14 h-14 mb-4 stroke-[1px] transition-transform group-hover:scale-110", item.active ? "text-white" : "text-brand-accent")} />
               <span className="text-[10px] font-black uppercase tracking-widest text-center px-2">{item.label}</span>
             </button>
          ))}
        </div>
      </div>
    );
  }

  if (subTab === 'conversion') {
    return (
      <div className="bg-zinc-950 min-h-screen -mx-4 -mt-20 pt-16 transition-all text-zinc-100 pb-32">
        <div className="bg-zinc-900 py-4 px-6 flex items-center justify-between sticky top-0 z-20 border-b border-white/5 shadow-2xl">
          <button onClick={() => setSubTab('menu')} className="text-white hover:opacity-70 transition-opacity">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <h2 className="font-bold text-white uppercase text-base tracking-tight italic">Spring Conversion</h2>
          <div className="w-10" />
        </div>

        <div className="space-y-4">
          {/* CURRENT SETUP */}
          <div className="bg-zinc-900/50">
             <div className="bg-zinc-900 px-6 py-3 flex items-center justify-between border-y border-white/5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Current Setup</span>
                <div className="flex items-center gap-2">
                   <span className="text-[9px] font-bold text-zinc-600 uppercase">Mismatched</span>
                   <div className="flex bg-zinc-950 border border-white/5 rounded-lg p-0.5">
                      <button 
                        onClick={() => setIsMismatched(false)}
                        className={cn(
                          "px-3 py-1 text-[8px] font-black uppercase rounded transition-all",
                          !isMismatched ? "bg-brand-accent text-white" : "text-zinc-500"
                        )}
                      >
                        No
                      </button>
                      <button 
                        onClick={() => setIsMismatched(true)}
                        className={cn(
                          "px-3 py-1 text-[8px] font-black uppercase rounded transition-all",
                          isMismatched ? "bg-brand-accent text-white" : "text-zinc-500"
                        )}
                      >
                        Yes
                      </button>
                   </div>
                </div>
             </div>

             <div className="divide-y divide-white/5">
                <div className="px-6 py-4 flex items-center justify-between">
                   <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Springs</span>
                   <div className="flex gap-1">
                      {[1, 2, 3, 4].map(n => (
                         <button 
                           key={n}
                           onClick={() => setSetupCurrent({...setupCurrent, count: n})}
                           className={cn(
                             "w-8 h-8 rounded-lg font-black text-xs transition-all",
                             setupCurrent.count === n ? "bg-brand-accent text-white shadow-lg" : "bg-zinc-900/50 text-zinc-600"
                           )}
                         >
                           {n}
                         </button>
                      ))}
                   </div>
                </div>
                
                <div className="px-6 py-4 flex items-center justify-between">
                   <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Spring ID (in)</span>
                   <select 
                      value={setupCurrent.id}
                      onChange={(e) => setSetupCurrent({...setupCurrent, id: Number(e.target.value)})}
                      className="bg-transparent text-sm font-black text-white outline-none appearance-none pr-4 text-right"
                   >
                      {INNER_DIAMETERS.map(id => <option key={id} value={id} className="bg-zinc-900">{id.toFixed(3)}"</option>)}
                   </select>
                </div>

                <div className="px-6 py-4 flex items-center justify-between">
                   <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Wire Size (in)</span>
                   <select 
                      value={setupCurrent.wire}
                      onChange={(e) => setSetupCurrent({...setupCurrent, wire: Number(e.target.value)})}
                      className="bg-transparent text-sm font-black text-white outline-none appearance-none pr-4 text-right"
                   >
                      {WIRE_DIAMETERS.map(wire => <option key={wire} value={wire} className="bg-zinc-900">{wire.toFixed(3)}"</option>)}
                   </select>
                </div>

                <div className="px-6 py-4 flex items-center justify-between">
                   <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Spring Length (in)</span>
                   <input 
                      type="number"
                      value={setupCurrent.length}
                      onChange={(e) => setSetupCurrent({...setupCurrent, length: Number(e.target.value)})}
                      className="bg-transparent text-sm font-black text-white outline-none text-right w-20"
                   />
                </div>
             </div>

             {/* Metrics Grid Current */}
             <div className="grid grid-cols-2 gap-px bg-white/5 border-t border-white/5">
                <MetricBox label="Max Turns" value={metricsCurrent.maxTurns.toFixed(2)} color="text-green-500" />
                <MetricBox label="IPPT" value={metricsCurrent.ippt.toFixed(2)} color="text-green-500" />
                <MetricBox label="Active Coils" value={metricsCurrent.activeCoils.toFixed(0)} color="text-green-500" />
                <MetricBox label="Total Coils" value={metricsCurrent.totalCoils.toFixed(0)} color="text-green-500" />
                <MetricBox label="Weight" value={metricsCurrent.weight.toFixed(1) + ' lbs'} color="text-green-500" />
                <MetricBox label="Cycles" value={metricsCurrent.cycles.toLocaleString()} color="text-green-500" />
             </div>
          </div>

          {/* REPLACEMENT SETUP */}
          <div className="bg-zinc-900/50">
             <div className="bg-brand-accent p-1 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Replacement Setup</span>
             </div>

             <div className="divide-y divide-white/5">
                <div className="px-6 py-4 flex items-center justify-between">
                   <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Springs</span>
                   <div className="flex gap-1">
                      {[1, 2, 3, 4].map(n => (
                         <button 
                           key={n}
                           onClick={() => setSetupReplace({...setupReplace, count: n})}
                           className={cn(
                             "w-8 h-8 rounded-lg font-black text-xs transition-all",
                             setupReplace.count === n ? "bg-brand-accent text-white shadow-lg" : "bg-zinc-900/50 text-zinc-600"
                           )}
                         >
                           {n}
                         </button>
                      ))}
                   </div>
                </div>

                <div className="px-6 py-4 flex items-center justify-between">
                   <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Spring ID (in)</span>
                   <select 
                      value={setupReplace.id}
                      onChange={(e) => setSetupReplace({...setupReplace, id: Number(e.target.value)})}
                      className="bg-transparent text-sm font-black text-white outline-none appearance-none pr-4 text-right"
                   >
                      {INNER_DIAMETERS.map(id => <option key={id} value={id} className="bg-zinc-900">{id.toFixed(3)}"</option>)}
                   </select>
                </div>

                <div className="px-6 py-4 flex items-center justify-between">
                   <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Wire Size (in)</span>
                   <div className="flex items-center gap-4">
                      <button 
                        onClick={() => {
                           const idx = WIRE_DIAMETERS.indexOf(setupReplace.wire);
                           if (idx > 0) setSetupReplace({...setupReplace, wire: WIRE_DIAMETERS[idx - 1]});
                        }}
                        className="bg-brand-accent p-2 rounded-lg hover:opacity-80 active:scale-95 transition-all text-white shadow-lg shadow-brand-accent/20"
                      >
                         <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-black text-white w-16 text-center tabular-nums">{setupReplace.wire.toFixed(3)}"</span>
                      <button 
                        onClick={() => {
                           const idx = WIRE_DIAMETERS.indexOf(setupReplace.wire);
                           if (idx < WIRE_DIAMETERS.length - 1) setSetupReplace({...setupReplace, wire: WIRE_DIAMETERS[idx + 1]});
                        }}
                        className="bg-brand-accent p-2 rounded-lg hover:opacity-80 active:scale-95 transition-all text-white shadow-lg shadow-brand-accent/20"
                      >
                         <Plus className="w-3.5 h-3.5" />
                      </button>
                   </div>
                </div>

                <div className="px-6 py-4 flex items-center justify-between group">
                   <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Spring Length</span>
                   <div className="flex flex-col items-end">
                      <span className="text-sm font-black text-green-500 animate-pulse">
                         {((metricsCurrent.totalIppt) / (setupReplace.count * calculatePhysicalIppt(setupReplace.wire, setupReplace.id, 1))).toFixed(2)}"
                      </span>
                      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">Calculated Fit</span>
                   </div>
                </div>
             </div>

             {/* Metrics Grid Replace */}
             <div className="grid grid-cols-2 gap-px bg-white/5 border-t border-white/5">
                <MetricBox label="Max Turns" value={metricsReplace.maxTurns.toFixed(2)} color="text-green-500" />
                <MetricBox label="IPPT" value={metricsReplace.ippt.toFixed(2)} color="text-green-500" />
                <MetricBox label="Active Coils" value={metricsReplace.activeCoils.toFixed(0)} color="text-green-500" />
                <MetricBox label="Total Coils" value={metricsReplace.totalCoils.toFixed(0)} color="text-green-500" />
                <MetricBox label="Weight" value={metricsReplace.weight.toFixed(1) + ' lbs'} color="text-green-500" />
                <MetricBox label="Cycles" value={metricsReplace.cycles.toLocaleString()} color="text-green-500" />
             </div>
          </div>

          {/* DNA Section (Moved to Bottom) */}
          <div className="px-6 space-y-4">
             <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex items-center justify-between opacity-50">
                <div className="flex items-center gap-3">
                   <Zap className="w-4 h-4 text-brand-accent" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Baseline DNA: {activeBaselineIppt.toFixed(2)} IPPT</span>
                </div>
                <Info className="w-4 h-4 text-zinc-700" />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <button className="py-4 bg-zinc-900 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white rounded-2xl active:scale-95 transition-all">
                   Min Door Width
                </button>
                <button 
                  onClick={() => {
                    setSetupCurrent({ count: 1, wire: 0.218, id: 2.0, length: 25 });
                    setSetupReplace({ count: 1, wire: 0.218, id: 2.0, length: 25 });
                  }}
                  className="py-4 bg-zinc-900 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white rounded-2xl active:scale-95 transition-all"
                >
                   Clear
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

function MetricBox({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="bg-zinc-900 px-6 py-4 flex items-center justify-between">
      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tight">{label}</span>
      <span className={cn("text-xs font-black italic", color)}>{value}</span>
    </div>
  );
}

  return (
    <div className="bg-zinc-950 min-h-screen -mx-4 -mt-20 pt-16 transition-all text-zinc-100 pb-32">
      {/* Header Bar */}
      <div className="bg-zinc-900 py-4 px-6 flex items-center justify-between sticky top-0 z-20 border-b border-white/5 shadow-2xl">
        <button onClick={() => setSubTab('menu')} className="text-white hover:opacity-70 transition-opacity">
          <ChevronLeft className="w-7 h-7" />
        </button>
        <h2 className="font-bold text-white uppercase text-base tracking-tight italic">Spring Engineering</h2>
        <div className="w-10" />
      </div>

      <div className="bg-zinc-900/50">
        {/* CURRENT SETUP HEADER */}
        <div className="bg-zinc-900 px-6 py-3 border-y border-white/5">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Current Setup</span>
        </div>

        <div className="divide-y divide-white/5 bg-zinc-950">
          {/* Assembly */}
          <div className="px-6 py-4 flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Assembly</label>
            <select 
              value={input.assembly}
              onChange={(e) => setInput({...input, assembly: e.target.value})}
              className="bg-transparent text-sm font-black text-white outline-none appearance-none pr-4 text-right"
            >
               <option value="Single" className="bg-zinc-900">Single</option>
               <option value="Duplex" className="bg-zinc-900">Duplex</option>
               <option value="Triplex" className="bg-zinc-900">Triplex</option>
            </select>
          </div>

          {/* Springs Segmented */}
          <div className="px-6 py-4 flex items-center justify-between">
             <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Springs</span>
             <div className="flex gap-1">
                {[1, 2, 3, 4].map(n => (
                   <button 
                     key={n}
                     onClick={() => setSpringCount(n)}
                     className={cn(
                       "w-8 h-8 rounded-lg font-black text-xs transition-all",
                       springCount === n ? "bg-brand-accent text-white shadow-lg" : "bg-zinc-900/50 text-zinc-600"
                     )}
                   >
                     {n}
                   </button>
                ))}
             </div>
          </div>

          {/* Spring ID */}
          <div className="px-6 py-4 flex items-center justify-between">
             <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Spring ID</span>
             <select 
                value={input.targetId}
                onChange={(e) => setInput({...input, targetId: Number(e.target.value)})}
                className="bg-transparent text-sm font-black text-white outline-none appearance-none pr-4 text-right"
             >
                {INNER_DIAMETERS.map(id => <option key={id} value={id} className="bg-zinc-900">{id.toFixed(3)}"</option>)}
             </select>
          </div>

          {/* Cycles */}
          <div className="px-6 py-4 flex items-center justify-between">
             <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Cycles</span>
             <select 
                value={input.cycles}
                onChange={(e) => setInput({...input, cycles: Number(e.target.value)})}
                className="bg-transparent text-sm font-black text-white outline-none appearance-none pr-4 text-right"
             >
                {[10000, 15000, 20000, 25000, 30000, 50000].map(c => (
                  <option key={c} value={c} className="bg-zinc-900">{c.toLocaleString()}</option>
                ))}
             </select>
          </div>
        </div>

        {/* Gray Spacer */}
        <div className="h-4 bg-zinc-900/50" />

        <div className="divide-y divide-white/5 bg-zinc-950">
          {/* Lift Type */}
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Lift Type</span>
            <select 
              value={input.liftSystem}
              onChange={(e) => setInput({ ...input, liftSystem: e.target.value as any })}
              className="appearance-none bg-transparent outline-none font-black text-sm text-right pr-4 text-white"
            >
              <option value="standard" className="bg-zinc-900">Standard</option>
              <option value="high-lift" className="bg-zinc-900">High Lift</option>
              <option value="vertical-lift" className="bg-zinc-900">Vertical Lift</option>
            </select>
          </div>

          {/* Radius Segmented */}
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Radius</span>
            <div className="flex flex-wrap justify-end gap-1 max-w-[200px]">
              {['15', '12', '20', '32', 'LHR'].map((r) => (
                <button
                  key={r}
                  onClick={() => setInput({ ...input, trackRadius: r })}
                  className={cn(
                    "px-3 h-8 flex items-center justify-center text-[10px] font-black transition-all rounded-lg uppercase tracking-tighter",
                    input.trackRadius === r ? "bg-brand-accent text-white shadow-lg" : "bg-zinc-900 text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Drum Selection */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
               <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Drum</span>
               <Info className="w-3 h-3 text-zinc-700" />
            </div>
            <select 
              value={input.drumType}
              onChange={(e) => setInput({ ...input, drumType: e.target.value })}
              className={cn(
                "appearance-none bg-transparent outline-none font-black text-sm text-right pr-4",
                input.drumType ? "text-white" : "text-red-500 underline"
              )}
            >
              <option value="" className="bg-zinc-900 italic">Select a Drum</option>
              {filteredDrums.map(([d]) => <option key={d} value={d} className="bg-zinc-900">{d}</option>)}
            </select>
          </div>

          {/* Door Width Ft/In */}
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Door Width (in)</span>
            <div className="flex items-center gap-2">
               <select 
                 value={input.doorWidthFt} 
                 onChange={(e) => setInput({...input, doorWidthFt: Number(e.target.value)})}
                 className="bg-transparent text-sm font-black text-white outline-none"
               >
                  {[...Array(31)].map((_, i) => <option key={i} value={i} className="bg-zinc-900">{i}'</option>)}
               </select>
               <select 
                 value={input.doorWidthIn} 
                 onChange={(e) => setInput({...input, doorWidthIn: Number(e.target.value)})}
                 className="bg-transparent text-sm font-black text-white outline-none"
               >
                  {[0, 2, 4, 6, 8, 10].map(i => <option key={i} value={i} className="bg-zinc-900">{i}"</option>)}
               </select>
            </div>
          </div>

          {/* Door Height Ft/In */}
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Door Height (in)</span>
            <div className="flex items-center gap-2">
               <select 
                 value={input.doorHeightFt} 
                 onChange={(e) => setInput({...input, doorHeightFt: Number(e.target.value)})}
                 className="bg-transparent text-sm font-black text-white outline-none"
               >
                  {[...Array(31)].map((_, i) => <option key={i} value={i} className="bg-zinc-900">{i}'</option>)}
               </select>
               <select 
                 value={input.doorHeightIn} 
                 onChange={(e) => setInput({...input, doorHeightIn: Number(e.target.value)})}
                 className="bg-transparent text-sm font-black text-white outline-none"
               >
                  {[0, 2, 4, 6, 8, 10].map(i => <option key={i} value={i} className="bg-zinc-900">{i}"</option>)}
               </select>
            </div>
          </div>

          {/* Weight */}
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Weight (lb)</span>
            <input 
              type="number"
              inputMode="decimal"
              value={input.doorWeight}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setInput({ ...input, doorWeight: Number(e.target.value) })}
              className="bg-transparent text-sm font-black text-white outline-none text-right w-20"
            />
          </div>

          {/* Pitch Section */}
          <div className="divide-y divide-white/5">
            <div className="px-6 py-4 flex items-center justify-between">
               <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Roof Pitch</span>
                  <Info className="w-3 h-3 text-zinc-700" />
               </div>
               <div className="flex bg-zinc-950 border border-white/5 rounded-lg p-0.5">
                  <button 
                    onClick={() => setInput({...input, pitch: 0})}
                    className={cn(
                      "px-4 py-1 text-[8px] font-black uppercase rounded transition-all",
                      (input.pitch === 0) ? "bg-brand-accent text-white" : "text-zinc-500"
                    )}
                  >
                    No
                  </button>
                  <button 
                    onClick={() => setInput({...input, pitch: input.pitch || 1})}
                    className={cn(
                      "px-4 py-1 text-[8px] font-black uppercase rounded transition-all",
                      (input.pitch !== 0) ? "bg-brand-accent text-white" : "text-zinc-500"
                    )}
                  >
                    Yes
                  </button>
               </div>
            </div>
            
            <AnimatePresence>
              {input.pitch !== 0 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 py-4 bg-zinc-900/40 overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Pitch Gradient</span>
                    <span className="text-sm font-black text-brand-accent italic">{input.pitch || 0}/12</span>
                  </div>
                  <input 
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    value={input.pitch || 1}
                    onChange={(e) => setInput({...input, pitch: Number(e.target.value)})}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-accent mb-2"
                  />
                  <div className="flex justify-between text-[8px] font-bold text-zinc-600 uppercase">
                    <span>1/12</span>
                    <span>12/12</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Results at Bottom Moved to Recommendations */}

        {isSetupComplete && (
          <div className="p-6 space-y-6">
             {/* Unified suggest results */}
             <div className="space-y-6">
                 <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Engineering Recommendation</span>
                  <span className="text-[8px] font-bold px-2 py-1 bg-brand-accent/10 text-brand-accent rounded uppercase italic">Precision Match</span>
                </div>
                
                <SimpleResultTable option={bestOption} turns={results.turns} />
                
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-red-500 text-center italic">
                    Policy: If a spring cycle life is under 10k, do not put that spring on a customers door.
                  </p>
                </div>
             </div>

             <button 
               onClick={() => {
                 setInput(prev => ({ ...prev, drumType: '', doorWeight: 0 }));
               }}
               className="w-full py-5 bg-zinc-900 border border-white/5 text-white font-black uppercase rounded-2xl shadow-2xl active:scale-[0.98] transition-transform flex items-center justify-center gap-3 mt-4"
             >
               <RefreshCw className="w-4 h-4 text-brand-accent" />
               Reset Search
             </button>
          </div>
        )}

        {!isSetupComplete && (
          <div className="p-12 text-center space-y-4 opacity-40">
             <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 mx-auto flex items-center justify-center">
                <Settings2 className="w-8 h-8 text-zinc-700" />
             </div>
             <p className="text-sm font-black uppercase tracking-widest text-zinc-600 italic">Complete current setup<br/>to view analysis</p>
          </div>
        )}
      </div>
    </div>
  );
}
