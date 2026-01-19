// Helper to update all API routes to use storage utility
// This file provides a template for manual updates

/*
To update an API route file:

1. Add import at top:
   import { loadData, saveData } from '@/lib/storage';

2. Replace file reading:
   OLD: const fs = require('fs');
        const path = require('path');
        const DATA_FILE = path.join(process.cwd(), 'data', 'app.json');
        if (!fs.existsSync(DATA_FILE)) { return ... }
        const appData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
   
   NEW: const appData = loadData();

3. Replace file writing:
   OLD: const DATA_DIR = path.join(process.cwd(), 'data');
        if (!fs.existsSync(DATA_DIR)) { fs.mkdirSync(...) }
        fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2), 'utf-8');
   
   NEW: saveData(appData);

4. Replace initialization:
   OLD: let appData: AppData = { ... };
        if (fs.existsSync(DATA_FILE)) {
          appData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        }
   
   NEW: let appData = loadData();
*/

export {};
