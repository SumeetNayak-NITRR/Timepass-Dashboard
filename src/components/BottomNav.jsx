import React from 'react';
import { BookOpen, BarChart2, CalendarDays, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'today', icon: BookOpen },
    { id: 'insights', icon: BarChart2 },
    { id: 'history', icon: CalendarDays },
    { id: 'settings', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0a0a14]/90 backdrop-blur-xl border-t border-[var(--border-glass)] flex items-center justify-around px-2 z-50">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="relative p-3 flex items-center justify-center rounded-full transition-transform active:scale-95"
          >
            {isActive && (
              <motion.div
                layoutId="bottom-nav-indicator"
                className="absolute inset-0 bg-[var(--coral-dim)] border border-[var(--coral)]/20 rounded-full z-0"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <item.icon 
              size={24} 
              className={`relative z-10 transition-colors ${isActive ? 'text-[var(--coral)]' : 'text-[var(--text-secondary)] hover:text-white'}`} 
            />
          </button>
        );
      })}
    </div>
  );
}
