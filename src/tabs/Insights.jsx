import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Flame, Moon, Apple, Wallet, Mic, Sparkles, Lock } from 'lucide-react';
import StatCard from '../components/StatCard';
import GlassCard from '../components/GlassCard';
import { getLast7DaysEntries } from '../utils/storage';
import { useStats } from '../hooks/useStats';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Insights() {
  const { streak } = useStats();
  const [entries, setEntries] = useState({});
  const [stats, setStats] = useState({
    studyHours: 0,
    avgSleep: 0,
    avgDiet: 0,
    spent: 0,
    commDays: 0
  });

  const [apiKey] = useLocalStorage('lifeos_api_key', '');
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_ANTHROPIC_API_KEY || '';
  const finalApiKey = apiKey || envApiKey;

  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    const data = getLast7DaysEntries();
    setEntries(data);

    let totalStudy = 0;
    let totalSleep = 0;
    let totalDiet = 0;
    let totalSpent = 0;
    let commCount = 0;
    
    const days = Object.values(data);
    const numDays = days.length;

    days.forEach(day => {
      totalStudy += day.study?.hours || 0;
      totalSleep += day.sleep?.hours || 0;
      totalDiet += day.diet?.rating || 0;
      totalSpent += day.finance?.spent || 0;
      if (day.communication?.practiced) commCount += 1;
    });

    setStats({
      studyHours: totalStudy,
      avgSleep: numDays ? (totalSleep / numDays).toFixed(1) : 0,
      avgDiet: numDays ? (totalDiet / numDays).toFixed(1) : 0,
      spent: totalSpent,
      commDays: commCount
    });
  }, []);

  const numEntries = Object.keys(entries).length;

  const generateInsights = async () => {
    if (!finalApiKey) {
      setAiError("API Key missing. Please set it in Settings or .env");
      return;
    }

    setAiLoading(true);
    setAiError(null);

    const systemPrompt = `You are a personal productivity coach for a 20-year-old engineering student named Sumeet who is focused on Data Analytics, football, fitness, and improving his English communication. Analyze his habit tracking data and give honest, specific, actionable insights. Be direct and encouraging. Format your response as exactly 6 bullet points. Each bullet must start with an emoji relevant to the category, followed by a colon, then the insight. No preamble. No summary. Just the 6 bullets.`;
    const userMessage = `Here is my habit data for the last 7 days:\n\n${JSON.stringify(entries, null, 2)}\n\nGive me my weekly insights.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview:generateContent?key=${finalApiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          system_instruction: {
            parts: { text: systemPrompt }
          },
          contents: [{
            parts: [{ text: userMessage }]
          }]
        })
      });

      if (!response.ok) {
        if (response.status === 400 || response.status === 403) {
          throw new Error("Invalid API Key — please check your Settings");
        }
        const err = await response.json();
        throw new Error(err.error?.message || "API Request failed");
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      
      const bullets = text.split('\n').filter(line => line.trim().length > 0);
      setAiInsights(bullets);
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 md:px-8 max-w-4xl mx-auto space-y-6">
      
      <section>
        <h2 className="font-heading font-extrabold text-[22px] text-white mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <StatCard label="Study hours (7d)" value={`${stats.studyHours}h`} icon={BookOpen} accent="coral" />
          <StatCard label="Workout streak" value={streak} icon={Flame} accent="amber" />
          <StatCard label="Avg sleep (7d)" value={`${stats.avgSleep}h`} icon={Moon} accent="purple" />
          <StatCard label="Avg diet rating" value={stats.avgDiet} icon={Apple} accent="teal" />
          <StatCard label="Spent (7d)" value={`₹${stats.spent}`} icon={Wallet} accent="amber" />
          <StatCard label="Comm. days (7d)" value={stats.commDays} icon={Mic} accent="coral" />
        </div>
      </section>

      <section>
        <GlassCard className="mt-8">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-heading font-bold text-xl text-white">AI Coach</h2>
            <Sparkles size={20} className="text-[var(--purple)]" />
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Powered by Gemini · analyzes your last 7 days</p>

          {numEntries < 3 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-black/20 rounded-xl border border-white/5">
              <div className="p-3 bg-white/5 rounded-full mb-3 text-[var(--text-muted)]">
                <Lock size={24} />
              </div>
              <p className="font-medium text-[var(--text-secondary)]">Log at least 3 days to unlock AI analysis</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Currently logged: {numEntries} days</p>
            </div>
          ) : (
            <div>
              {!aiInsights && !aiLoading && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateInsights}
                  className="w-full py-3 px-4 rounded-xl font-heading font-bold text-white shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--purple)] to-[var(--coral)]"
                >
                  Generate Insights →
                </motion.button>
              )}

              {aiLoading && (
                <div className="space-y-3">
                  <div className="h-4 bg-white/10 rounded-md animate-pulse w-3/4" />
                  <div className="h-4 bg-white/10 rounded-md animate-pulse w-full" />
                  <div className="h-4 bg-white/10 rounded-md animate-pulse w-5/6" />
                </div>
              )}

              {aiError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm mt-4">
                  {aiError}
                </div>
              )}

              {aiInsights && (
                <div className="space-y-4 mt-4 bg-black/20 p-5 rounded-xl border border-white/5">
                  {aiInsights.map((insight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span className="text-[var(--coral)] mt-0.5">▸</span>
                      <span className="text-[var(--text-primary)] text-[14px] leading-relaxed font-body">
                        {insight}
                      </span>
                    </motion.div>
                  ))}
                  <button 
                    onClick={generateInsights}
                    className="text-xs text-[var(--text-secondary)] hover:text-white mt-4 transition-colors"
                  >
                    Regenerate
                  </button>
                </div>
              )}
            </div>
          )}
        </GlassCard>
      </section>

    </div>
  );
}
