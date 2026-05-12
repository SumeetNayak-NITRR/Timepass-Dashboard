import React from 'react';
import GlassCard from './GlassCard';
import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon: Icon, accent }) {
  // Mapping accent strings to CSS variable classes or hex
  const accentColors = {
    coral: 'text-[#FF6B6B]',
    purple: 'text-[#A855F7]',
    teal: 'text-[#2DD4BF]',
    amber: 'text-[#FBBF24]',
  };
  
  const bgDimColors = {
    coral: 'bg-[#FF6B6B]/15',
    purple: 'bg-[#A855F7]/15',
    teal: 'bg-[#2DD4BF]/15',
    amber: 'bg-[#FBBF24]/15',
  };

  const textColor = accentColors[accent] || 'text-white';
  const bgColor = bgDimColors[accent] || 'bg-white/10';

  return (
    <GlassCard className="flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-start mb-2">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
          className={`font-heading font-extrabold text-[28px] ${textColor} leading-none`}
        >
          {value}
        </motion.div>
        {Icon && (
          <div className={`p-1.5 rounded-full ${bgColor} ${textColor}`}>
            <Icon size={16} strokeWidth={2.5} />
          </div>
        )}
      </div>
      <div className="font-body text-[11px] text-[var(--text-muted)] mt-1">
        {label}
      </div>
    </GlassCard>
  );
}
