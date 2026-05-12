import React from 'react';
import { BookOpen, BarChart2, CalendarDays, Settings } from 'lucide-react';
import { useStats } from '../hooks/useStats';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { xp, streak } = useStats();
  
  const navItems = [
    { id: 'today', label: "Today's Log", icon: BookOpen },
    { id: 'insights', label: 'Insights', icon: BarChart2 },
    { id: 'history', label: 'History', icon: CalendarDays },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const todayDateString = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <aside className="hidden md:flex flex-col w-[220px] bg-[#0a0a14] border-r border-[var(--border-glass)] h-screen fixed left-0 top-0 z-50">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="font-heading font-extrabold text-[22px] tracking-tight text-white">LifeOS</h1>
          <div className="w-2 h-2 rounded-full bg-[var(--coral)]" />
        </div>
        <div className="text-[13px] text-[var(--text-secondary)] font-body">
          {todayDateString}
        </div>
        
        <div className="mt-6 flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 bg-[var(--coral-dim)] border border-[var(--coral)]/20 px-3 py-1.5 rounded-full w-fit">
            <span className="text-[12px] font-bold text-[var(--coral)]">⚡ {xp} XP</span>
          </div>
          {streak > 0 && (
            <div className="text-[12px] font-medium text-[#FBBF24] px-1">
              🔥 {streak}-day streak
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 transition-all text-[14px] font-medium ${
                isActive 
                  ? 'border-l-[3px] border-[var(--coral)] bg-[var(--coral-dim)] text-white rounded-r-lg' 
                  : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-glass)] rounded-lg'
              }`}
            >
              <item.icon size={18} className={isActive ? 'text-[var(--coral)]' : ''} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
