import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StarRating({ rating, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <Star
            size={24}
            className={`transition-colors ${
              star <= rating 
                ? 'fill-[var(--coral)] text-[var(--coral)]' 
                : 'text-[var(--border-glass-bright)]'
            }`}
          />
        </motion.button>
      ))}
    </div>
  );
}
