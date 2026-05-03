import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Plus, 
  X, 
  Search, 
  Filter, 
  Trash2, 
  Upload, 
  AlertCircle,
  Clock,
  User as UserIcon,
  Video as VideoIcon,
  Hash
} from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './FirebaseProvider';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  category: string;
  userId: string;
  userEmail: string;
  createdAt: any;
}

const CATEGORIES = ['Installation', 'Troubleshooting', 'Safety', 'Maintenance'];

const VideoLibrary: React.FC = () => {
  const { user, signIn } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  // Form State
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    url: '',
    category: 'Installation'
  });

  useEffect(() => {
    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vids = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Video[];
      setVideos(vids);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'videos');
    });

    return unsubscribe;
  }, []);

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'videos'), {
        ...newVideo,
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp()
      });
      setIsAdding(false);
      setNewVideo({ title: '', description: '', url: '', category: 'Installation' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'videos');
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!window.confirm('Delete this demonstration?')) return;
    try {
      await deleteDoc(doc(db, 'videos', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `videos/${id}`);
    }
  };

  // Extract YouTube ID if applicable
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      const id = (match && match[2].length === 11) ? match[2] : null;
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    return url;
  };

  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <VideoIcon className="text-orange-600" />
            Field Studio
          </h2>
          <p className="text-slate-500">Visual guides and troubleshooting demos from the fleet.</p>
        </div>
        
        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Add Training Clip
            </button>
          ) : (
            <button
              onClick={signIn}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Sign in to contribute
            </button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search demonstrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-orange-500 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
          <Filter size={18} className="text-slate-400 hidden sm:block" />
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              !selectedCategory ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredVideos.map((video) => (
            <motion.div
              key={video.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all"
            >
              {/* Thumbnail Placeholder/Preview */}
              <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
                <Play className="text-white opacity-50 group-hover:opacity-100 transition-opacity" size={48} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                <button
                  onClick={() => setActiveVideo(video)}
                  className="absolute inset-0 z-10"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase tracking-wider">
                  {video.category}
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2 text-slate-400">
                   <div className="flex items-center gap-1.5 text-xs">
                    <UserIcon size={12} />
                    {video.userEmail?.split('@')[0]}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock size={12} />
                    {video.createdAt ? new Date(video.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                  </div>
                </div>
                
                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {video.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <button
                    onClick={() => setActiveVideo(video)}
                    className="text-orange-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Watch Now <Play size={14} fill="currentColor" />
                  </button>
                  
                  {user?.uid === video.userId && (
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredVideos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="p-4 bg-slate-50 rounded-full mb-4">
            <VideoIcon className="text-slate-300" size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No demonstrations found</h3>
          <p className="text-slate-500">Be the first to share a training clip with the community.</p>
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900">Add Field Demonstration</h3>
                <button
                  onClick={() => setIsAdding(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddVideo} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Video Title</label>
                  <input
                    required
                    type="text"
                    value={newVideo.title}
                    onChange={e => setNewVideo({...newVideo, title: e.target.value})}
                    placeholder="e.g. Setting High-Lift Clearance"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-orange-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Category</label>
                    <select
                      value={newVideo.category}
                      onChange={e => setNewVideo({...newVideo, category: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-orange-500 focus:bg-white outline-none transition-all"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ) )}
                    </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Video Duration</label>
                     <div className="w-full px-4 py-3 bg-slate-50 text-slate-400 rounded-xl flex items-center gap-2">
                        <Clock size={16} />
                        <span className="text-sm italic">Auto-detected</span>
                     </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                    Video URL <Hash size={12} />
                  </label>
                  <input
                    required
                    type="url"
                    value={newVideo.url}
                    onChange={e => setNewVideo({...newVideo, url: e.target.value})}
                    placeholder="YouTube, Vimeo, or direct video link"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-orange-500 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-mono text-sm"
                  />
                  <p className="text-[10px] text-slate-400 italic">Technicians prefer vertical orientation for troubleshooting clips.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Summary (Context)</label>
                  <textarea
                    rows={3}
                    value={newVideo.description}
                    onChange={e => setNewVideo({...newVideo, description: e.target.value})}
                    placeholder="Briefly explain what's being demonstrated..."
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-orange-500 focus:bg-white outline-none transition-all placeholder:text-slate-300 resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Upload size={18} />
                    Publish Demo
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <iframe
                src={`${getEmbedUrl(activeVideo.url)}?autoplay=1`}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              
              <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                <div className="flex items-center gap-2 mb-2">
                   <span className="px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded uppercase">
                    {activeVideo.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{activeVideo.title}</h3>
                <p className="text-slate-300 text-sm max-w-2xl">{activeVideo.description}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoLibrary;
