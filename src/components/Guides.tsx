import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Map, 
  Settings, 
  ShieldAlert, 
  FileText, 
  ExternalLink,
  Hammer,
  Users,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from './FirebaseProvider';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const CATEGORIES = [
  { id: 'internal', label: 'Field Manuals', icon: FileText },
  { id: 'residential', label: 'Res. Openers', icon: Settings },
  { id: 'commercial', label: 'Comm. Operators', icon: ShieldAlert },
  { id: 'sectional', label: 'Sectional Doors', icon: Map },
  { id: 'resources', label: 'Pro Resources', icon: ExternalLink },
  { id: 'admin', label: 'User Admin', icon: Users, adminOnly: true, badge: true },
];

interface Profile {
  uid: string;
  email: string;
  displayName: string;
  status: 'pending' | 'approved' | 'revoked';
  createdAt: any;
}

const GUIDES = [
  { id: 'ru-1', title: 'Clopay Roll-Up Installation', cat: 'commercial', duration: '15 min', items: 7, url: 'https://literature.clopay.com/pdf_files/INST-0130007_EN.pdf' },
  { id: 'ru-2', title: 'Ideal Door Roll-Up Guide', cat: 'commercial', duration: '12 min', items: 6, url: 'https://www.idealdoorgaragedoors.com/help/roll-up-door-installation/' },
  { id: 'ru-v1', title: 'Roll-Up Install Video (Part 1)', cat: 'resources', duration: '8 min', items: 1, url: 'https://vimeo.com/68472146' },
  { id: 'ru-v2', title: 'Roll-Up Install Video (Part 2)', cat: 'resources', duration: '10 min', items: 1, url: 'https://vimeo.com/68472276' },
  { id: 'hl-1', title: 'HomeLink Programming SOP', cat: 'resources', duration: '5 min', items: 5 },
  { id: 'rhx-1', title: 'RHX Commercial Manual', cat: 'commercial', duration: '20 min', items: 12, url: 'https://overheaddoorcolumbia.com/manuals/commercial/OM-RHX-SECT-Trolley.pdf' },
  { id: 'rmx-1', title: 'RMX Technical Service', cat: 'commercial', duration: '15 min', items: 10, url: 'https://overheaddoorcolumbia.com/manuals/commercial/OM-RMX-RS-JackshaftHoist.pdf' },
  { id: 'clopay-1', title: 'Clopay Residential Support', cat: 'sectional', duration: '10 min', items: 5, url: 'https://www.clopaydoor.com/residential/support' },
  { id: 'clopay-v1', title: 'Canyon Ridge Staining Guide', cat: 'resources', duration: '12 min', items: 1, url: 'https://www.clopaydoor.com/residential/support#videos' },
  { id: 'clopay-v2', title: 'Sectional Install Visuals', cat: 'sectional', duration: '25 min', items: 8, url: 'https://www.clopaydoor.com/residential/support#installation-introduction-a' },
  { id: 'lhr-1', title: 'Low Headroom Instructions', cat: 'sectional', duration: '10 min', items: 5, url: 'https://support.idealdoorgaragedoors.com/support/solutions/articles/67000513785-low-headroom-instructions' },
  { id: 'hl-man-1', title: 'High-Lift Installation Guide', cat: 'technical', duration: '15 min', items: 8, url: 'https://www.doorson-line.com/assets/downloads/manuals_support/TrackandSpringManuals/High-Lift-Instructions-2015.pdf' },
  { id: 'cl-hw-1', title: 'Clopay Hardware Specialty', cat: 'resources', duration: '15 min', items: 7 },
  { id: 'cl-glass-1', title: 'Residential Glass Replacement', cat: 'sectional', duration: '8 min', items: 5 },
  { id: 'cl-meas-1', title: 'Field Measurement Guide', cat: 'resources', duration: '5 min', items: 5 },
  { id: 'amarr-1', title: 'Amarr Aluminum Installation', cat: 'sectional', duration: '15 min', items: 6, url: 'https://sites.myamarr.biz/content/dam/amarr/com/us/en/documents/residential/instructions/aluminium-garage-doors/aluminum-door-%E2%80%93-residential-installation-instructions/Residential%20Aluminum%20Garage%20Door%20Installation%20Instructions.pdf' },
  { id: 'fk-1', title: 'FireKing Rolling Fire Doors', cat: 'commercial', duration: '20 min', items: 6, url: 'https://overheaddoorcolumbia.com/pdf/OM-Rolling-630-631-634-635-facemount-firekingRHX.pdf' },
  { id: 'spr-101', title: 'Springs 101 Field Guide', cat: 'resources', duration: '12 min', items: 10, url: 'https://shopactiondirect.com/content/manuals/Springs%20101%20Guide.pdf' },
  { id: 'dev-spr', title: 'Spring Reference Sheet', cat: 'resources', duration: '5 min', items: 1, url: 'https://www.devancocanada.com/files/knowledgebases/Garage%20Door%20Spring%20Reference%20Sheet.pdf' },
  { id: 'hol-spr', title: 'Spring Selection Guide', cat: 'resources', duration: '10 min', items: 8, url: 'https://www.holmesgaragedoor.com/wp-content/uploads/2012/08/REID-GDSPRINGSELGUIDE-08.pdf' },
  { id: 'unl-spr', title: 'Spring Engineering Analysis', cat: 'resources', duration: '15 min', items: 5, url: 'https://digitalcommons.unl.edu/cgi/viewcontent.cgi?article=1025&context=ureca' },
];

