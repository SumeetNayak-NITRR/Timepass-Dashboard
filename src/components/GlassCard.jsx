import React from 'react';

export default function GlassCard({ children, className = '', onClick }) {
  return (
    <div 
      className={`glass-card p-5 ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
