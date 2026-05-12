import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { getAllLogs } from '../utils/storage';

const getCompactStats = (log) => {
  const stats = [];
  if (log.study?.hours) stats.push(`📚 ${log.study.hours}h`);
  if (log.workout) stats.push(log.workout.done ? '💪 Done' : '✗ Skip');
  if (log.sleep?.hours) stats.push(`😴 ${log.sleep.hours}h`);
  if (log.finance?.spent) stats.push(`💰 ₹${log.finance.spent}`);
  if (log.diet?.rating) stats.push('⭐'.repeat(log.diet.rating));
  return stats;
};

const DayCard = ({ log }) => {
  const [expanded, setExpanded] = useState(false);
  const dateObj = new Date(log.date);
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNum = dateObj.getDate();

  return (
    <GlassCard className="mb-3 transition-all overflow-hidden">
      <div className="flex gap-4">
        {/* Left Col */}
        <div className="flex flex-col items-center justify-center min-w-[40px]">
          <span className="text-[12px] text-[var(--text-muted)] font-body uppercase">{dayName}</span>
          <span className="text-[24px] font-heading font-extrabold text-white leading-none">{dayNum}</span>
        </div>
        
        {/* Right Col */}
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 pt-1">
            {getCompactStats(log).map((stat, i) => (
              <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded-md text-[11px] text-[var(--text-secondary)]">
                {stat}
              </span>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setExpanded(!expanded)}
          className="p-2 -mr-2 rounded-full hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-colors"
        >
          <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
            <ChevronDown size={20} />
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pt-4 mt-4 border-t border-[var(--border-glass)]"
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
              {log.study && (
                <div>
                  <div className="text-[var(--text-muted)] text-[11px] mb-0.5">Study</div>
                  <div className="text-white">{log.study.hours}h • {log.study.topics || 'No topic'}</div>
                </div>
              )}
              {log.workout && (
                <div>
                  <div className="text-[var(--text-muted)] text-[11px] mb-0.5">Workout</div>
                  <div className="text-white">{log.workout.done ? `${log.workout.type} (${log.workout.duration}m)` : 'Skipped'}</div>
                </div>
              )}
              {log.diet && (
                <div>
                  <div className="text-[var(--text-muted)] text-[11px] mb-0.5">Diet</div>
                  <div className="text-white">{log.diet.rating}/5 rating</div>
                </div>
              )}
              {log.finance && (
                <div>
                  <div className="text-[var(--text-muted)] text-[11px] mb-0.5">Spent</div>
                  <div className="text-white">₹{log.finance.spent} ({log.finance.category})</div>
                </div>
              )}
              {log.notes && (
                <div className="col-span-2 mt-2">
                  <div className="text-[var(--text-muted)] text-[11px] mb-0.5">Notes</div>
                  <div className="text-[var(--text-secondary)] italic">"{log.notes}"</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};

export default function History() {
  const [logs, setLogs] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchLogs = () => setLogs(getAllLogs());
    fetchLogs();
    
    window.addEventListener('lifeos-stats-updated', fetchLogs);
    return () => window.removeEventListener('lifeos-stats-updated', fetchLogs);
  }, []);

  // Filter logs by selected month
  const filteredLogs = logs.filter(log => {
    const d = new Date(log.date);
    return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
  });

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="pb-24 pt-6 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={prevMonth} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
          <ChevronLeft size={20} className="text-[var(--text-secondary)]" />
        </button>
        <h2 className="font-heading font-extrabold text-xl text-white tracking-wide">{monthName}</h2>
        <button onClick={nextMonth} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
          <ChevronRight size={20} className="text-[var(--text-secondary)]" />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {filteredLogs.length > 0 ? (
          filteredLogs.map(log => <DayCard key={log.date} log={log} />)
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 border-2 border-dashed border-[var(--border-glass-bright)] rounded-xl flex items-center justify-center">
              <span className="text-2xl opacity-50">📅</span>
            </div>
            <p className="text-[var(--text-muted)]">No entries yet for this month.</p>
          </div>
        )}
      </div>
    </div>
  );
}
