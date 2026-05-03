import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  UserCheck, 
  UserMinus, 
  Search,
  Clock,
  ChevronRight,
  RefreshCcw,
  AlertCircle
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { cn } from '../lib/utils';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  status: 'pending' | 'approved' | 'revoked';
  role: 'tech' | 'admin';
  createdAt: any;
}

export default function AdminPanel() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'revoked'>('all');

  useEffect(() => {
    const q = query(collection(db, 'profiles'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data() as UserProfile);
      setProfiles(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (uid: string, status: 'approved' | 'revoked') => {
    try {
      await updateDoc(doc(db, 'profiles', uid), { status });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!window.confirm('Are you sure you want to delete this user profile? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'profiles', uid));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = p.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: profiles.length,
    pending: profiles.filter(p => p.status === 'pending').length,
    active: profiles.filter(p => p.status === 'approved').length
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <RefreshCcw className="w-8 h-8 text-brand-accent animate-spin" />
        <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">Loading Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-accent" />
              <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest italic">Command View</span>
            </div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Technician Registry</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {[
              { label: 'Total', value: stats.total, color: 'text-white' },
              { label: 'Pending', value: stats.pending, color: 'text-amber-500' },
              { label: 'Active', value: stats.active, color: 'text-brand-accent' }
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/5 rounded-2xl px-4 py-2 text-center min-w-[80px]">
                <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className={cn("text-xl font-black italic", stat.color)}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search technicians..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'revoked'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                filter === f 
                  ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20" 
                  : "bg-zinc-900 text-zinc-500 border border-white/5 hover:border-white/20"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredProfiles.length === 0 ? (
          <div className="bg-zinc-900/50 rounded-3xl p-12 text-center border border-dashed border-white/10">
            <AlertCircle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 font-bold italic">No matching technicians found</p>
          </div>
        ) : (
          filteredProfiles.map((p) => (
            <motion.div
              layout
              key={p.uid}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-zinc-900 border border-white/5 rounded-3xl p-4 flex items-center justify-between hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center relative",
                  p.status === 'approved' ? "bg-brand-accent/20" : 
                  p.status === 'pending' ? "bg-amber-500/20" : "bg-red-500/20"
                )}>
                  <Users className={cn(
                    "w-6 h-6",
                    p.status === 'approved' ? "text-brand-accent" : 
                    p.status === 'pending' ? "text-amber-500" : "text-red-500"
                  )} />
                  {p.role === 'admin' && (
                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                      <ShieldCheck className="w-2.5 h-2.5 text-zinc-900" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-white uppercase italic tracking-tight">{p.displayName}</h4>
                    <div className={cn(
                      "px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-[0.15em]",
                      p.status === 'approved' ? "bg-brand-accent/20 text-brand-accent" : 
                      p.status === 'pending' ? "bg-amber-500/20 text-amber-500" : "bg-red-500/20 text-red-500"
                    )}>
                      {p.status}
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-tight">{p.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {p.status !== 'approved' && (
                  <button
                    onClick={() => handleUpdateStatus(p.uid, 'approved')}
                    className="p-2.5 rounded-xl bg-brand-accent/20 text-brand-accent hover:bg-brand-accent hover:text-white transition-all shadow-lg shadow-brand-accent/5"
                    title="Approve Technician"
                  >
                    <UserCheck className="w-4 h-4" />
                  </button>
                )}
                {p.status !== 'revoked' && p.role !== 'admin' && (
                  <button
                    onClick={() => handleUpdateStatus(p.uid, 'revoked')}
                    className="p-2.5 rounded-xl bg-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white transition-all shadow-lg shadow-amber-500/5"
                    title="Revoke Access"
                  >
                    <UserMinus className="w-4 h-4" />
                  </button>
                )}
                {p.role !== 'admin' && (
                  <button
                    onClick={() => handleDeleteUser(p.uid)}
                    className="p-2.5 rounded-xl bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5"
                    title="Delete Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
