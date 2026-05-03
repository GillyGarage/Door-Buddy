import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Camera, User, Bot, Loader2, Sparkles, X, Mic, MicOff, Cog, Radio, Eye, Scale, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { askGilly, askGillyStream } from '../lib/gemini';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

export default function GillyChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hey there! I\'m Gilly. "You\'ve got door problems, I got door solutions." How can I help you in the field today? You can even show me a photo of a problem door!' }
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListeningSpeech(true);
    recognition.onend = () => setIsListeningSpeech(false);
    recognition.onerror = () => setIsListeningSpeech(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || loading) return;

    const userMsg: Message = { 
      role: 'user', 
      content: input, 
      image: selectedImage || undefined 
    };
    
    const assistantMsg: Message = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput('');
    setSelectedImage(null);
    setLoading(true);

    try {
      const base64 = userMsg.image?.split(',')[1];
      let fullResponse = '';
      
      const stream = askGillyStream(userMsg.content || "Look at this photo and tell me what's wrong.", base64);
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { 
            role: 'assistant', 
            content: fullResponse 
          };
          return newMessages;
        });
      }
      
      if (!fullResponse) {
         throw new Error("No response from Gilly");
      }

      if (fullResponse?.toLowerCase().includes('fact') || fullResponse?.toLowerCase().includes('tip')) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#024C4E']
        });
      }
    } catch (error: any) {
      const errorMessage = error.message === 'Missing GEMINI_API_KEY' 
        ? "Gilly is unplugged! Please check the API settings in the menu to reconnect his brain." 
        : "Whoops! Gilly had a bit of a transmission hiccup. Try describing the issue again.";

      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          role: 'assistant', 
          content: errorMessage
        };
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const QUICK_PROMPTS = [
    { label: 'Broken Spring', icon: Activity, color: 'text-blue-400' },
    { label: 'Opener Grinding', icon: Cog, color: 'text-gray-400' },
    { label: 'Remote Not Working', icon: Radio, color: 'text-orange-400' },
    { label: 'Sensors Flashing', icon: Eye, color: 'text-yellow-400' },
    { label: 'Heavy Door', icon: Scale, color: 'text-purple-400' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Header Info */}
      <div className="bg-brand-accent p-4 rounded-2xl mb-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden shadow-lg bg-zinc-800">
             <img 
               src="/regenerated_image_1777672651196.png" 
               alt="Gilly"
               referrerPolicy="no-referrer"
               className="w-full h-full object-cover"
             />
          </div>
          <div>
            <span className="font-black text-xs uppercase tracking-tighter block leading-none text-white">"Door Solutions Specialist"</span>
            <span className="text-[9px] font-bold opacity-60 uppercase tracking-widest text-white">Gilly v3.1 AI</span>
          </div>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-bold text-white">LIVE</div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 pb-4 scrollbar-hide">
        {messages.length === 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-2 mb-6"
          >
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p.label}
                onClick={() => { setInput(`Technical help for: ${p.label}`); }}
                className="flex items-center gap-3 p-4 bg-zinc-900 border border-white/5 rounded-2xl text-left hover:border-brand-accent transition-all group shadow-sm active:scale-95"
              >
                <div className={cn("p-2 rounded-lg bg-white/5", p.color)}>
                  <p.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase leading-tight text-white opacity-60 group-hover:opacity-100 italic tracking-tight">{p.label}</span>
              </button>
            ))}
          </motion.div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[85%] rounded-2xl p-4 shadow-xl",
              msg.role === 'user' 
                ? "bg-brand-accent text-white rounded-tr-none" 
                : "bg-zinc-900 text-zinc-100 rounded-tl-none border border-white/5"
            )}>
              <div className="flex items-center gap-2 mb-2 opacity-80">
                {msg.role === 'user' ? (
                  <User className="w-3 h-3 opacity-50" />
                ) : (
                  <div className="w-4 h-4 rounded-full overflow-hidden border border-white/10 shrink-0 bg-zinc-800">
                    <img src="/regenerated_image_1777672651196.png" alt="G" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <span className={cn(
                  "text-[10px] uppercase font-black tracking-widest",
                  msg.role === 'assistant' && "text-brand-accent"
                )}>
                  {msg.role === 'user' ? 'Technician' : 'Gilly'}
                </span>
              </div>
              
              {msg.image && (
                <div className="mb-3 rounded-lg overflow-hidden border border-white/10">
                  <img src={msg.image} alt="Tech upload" className="w-full h-auto" />
                </div>
              )}
              
              <div className="text-sm prose prose-invert prose-p:my-1 prose-sm">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 rounded-2xl p-4 rounded-tl-none border border-white/5 flex items-center gap-2 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-brand-accent" />
              <span className="text-xs italic text-zinc-500">Gilly is thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 relative">
        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full mb-4 left-0 bg-zinc-800 p-2 rounded-xl border border-white/10 flex items-center gap-2 shadow-xl"
            >
              <img src={selectedImage} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="p-1 rounded-full bg-red-500/10 text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
<div className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-2xl p-2 pl-4 shadow-2xl focus-within:border-brand-accent transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Describe the issue..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-zinc-600"
          />
          <div className="flex items-center gap-1">
            <button 
              onClick={startListening}
              className={cn(
                "p-2 rounded-xl transition-all",
                isListeningSpeech ? "bg-red-500/20 text-red-500 animate-pulse" : "hover:bg-white/5 text-zinc-500"
              )}
            >
              {isListeningSpeech ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <label className="p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              <Camera className="w-5 h-5 text-zinc-500" />
            </label>
            <button 
              onClick={handleSend}
              className="p-3 bg-brand-accent rounded-xl text-white hover:opacity-90 transition-all active:scale-[0.95] disabled:opacity-50"
              disabled={loading}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
