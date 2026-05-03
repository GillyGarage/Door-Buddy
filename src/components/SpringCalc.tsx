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
  Compass
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  calculateTorsionSprings, 
  CalculationInput, 
  DRUMS, 
  findBestSpringForCycles,
  WIRE_COLORS
} from '../lib/springMath';

export default function SpringCalc() {
  const [subTab, setSubTab] = useState<'menu' | 'engineering'>('menu');
  const [input, setInput] = useState<CalculationInput>({
    doorWidth: 16,
    doorHeight: 7,
    doorWeight: 140,
    liftSystem: 'standard',
    drumType: 'D400-96',
    trackRadius: '12',
    highLiftInches: 0
  });

  const [notes, setNotes] = useState(() => {
    return localStorage.getItem('gilly_spring_notes') || '';
  });

  const [springCount, setSpringCount] = useState(2);
  const [selectedSpring, setSelectedSpring] = useState<any>(null);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    localStorage.setItem('gilly_spring_notes', val);
  };

  const results = useMemo(() => calculateTorsionSprings(input), [input]);
  const ipptPerSpring = results.ippt / springCount;

  const cycleOptions = useMemo(() => [
    { label: '10,000 Cycles', value: 10000, color: 'text-blue-500', bg: 'bg-blue-50/50' },
    { label: '20,000 Cycles', value: 20000, color: 'text-green-500', bg: 'bg-green-50/50' },
    { label: '50,000 Cycles', value: 50000, color: 'text-purple-500', bg: 'bg-purple-50/50' },
  ], []);

  const tierSprings = useMemo(() => {
    return cycleOptions.map(opt => ({
      ...opt,
      spring: findBestSpringForCycles(ipptPerSpring, opt.value, results.torque / springCount, results.turns)
    }));
  }, [ipptPerSpring, results.torque, results.turns, springCount, cycleOptions]);

  const menuItems = [
    { label: 'Spring Conversion', icon: RefreshCw },
    { label: 'Spring Engineering', icon: Settings2, active: true },
    { label: 'Rolling Steel', icon: Menu },
    { label: 'Weight Calculator', icon: Scale },
  ];

  if (subTab === 'menu') {
    return (
      <div className="space-y-6">
         <h2 className="text-2xl font-black px-2 uppercase tracking-tighter italic text-brand-accent">Spring Calculator</h2>
         <div className="grid grid-cols-2 gap-px bg-zinc-800 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
           {menuItems.map((item) => (
             <button
               key={item.label}
               onClick={() => item.active && setSubTab('engineering')}
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

  return (
    <div className="bg-zinc-950 min-h-screen -mx-4 -mt-20 pt-16 transition-all text-zinc-100">
      {/* Header Bar */}
      <div className="bg-zinc-900 py-4 px-6 flex items-center justify-between sticky top-0 z-20 border-b border-white/5 shadow-2xl">
        <button onClick={() => setSubTab('menu')} className="text-white hover:opacity-70 transition-opacity">
          <ChevronLeft className="w-7 h-7" />
        </button>
        <h2 className="font-bold text-white uppercase text-base tracking-tight italic">Engineering Calculator</h2>
        <div className="w-10" />
      </div>

      <div className="bg-[#444] py-2 px-6 flex justify-between items-center border-t border-white/10">
        <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Live Door Analysis</h3>
        <Zap className="w-3 h-3 text-brand-accent animate-pulse" />
      </div>

      <div className="divide-y divide-white/5 bg-zinc-950">
        {/* Lift System Selection */}
        <div className="px-6 py-4 flex items-center justify-between group">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-zinc-500" />
            <label className="text-sm font-medium text-zinc-500 uppercase tracking-tight">Lift System</label>
          </div>
          <select 
            value={input.liftSystem}
            onChange={(e) => setInput({ ...input, liftSystem: e.target.value as any })}
            className="appearance-none bg-transparent outline-none font-black text-sm text-right pr-6 text-white"
          >
            <option value="standard" className="bg-zinc-900">Standard Lift</option>
            <option value="high-lift" className="bg-zinc-900">High Lift</option>
            <option value="vertical-lift" className="bg-zinc-900">Vertical Lift</option>
            <option value="extension" className="bg-zinc-900">Extension</option>
          </select>
          <ChevronDown className="w-4 h-4 -ml-6 pointer-events-none text-zinc-600" />
        </div>

        {/* Pitch Selection (FTR) */}
        {input.liftSystem === 'standard' && (
          <div className="px-6 py-4 flex items-center justify-between group bg-amber-500/5 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-500" />
              <label className="text-sm font-medium text-amber-500 uppercase tracking-tight italic">Roof Pitch (FTR)</label>
            </div>
            <select 
              value={input.pitch || 0}
              onChange={(e) => setInput({ ...input, pitch: Number(e.target.value) })}
              className="appearance-none bg-transparent outline-none font-black text-sm text-right pr-6 text-amber-500"
            >
              <option value={0} className="bg-zinc-900">None (Flat)</option>
              <option value={1} className="bg-zinc-900">1/12 Pitch</option>
              <option value={2} className="bg-zinc-900">2/12 Pitch</option>
              <option value={3} className="bg-zinc-900">3/12 Pitch</option>
              <option value={4} className="bg-zinc-900">4/12 Pitch</option>
            </select>
            <ChevronDown className="w-4 h-4 -ml-6 pointer-events-none text-amber-600" />
          </div>
        )}

        {/* Drum Selection */}
        <div className="px-6 py-4 flex items-center justify-between group">
          <div className="flex items-center gap-2">
            <Disc className="w-4 h-4 text-zinc-500" />
            <label className="text-sm font-medium text-zinc-500 uppercase tracking-tight">Drum Model</label>
          </div>
          <select 
            value={input.drumType}
            onChange={(e) => setInput({ ...input, drumType: e.target.value })}
            className="appearance-none bg-transparent outline-none font-black text-sm text-right pr-6 text-white"
          >
            {Object.keys(DRUMS).map(d => <option key={d} value={d} className="bg-zinc-900">{d}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 -ml-6 pointer-events-none text-zinc-600" />
        </div>

        {/* Drum Technical Info */}
        <AnimatePresence>
          {DRUMS[input.drumType] && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-brand-accent/5 overflow-hidden"
            >
              <div className="px-6 py-3 flex gap-4 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                <div className="flex flex-col">
                  <span>HMA</span>
                  <span className="text-brand-accent">{DRUMS[input.drumType].hma}"</span>
                </div>
                <div className="flex flex-col border-l border-white/10 pl-4">
                  <span>LMA</span>
                  <span className="text-brand-accent">{DRUMS[input.drumType].lma}"</span>
                </div>
                {DRUMS[input.drumType].multiplier && (
                  <div className="flex flex-col border-l border-white/10 pl-4">
                    <span>Multiplier</span>
                    <span className="text-brand-accent">{DRUMS[input.drumType].multiplier}</span>
                  </div>
                )}
                <div className="flex flex-col border-l border-white/10 pl-4">
                  <span>Max Weight</span>
                  <span className="text-zinc-300">{DRUMS[input.drumType].maxWeight} lbs</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Radius */}
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-zinc-500" />
            <label className="text-sm font-medium text-zinc-500 uppercase tracking-tight">Track Radius</label>
          </div>
          <div className="flex bg-zinc-900 rounded-lg p-1 border border-white/5">
            {['12', '15', 'LHR'].map((r) => (
              <button
                key={r}
                onClick={() => setInput({ ...input, trackRadius: r })}
                className={cn(
                  "px-4 h-9 flex items-center justify-center text-[10px] font-black transition-all rounded-md uppercase tracking-tighter",
                  input.trackRadius === r ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Door Stats */}
        <div className="grid grid-cols-2">
          <div className="p-6 border-r border-white/5 space-y-1">
             <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Door Height (FT)</label>
             <input 
               type="number"
               inputMode="decimal"
               value={input.doorHeight}
               onFocus={(e) => e.target.select()}
               onChange={(e) => setInput({ ...input, doorHeight: Number(e.target.value) })}
               className="text-2xl font-black outline-none w-full bg-transparent text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
             />
          </div>
          <div className="p-6 bg-brand-accent/5 space-y-1 group">
             <label className="text-[10px] font-bold text-brand-accent uppercase tracking-widest group-focus-within:animate-pulse">Weight (LBS)</label>
             <input 
               type="number"
               inputMode="decimal"
               value={input.doorWeight}
               onFocus={(e) => e.target.select()}
               onChange={(e) => setInput({ ...input, doorWeight: Number(e.target.value) })}
               className="text-2xl font-black text-brand-accent outline-none w-full bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
             />
          </div>
        </div>

        {/* Spring Setup */}
          <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-zinc-500" />
            <label className="text-sm font-medium text-zinc-500 uppercase tracking-tight">Units</label>
          </div>
          <div className="flex gap-2">
             {[1, 2, 4].map(n => (
               <button 
                 key={n}
                 onClick={() => setSpringCount(n)}
                 className={cn(
                   "w-10 h-10 rounded-full font-black text-xs transition-all border-2",
                   springCount === n ? "bg-brand-accent border-brand-accent text-white scale-110 shadow-xl shadow-brand-accent/20" : "border-white/5 text-zinc-600"
                 )}
               >
                 {n}
               </button>
             ))}
          </div>
        </div>

        <div className="h-4 bg-zinc-900/50" />

        {/* Calculation Table */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
             <h4 className="font-black text-xs uppercase tracking-widest italic text-zinc-600">Calculated Results</h4>
             <span className="text-[9px] font-bold px-2 py-1 bg-brand-accent/10 text-brand-accent rounded uppercase">Precision Match</span>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-8 relative overflow-hidden shadow-2xl border border-white/5">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-accent rounded-full blur-[80px] opacity-10" />
             
             <div className="relative z-10 grid grid-cols-2 gap-8">
                <div className="space-y-1">
                   <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Total IPPT</span>
                   <div className="text-4xl font-black text-brand-accent tracking-tighter tabular-nums italic">
                     {results.ippt.toFixed(1)}
                   </div>
                </div>
                <div className="text-right space-y-1">
                   <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Winding Turns</span>
                   <div className="text-4xl font-black text-white italic">
                     {results.turns?.toFixed(1)}
                   </div>
                </div>
             </div>

             <div className="mt-8 border-t border-white/5 pt-6 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <span className="text-[9px] font-bold text-white/20 uppercase">IPPT / Spring</span>
                   <div className="text-xl font-black text-white">{(results.ippt / springCount).toFixed(2)}</div>
                </div>
                <div className="text-right space-y-1">
                   <span className="text-[9px] font-bold text-white/20 uppercase">Total Torque</span>
                   <div className="text-xl font-black text-white uppercase tracking-tighter leading-none">
                     {results.torque?.toFixed(0)} <span className="text-[10px] opacity-30">in-lb</span>
                   </div>
                </div>
             </div>

             <div className="mt-8 border-t border-white/5 pt-6 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <span className="text-[9px] font-bold text-brand-accent/50 uppercase tracking-widest">Cable Cut</span>
                   <div className="text-xl font-black text-brand-accent italic">
                     {results.cableLength ? `${results.cableLength}"` : '--'}
                   </div>
                </div>
                <div className="text-right space-y-1">
                   <span className="text-[9px] font-bold text-brand-accent/50 uppercase tracking-widest">Growth Factor</span>
                   <div className="text-xl font-black text-brand-accent italic tabular-nums">
                     {results.springGrowth ? `+${results.springGrowth.toFixed(2)}"` : 'TBD'}
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Suggested Springs Section (Cycle Tiers) */}
        <div className="p-6 bg-zinc-900/30 space-y-6 text-zinc-100">
          <div className="flex items-center justify-between">
             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Technician Notes</label>
             <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-600 uppercase">
               Field Observations
             </div>
          </div>
          <div className="relative">
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Record specific measurements, site conditions, or special bracket needs..."
              className="w-full h-32 bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-sm font-medium outline-none focus:border-brand-accent/50 transition-colors placeholder:text-zinc-700 resize-none"
            />
            <div className="absolute bottom-3 right-4 flex items-center gap-2 opacity-30 pointer-events-none">
              <span className="text-[8px] font-bold uppercase tracking-widest leading-none">Auto-Saving</span>
              <Sparkles className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>

        {/* Suggested Springs Section (Cycle Tiers) */}
        <div className="p-6 bg-zinc-900/30 space-y-6">
          <div className="flex items-center justify-between">
             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Precision Selection Tiers</label>
             <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-600 uppercase">
               DASMA Standard
             </div>
          </div>
          
          <div className="space-y-4">
             {tierSprings.map((tier, idx) => (
                <div key={tier.label} className={cn("rounded-3xl p-5 border transition-all relative overflow-hidden bg-zinc-900", tier.spring ? "border-white/5 shadow-xl" : "border-dashed border-white/5 opacity-50")}>
                   <div className="flex justify-between items-start mb-4">
                      <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-zinc-800 border border-white/5 shadow-sm", tier.color)}>
                        {tier.label}
                      </span>
                      {tier.spring && (
                         <div className="flex items-center gap-1.5">
                           <div className="px-2 py-0.5 rounded bg-brand-accent text-white text-[8px] font-black uppercase tracking-tighter shadow-xl">Best Value</div>
                         </div>
                      )}
                   </div>

                   {tier.spring ? (
                      <div className="grid grid-cols-[1fr_auto] items-end gap-4">
                         <div className="space-y-2">
                            <div className="flex items-center gap-2">
                               <div 
                                 className="w-4 h-4 rounded-full border border-white/20 shadow-sm shadow-black/50" 
                                 style={{ backgroundColor: WIRE_COLORS[tier.spring.wire] || '#ccc' }} 
                               />
                               <span className="text-xl font-black italic text-white">{tier.spring.wire}" x {tier.spring.id}"</span>
                            </div>
                            <div className="flex gap-4">
                               <div className="space-y-0.5">
                                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">Length</span>
                                  <div className="text-sm font-black text-white">{tier.spring.length}"</div>
                               </div>
                               <div className="space-y-0.5 text-right">
                                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter text-right block">Weight</span>
                                  <div className="text-sm font-black italic text-white">{tier.spring.weight} <span className="text-[10px] opacity-40">LBS</span></div>
                               </div>
                               <div className="space-y-0.5 text-right border-l border-white/5 pl-4">
                                  <span className="text-[8px] font-bold text-brand-accent uppercase tracking-tighter text-right block">Growth</span>
                                  <div className="text-sm font-black italic text-brand-accent">+{tier.spring.growth}"</div>
                               </div>
                            </div>
                         </div>
                         <button 
                           onClick={() => setSelectedSpring(tier.spring)}
                           className={cn(
                             "w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-zinc-800 border border-white/5 shadow-xl active:scale-95",
                              selectedSpring === tier.spring ? "bg-brand-accent text-white shadow-xl shadow-brand-accent/30" : "text-zinc-600"
                           )}
                         >
                           <Zap className={cn("w-5 h-5", selectedSpring === tier.spring ? "fill-brand-accent" : "fill-none")} />
                         </button>
                      </div>
                   ) : (
                      <div className="py-4 text-center">
                         <span className="text-xs font-bold text-zinc-600 italic">No standard matches</span>
                      </div>
                   )}
                </div>
             ))}
          </div>
        </div>

        {/* Clear Button */}
        <div className="p-6 bg-zinc-950 pb-32">
           <button 
             onClick={() => setSubTab('menu')}
             className="w-full py-5 bg-zinc-900 border border-white/5 text-white font-black uppercase rounded-2xl shadow-2xl active:scale-[0.98] transition-transform flex items-center justify-center gap-3"
           >
             <RefreshCw className="w-4 h-4 text-brand-accent" />
             Reset Calculation
           </button>
        </div>
      </div>
    </div>
  );
}
