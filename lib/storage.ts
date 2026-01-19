import { AppData } from '@/types';

// In-memory storage for serverless environments (temporary per-instance)
let memoryStore: AppData | null = null;

// Check if we're in a serverless environment (read-only file system)
function isServerless(): boolean {
  if (typeof process === 'undefined') return false;
  
  // Check for Vercel or other serverless indicators
  return process.env.VERCEL === '1' || 
         process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined ||
         (process.env.NODE_ENV === 'production' && !process.env.ALLOW_FILE_WRITE);
}

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

  // Try file system first (for local development)
  if (!isServerless()) {
    try {
      const fs = require('fs');
      const path = require('path');
      const DATA_FILE = path.join(process.cwd(), 'data', 'app.json');
      
      if (fs.existsSync(DATA_FILE)) {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      }
    } catch (error) {
      // Fall through to memory store
    }
  }

  // Use in-memory store for serverless (per-instance, doesn't persist)
  if (!memoryStore) {
    memoryStore = defaultData;
  }

  return memoryStore;
}

export function saveData(data: AppData): void {
  data.lastUpdated = new Date().toISOString();

  // Try file system first (for local development)
  if (!isServerless()) {
    try {
      const fs = require('fs');
      const path = require('path');
      const DATA_DIR = path.join(process.cwd(), 'data');
      const DATA_FILE = path.join(DATA_DIR, 'app.json');
      
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return;
    } catch (error: any) {
      // If it's a read-only file system error, use memory store
      if (error.code === 'EROFS' || error.message?.includes('read-only')) {
        console.warn('File system is read-only, using memory store (data will not persist)');
        memoryStore = data;
        return;
      }
      throw error;
    }
  }

  // Use in-memory store for serverless
  memoryStore = data;
}

// Note: In-memory storage is per-instance and doesn't persist across serverless function invocations
// For production, you should use a database (PostgreSQL, MongoDB, Vercel KV, etc.)
// This is a temporary solution for demo purposes
