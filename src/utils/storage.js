import { getTodayKey, getLastNDaysKeys } from './date';

export const getLog = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error('Failed to parse log from local storage', e);
    return null;
  }
};

export const saveLog = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getTodayLog = () => {
  return getLog(getTodayKey());
};

export const getLast7DaysEntries = () => {
  const keys = getLastNDaysKeys(7);
  const entries = {};
  keys.forEach(key => {
    const log = getLog(key);
    if (log) {
      entries[key] = log;
    }
  });
  return entries;
};

export const getAllLogs = () => {
  const logs = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('lifeos_log_')) {
      const log = getLog(key);
      if (log) {
        logs.push(log);
      }
    }
  }
  // Sort descending by date
  try {
    return logs.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (e) {
    console.error('Failed to sort logs', e);
    return logs;
  }
};

export const clearAllData = () => {
  localStorage.clear();
};
