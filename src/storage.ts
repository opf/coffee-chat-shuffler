import type { AppData } from './types';

const STORAGE_KEY = 'coffee-chat-data';

const DEFAULT_DATA: AppData = {
  people: [],
  history: [],
  groupSize: 3,
};

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    return { ...DEFAULT_DATA, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