export default function Guides() {
  const [activeCat, setActiveCat] = useState('internal');
  const { profile } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<Profile[]>([]);
  const isAdmin = profile?.email === 'joshua@garageup.com';

  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, 'profiles'), where('status', '==', 'pending'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const users = snapshot.docs.map(doc => doc.data() as Profile);
        setPendingUsers(users);
      });
      return () => unsubscribe();
    }
  }, [isAdmin]);

  const handleApprove = async (uid: string) => {
    try {
      await updateDoc(doc(db, 'profiles', uid), { status: 'approved' });
    } catch (error) {
      console.error('Approval error:', error);
    }
  };

  const handleRevoke = async (uid: string) => {
    try {
      await updateDoc(doc(db, 'profiles', uid), { status: 'revoked' });
    } catch (error) {
      console.error('Revoke error:', error);
    }
  };

  const openManual = (url?: string) => {
    window.open(url || 'https://www.garageheadquarters.com/owners-manuals', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold tracking-tight text-white italic tracking-tighter uppercase">Gilly's Brain</h2>
        <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center">
          <FileText className="w-4 h-4 text-brand-accent" />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <input 
          type="text" 
          placeholder="Search manuals..."
          className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 pl-12 shadow-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm text-white placeholder:text-zinc-600"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {CATEGORIES.filter(cat => !cat.adminOnly || isAdmin).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border border-white/5 relative",
              activeCat === cat.id ? "bg-brand-accent text-white shadow-xl shadow-brand-accent/20" : "bg-zinc-900 text-zinc-500 hover:bg-zinc-800"
            )}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
            {cat.id === 'admin' && pendingUsers.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[8px] font-black flex items-center justify-center rounded-full border-2 border-[#124728]">
                {pendingUsers.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {activeCat === 'admin' ? (
          <div className="space-y-3">
            <h3 className="px-2 text-[10px] font-black text-brand-accent uppercase tracking-widest">Pending Clearances</h3>
            {pendingUsers.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed">
                <p className="text-zinc-500 italic text-sm">No pending approvals at this time.</p>
              </div>
            ) : (
              pendingUsers.map((user) => (
                <div key={user.uid} className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{user.displayName}</h4>
                    <p className="text-[10px] text-zinc-500">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleRevoke(user.uid)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleApprove(user.uid)}
                      className="p-2 bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent rounded-xl transition-colors"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
             )}
          </div>
        ) : (
          GUIDES.filter(g => g.cat === activeCat).map((guide) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => openManual((guide as any).url)}
              className="bg-zinc-900 p-4 rounded-2xl border border-white/5 group hover:border-brand-accent/50 cursor-pointer transition-all flex items-center justify-between shadow-xl active:scale-[0.98]"
            >
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white">{guide.title}</h4>
                <div className="flex items-center gap-3 text-[10px] uppercase font-medium text-zinc-500">
                  <span>{guide.duration}</span>
                  <span>•</span>
                  <span>{guide.items} Steps</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-zinc-800 group-hover:bg-brand-accent group-hover:text-white transition-colors">
                <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-white" />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Manual Request */}
      {activeCat !== 'admin' && (
        <div className="bg-zinc-900/50 border border-dashed border-white/10 rounded-2xl p-6 text-center">
          <p className="text-xs text-zinc-500 italic">
            Manual missing? Ask <span className="font-bold text-brand-accent">Gilly</span> to find the specific manufacturer specs for you.
          </p>
        </div>
      )}
    </div>
  );
}
