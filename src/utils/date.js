/**
 * Returns today's date formatted as YYYY-MM-DD
 */
export const getTodayDateString = () => {
  const date = new Date();
  return date.toLocaleDateString('en-CA'); // 'en-CA' outputs YYYY-MM-DD
};

/**
 * Returns the key for today's log in localStorage
 */
export const getTodayKey = () => {
  return `lifeos_log_${getTodayDateString()}`;
};

/**
 * Returns an array of keys for the last n days (including today)
 */
export const getLastNDaysKeys = (n = 7) => {
  const keys = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    keys.push(`lifeos_log_${d.toLocaleDateString('en-CA')}`);
  }
  return keys;
};

/**
 * Generates a greeting based on current time
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};
