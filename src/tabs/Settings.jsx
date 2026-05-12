import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getAllLogs, clearAllData } from '../utils/storage';

export default function Settings() {
  const [userName, setUserName] = useLocalStorage('lifeos_name', 'Sumeet');
  const [apiKey, setApiKey] = useLocalStorage('lifeos_api_key', '');
  
  const [showConfirm, setShowConfirm] = useState(false);

  const handleExport = () => {
    const logs = getAllLogs();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `lifeos_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleClear = () => {
    clearAllData();
    window.location.reload();
  };

  const inputClass = "w-full bg-[#0a0a14] border border-[var(--border-glass)] rounded-[var(--radius-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--coral-glow)] focus:border-transparent transition-all";
  const labelClass = "block text-[12px] font-medium text-[var(--text-muted)] mb-1.5 font-body";

  return (
    <div className="pb-24 pt-6 px-4 md:px-8 max-w-4xl mx-auto">
      <h2 className="font-heading font-extrabold text-2xl text-white mb-6">Settings</h2>
      
      <GlassCard className="space-y-6">
        <div>
          <label className={labelClass}>Your Name</label>
          <input 
            type="text" 
            className={inputClass}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Gemini API Key</label>
          <input 
            type="password" 
            placeholder="AIza..." 
            className={inputClass}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Stored locally. Used for AI Insights. Overrides .env key if present.
          </p>
        </div>

        <div className="pt-4 border-t border-[var(--border-glass)]">
          <button 
            onClick={handleExport}
            className="w-full py-2.5 px-4 rounded-xl font-heading font-bold text-[var(--text-primary)] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors mb-3"
          >
            Export Data (JSON)
          </button>

          {!showConfirm ? (
            <button 
              onClick={() => setShowConfirm(true)}
              className="w-full py-2.5 px-4 rounded-xl font-heading font-bold text-[#FF6B6B] bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 hover:bg-[#FF6B6B]/20 transition-colors"
            >
              Clear All Data
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl font-heading font-bold text-[var(--text-primary)] bg-white/5 border border-white/10"
              >
                Cancel
              </button>
              <button 
                onClick={handleClear}
                className="flex-1 py-2.5 px-4 rounded-xl font-heading font-bold text-white bg-[#FF6B6B] shadow-lg shadow-[#FF6B6B]/20"
              >
                Yes, Clear Everything
              </button>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
