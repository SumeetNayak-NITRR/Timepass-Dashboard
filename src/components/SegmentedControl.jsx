import React from 'react';
import { motion } from 'framer-motion';

export default function SegmentedControl({ options, selected, onChange }) {
  return (
    <div className="flex p-1 bg-[#0a0a14] rounded-xl border border-[var(--border-glass)]">
      {options.map((option) => {
        const isSelected = selected === option;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`relative flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors z-10 ${
              isSelected ? 'text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="segmented-highlight"
                className="absolute inset-0 bg-[var(--bg-glass-hover)] border border-[var(--border-glass-bright)] rounded-lg z-[-1]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {option}
          </button>
        );
      })}
    </div>
  );
}
