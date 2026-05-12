import React from 'react';
import { motion } from 'framer-motion';

export default function EmojiRating({ emojis, rating, onChange }) {
  return (
    <div className="flex gap-2 justify-between bg-[#0a0a14] p-2 rounded-xl border border-[var(--border-glass)]">
      {emojis.map((emoji, index) => {
        const value = index + 1;
        const isSelected = value === rating;
        
        return (
          <motion.button
            key={value}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(value)}
            className={`text-2xl transition-all ${
              isSelected ? 'scale-110 opacity-100 drop-shadow-md' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-80'
            }`}
          >
            {emoji}
          </motion.button>
        );
      })}
    </div>
  );
}
