import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iondgewpivpguuvhbicm.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_2lPfguY6rLmjClAmfV5uRg_WK3SLQ_X';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Storage helper with fallback to localStorage
export const LocalStorageManager = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(`isb_deals_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(`isb_deals_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }
};

