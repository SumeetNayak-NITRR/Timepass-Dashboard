import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Dumbbell, Apple, Wallet, Moon, Mic, Trophy, Feather } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import SegmentedControl from '../components/SegmentedControl';
import StarRating from '../components/StarRating';
import EmojiRating from '../components/EmojiRating';
import { getTodayLog, saveLog } from '../utils/storage';
import { getTodayDateString, getTodayKey, getGreeting } from '../utils/date';
import { handleXPAndStreak } from '../utils/xp';
import { useLocalStorage } from '../hooks/useLocalStorage';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};

export default function TodayLog() {
  const [userName] = useLocalStorage('lifeos_name', 'Sumeet');
  const greeting = getGreeting();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Form state matching schema
  const [study, setStudy] = useState({ hours: '', topics: '' });
  const [workout, setWorkout] = useState({ done: '✗ Skipped', type: '', duration: '', feel: 3 });
  const [diet, setDiet] = useState({ breakfast: '', lunch: '', dinner: '', water: '', rating: 0 });
  const [finance, setFinance] = useState({ spent: '', description: '', category: 'Food' });
  const [sleep, setSleep] = useState({ hours: '', quality: 3, energy: 3 });
  const [comm, setComm] = useState({ practiced: 'No', notes: '', confidence: 0 });
  const [football, setFootball] = useState({ activity: 'Rest', notes: '' });
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const log = getTodayLog();
    if (log) {
      setIsUpdating(true);
      if (log.study) setStudy({ hours: log.study.hours || '', topics: log.study.topics || '' });
      if (log.workout) setWorkout({ 
        done: log.workout.done ? '✓ Done' : '✗ Skipped', 
        type: log.workout.type || '', 
        duration: log.workout.duration || '', 
        feel: log.workout.feel || 3 
      });
      if (log.diet) setDiet({
        breakfast: log.diet.breakfast || '', lunch: log.diet.lunch || '', 
        dinner: log.diet.dinner || '', water: log.diet.water || '', rating: log.diet.rating || 0
      });
      if (log.finance) setFinance({
        spent: log.finance.spent || '', description: log.finance.description || '', category: log.finance.category || 'Food'
      });
      if (log.sleep) setSleep({
        hours: log.sleep.hours || '', quality: log.sleep.quality || 3, energy: log.sleep.energy || 3
      });
      if (log.communication) setComm({
        practiced: log.communication.practiced ? 'Yes' : 'No', notes: log.communication.notes || '', confidence: log.communication.confidence || 0
      });
      if (log.football) setFootball({
        activity: log.football.activity || 'Rest', notes: log.football.notes || ''
      });
      if (log.notes) setNotes(log.notes || '');
    }
  }, []);

  const handleSave = () => {
    const data = {
      date: getTodayDateString(),
      study: { hours: parseFloat(study.hours) || 0, topics: study.topics },
      workout: { 
        done: workout.done === '✓ Done', 
        type: workout.type, 
        duration: parseInt(workout.duration) || 0, 
        feel: workout.feel 
      },
      diet: {
        breakfast: diet.breakfast, lunch: diet.lunch, dinner: diet.dinner, 
        water: parseInt(diet.water) || 0, rating: diet.rating
      },
      finance: {
        spent: parseFloat(finance.spent) || 0, description: finance.description, category: finance.category
      },
      sleep: {
        hours: parseFloat(sleep.hours) || 0, quality: sleep.quality, energy: sleep.energy
      },
      communication: {
        practiced: comm.practiced === 'Yes', notes: comm.notes, confidence: comm.confidence
      },
      football: { activity: football.activity, notes: football.notes },
      notes: notes
    };

    saveLog(getTodayKey(), data);
    handleXPAndStreak(!isUpdating);
    setIsUpdating(true);
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const inputClass = "w-full bg-[#0a0a14] border border-[var(--border-glass)] rounded-[var(--radius-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--coral-glow)] focus:border-transparent transition-all";
  const labelClass = "block text-[12px] font-medium text-[var(--text-muted)] mb-1.5 font-body";

  const filledSections = [
    study.hours || study.topics,
    workout.done === '✓ Done',
    diet.breakfast || diet.lunch || diet.dinner || diet.water || diet.rating > 0,
    finance.spent || finance.description,
    sleep.hours, 
    comm.practiced === 'Yes' || football.activity !== 'Rest',
    notes.trim()
  ].filter(Boolean).length;
  
  const progressPercentage = (filledSections / 7) * 100;
  const circumference = 2 * Math.PI * 16;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="pb-24 pt-6 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white tracking-tight">
            {greeting}, {userName} <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">Log your day. Stay consistent.</p>
        </div>

        <div className="flex items-center gap-4 bg-[#0a0a14] p-3 rounded-xl border border-[var(--border-glass)] w-fit">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="var(--border-glass)" strokeWidth="3" />
              <circle 
                cx="18" cy="18" r="16" fill="none" stroke="url(#coral-gradient)" strokeWidth="3" 
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
              <defs>
                <linearGradient id="coral-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--coral)" />
                  <stop offset="100%" stopColor="var(--purple)" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-[11px] font-bold text-white">{filledSections}/7</span>
          </div>
          <div className="pr-2">
            <p className="text-[13px] font-bold text-white leading-tight">Daily Log Progress</p>
            <p className="text-[11px] text-[var(--text-muted)]">Sections completed</p>
          </div>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
      >
        {/* Card 1: Study */}
        <motion.div variants={cardVariants}>
          <GlassCard className="h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-[var(--coral-dim)] text-[var(--coral)]">
                <BookOpen size={18} />
              </div>
              <h2 className="font-heading font-bold text-[15px] text-white">Study</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Hours studied</label>
                <input 
                  type="number" step="0.5" min="0" max="16" placeholder="0.0" className={inputClass}
                  value={study.hours} onChange={e => setStudy({...study, hours: e.target.value})}
                />
              </div>
              <div>
                <label className={labelClass}>What did you study?</label>
                <input 
                  type="text" placeholder="e.g. SQL basics, Python loops" className={inputClass}
                  value={study.topics} onChange={e => setStudy({...study, topics: e.target.value})}
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Card 2: Workout */}
        <motion.div variants={cardVariants}>
          <GlassCard className="h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-[var(--purple-dim)] text-[var(--purple)]">
                <Dumbbell size={18} />
              </div>
              <h2 className="font-heading font-bold text-[15px] text-white">Workout</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Did you work out?</label>
                <SegmentedControl 
                  options={['✓ Done', '✗ Skipped']} 
                  selected={workout.done}
                  onChange={(v) => setWorkout({...workout, done: v})}
                />
              </div>
              
              <AnimatePresence>
                {workout.done === '✓ Done' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div>
                      <label className={labelClass}>Workout type</label>
                      <input 
                        type="text" placeholder="e.g. Push day, Football drills" className={inputClass}
                        value={workout.type} onChange={e => setWorkout({...workout, type: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Duration (mins)</label>
                      <input 
                        type="number" min="0" placeholder="45" className={inputClass}
                        value={workout.duration} onChange={e => setWorkout({...workout, duration: e.target.value})}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className={labelClass}>Felt</label>
                <EmojiRating 
                  emojis={['😴', '😐', '😊', '💪', '🔥']} 
                  rating={workout.feel} 
                  onChange={(v) => setWorkout({...workout, feel: v})} 
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Card 3: Diet */}
        <motion.div variants={cardVariants}>
          <GlassCard className="h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-[var(--teal-dim)] text-[var(--teal)]">
                <Apple size={18} />
              </div>
              <h2 className="font-heading font-bold text-[15px] text-white">Diet</h2>
            </div>
            <div className="space-y-3">
              <div>
                <input 
                  type="text" placeholder="Breakfast" className={inputClass}
                  value={diet.breakfast} onChange={e => setDiet({...diet, breakfast: e.target.value})}
                />
              </div>
              <div>
                <input 
                  type="text" placeholder="Lunch" className={inputClass}
                  value={diet.lunch} onChange={e => setDiet({...diet, lunch: e.target.value})}
                />
              </div>
              <div>
                <input 
                  type="text" placeholder="Dinner" className={inputClass}
                  value={diet.dinner} onChange={e => setDiet({...diet, dinner: e.target.value})}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={labelClass}>Water (glasses)</label>
                  <input 
                    type="number" min="0" max="15" placeholder="8" className={inputClass}
                    value={diet.water} onChange={e => setDiet({...diet, water: e.target.value})}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-end pb-2">
                  <StarRating rating={diet.rating} onChange={(v) => setDiet({...diet, rating: v})} />
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Card 4: Finance */}
        <motion.div variants={cardVariants}>
          <GlassCard className="h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-[var(--amber-dim)] text-[var(--amber)]">
                <Wallet size={18} />
              </div>
              <h2 className="font-heading font-bold text-[15px] text-white">Finance</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Total spent</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[var(--text-muted)]">₹</span>
                  <input 
                    type="number" min="0" placeholder="0" className={`${inputClass} pl-7`}
                    value={finance.spent} onChange={e => setFinance({...finance, spent: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Spent on</label>
                <input 
                  type="text" placeholder="e.g. food ₹80, Swiggy ₹120" className={inputClass}
                  value={finance.description} onChange={e => setFinance({...finance, description: e.target.value})}
                />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <SegmentedControl 
                  options={['Food', 'Transport', 'Education', 'Other']} 
                  selected={finance.category}
                  onChange={(v) => setFinance({...finance, category: v})}
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Card 5: Sleep & Energy */}
        <motion.div variants={cardVariants}>
          <GlassCard className="h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-[var(--purple-dim)] text-[var(--purple)]">
                <Moon size={18} />
              </div>
              <h2 className="font-heading font-bold text-[15px] text-white">Sleep & Energy</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Hours slept</label>
                <input 
                  type="number" step="0.5" min="0" max="12" placeholder="7.5" className={inputClass}
                  value={sleep.hours} onChange={e => setSleep({...sleep, hours: e.target.value})}
                />
              </div>
              <div>
                <label className={labelClass}>Sleep quality</label>
                <EmojiRating 
                  emojis={['😵', '😴', '😐', '🙂', '😌']} 
                  rating={sleep.quality} 
                  onChange={(v) => setSleep({...sleep, quality: v})} 
                />
              </div>
              <div>
                <label className={labelClass}>Energy level today</label>
                <EmojiRating 
                  emojis={['🪫', '😶', '🔋', '⚡', '🚀']} 
                  rating={sleep.energy} 
                  onChange={(v) => setSleep({...sleep, energy: v})} 
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Card 6: Communication + Football */}
        <motion.div variants={cardVariants}>
          <GlassCard className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[var(--coral-dim)] text-[var(--coral)]">
                  <Mic size={18} />
                </div>
                <h2 className="font-heading font-bold text-[15px] text-white">Communication</h2>
              </div>
            </div>
            
            <div className="space-y-4 flex-1">
              <div className="flex gap-4 items-center">
                <label className="text-[12px] font-medium text-[var(--text-muted)] font-body flex-1">Practiced today?</label>
                <div className="w-32">
                  <SegmentedControl 
                    options={['Yes', 'No']} 
                    selected={comm.practiced}
                    onChange={(v) => setComm({...comm, practiced: v})}
                  />
                </div>
              </div>
              
              <AnimatePresence>
                {comm.practiced === 'Yes' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div>
                      <textarea 
                        rows="2" placeholder="What did you practice? Any new words?" className={`${inputClass} resize-none`}
                        value={comm.notes} onChange={e => setComm({...comm, notes: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className={labelClass + " !mb-0"}>Confidence level</label>
                      <StarRating rating={comm.confidence} onChange={(v) => setComm({...comm, confidence: v})} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="h-px bg-[var(--border-glass)] w-full my-4" />

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-[var(--coral-dim)] text-[var(--coral)]">
                  <Trophy size={18} />
                </div>
                <h2 className="font-heading font-bold text-[15px] text-white">Football</h2>
              </div>

              <div>
                <label className={labelClass}>Activity</label>
                <SegmentedControl 
                  options={['Training', 'Match', 'Rest']} 
                  selected={football.activity}
                  onChange={(v) => setFootball({...football, activity: v})}
                />
              </div>
              <div>
                <textarea 
                  rows="2" placeholder="Match result, what you worked on..." className={`${inputClass} resize-none`}
                  value={football.notes} onChange={e => setFootball({...football, notes: e.target.value})}
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Card 7: General Notes */}
        <motion.div variants={cardVariants} className="md:col-span-2">
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-white/10 text-[var(--text-secondary)]">
                <Feather size={18} />
              </div>
              <h2 className="font-heading font-bold text-[15px] text-white">General Notes</h2>
            </div>
            <div className="relative">
              <textarea 
                rows="4" 
                placeholder="Anything else about today? Wins, reflections, things to improve..." 
                className={`${inputClass} resize-none`}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
              <span className="absolute bottom-3 right-3 text-[11px] text-[var(--text-muted)] font-body">
                {notes.length}
              </span>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      <motion.button
        variants={cardVariants}
        initial="hidden"
        animate="show"
        whileHover={{ scale: 1.01, filter: 'brightness(1.1)' }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        className="w-full mt-6 h-[52px] rounded-xl font-heading font-bold text-white shadow-lg flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg, var(--coral), var(--purple))' }}
      >
        {isUpdating ? 'Update Day →' : 'Save Day →'}
      </motion.button>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#0a0a14] border border-[var(--teal)]/40 py-3 px-5 rounded-full shadow-2xl backdrop-blur-lg"
          >
            <div className="w-5 h-5 rounded-full bg-[var(--teal-dim)] flex items-center justify-center text-[var(--teal)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span className="text-white text-sm font-medium">Log saved successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
