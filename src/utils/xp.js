import confetti from 'canvas-confetti';
import { getTodayDateString } from './date';

export function triggerConfetti() {
  confetti({ 
    particleCount: 120, 
    spread: 80, 
    origin: { y: 0.6 }, 
    colors: ['#FF6B6B', '#A855F7', '#2DD4BF'] 
  });
}

export function handleXPAndStreak(isNewEntry) {
  if (!isNewEntry) return; // updating existing entry gives no XP

  // XP
  const currentXP = parseInt(localStorage.getItem('lifeos_xp') || '0');
  localStorage.setItem('lifeos_xp', currentXP + 10);

  // Streak
  const today = getTodayDateString();
  const streakData = JSON.parse(localStorage.getItem('lifeos_streak') || '{"count":0,"lastDate":""}');
  
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toLocaleDateString('en-CA');

  if (streakData.lastDate === yesterday) {
    streakData.count += 1;
  } else if (streakData.lastDate !== today) {
    streakData.count = 1;
  }

  streakData.lastDate = today;
  localStorage.setItem('lifeos_streak', JSON.stringify(streakData));

  triggerConfetti();

  // Custom event to update UI components
  window.dispatchEvent(new Event('lifeos-stats-updated'));
}

export function getStats() {
  const xp = parseInt(localStorage.getItem('lifeos_xp') || '0');
  const streakData = JSON.parse(localStorage.getItem('lifeos_streak') || '{"count":0,"lastDate":""}');
  
  // Check if streak is broken
  const today = getTodayDateString();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toLocaleDateString('en-CA');

  if (streakData.lastDate !== today && streakData.lastDate !== yesterday && streakData.count > 0) {
    // Streak broken, but we don't update localstorage until they log again or strictly view it
    return { xp, streak: 0 };
  }

  return { xp, streak: streakData.count };
}
