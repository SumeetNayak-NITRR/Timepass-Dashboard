import { useState, useEffect } from 'react';
import { getStats } from '../utils/xp';

export function useStats() {
  const [stats, setStats] = useState(getStats());

  useEffect(() => {
    const handleUpdate = () => {
      setStats(getStats());
    };

    window.addEventListener('lifeos-stats-updated', handleUpdate);
    return () => window.removeEventListener('lifeos-stats-updated', handleUpdate);
  }, []);

  return stats;
}
