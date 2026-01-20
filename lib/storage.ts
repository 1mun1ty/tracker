import { AppData } from '@/types';
import initialData from '@/data/app.json';

// Check if we're on Vercel
const isVercel = process.env.VERCEL === '1';
const TMP_DATA_FILE = '/tmp/app-data.json';

export function loadData(): AppData {
  const defaultData: AppData = {
    workspaces: [],
    projects: [],
    tasks: [],
    comments: [],
    attachments: [],
    timeEntries: [],
    activities: [],
    notifications: [],
    views: [],
    stats: {},
    lastUpdated: new Date().toISOString(),
  };

  try {
    const fs = require('fs');
    const path = require('path');
    
    // On Vercel, check /tmp first for any saved data
    if (isVercel) {
      if (fs.existsSync(TMP_DATA_FILE)) {
        return JSON.parse(fs.readFileSync(TMP_DATA_FILE, 'utf-8'));
      }
      // Use imported initial data on Vercel (bundled at build time)
      return initialData as unknown as AppData;
    }
    
    // Local development: Load from file system
    const DATA_FILE = path.join(process.cwd(), 'data', 'app.json');
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (error) {
    console.error('Error loading data:', error);
    // Fallback to imported data
    if (initialData) {
      return initialData as unknown as AppData;
    }
  }

  return defaultData;
}

export function saveData(data: AppData): void {
  data.lastUpdated = new Date().toISOString();

  try {
    const fs = require('fs');
    const path = require('path');
    
    // On Vercel, use /tmp directory (writable but ephemeral)
    if (isVercel) {
      fs.writeFileSync(TMP_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return;
    }
    
    // Local development: use data directory
    const DATA_DIR = path.join(process.cwd(), 'data');
    const DATA_FILE = path.join(DATA_DIR, 'app.json');
    
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Note: On Vercel, /tmp storage is ephemeral and shared within a single invocation
// Data may not persist across different function instances
// For production persistence, use a database (Vercel KV, Postgres, etc.)
