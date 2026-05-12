import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import TodayLog from './tabs/TodayLog';
import Insights from './tabs/Insights';
import History from './tabs/History';
import Settings from './tabs/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('today');

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 md:ml-[220px] min-h-screen relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="min-h-full"
          >
            {activeTab === 'today' && <TodayLog />}
            {activeTab === 'insights' && <Insights />}
            {activeTab === 'history' && <History />}
            {activeTab === 'settings' && <Settings />}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
