// Script to update all API routes to use storage utility
const fs = require('fs');
const path = require('path');

const apiRoutes = [
  'app/api/workspaces/route.ts',
  'app/api/workspaces/[id]/route.ts',
  'app/api/projects/route.ts',
  'app/api/projects/[id]/route.ts',
  'app/api/tasks/route.ts',
  'app/api/tasks/[id]/route.ts',
  'app/api/comments/route.ts',
  'app/api/comments/[id]/route.ts',
  'app/api/time-entries/route.ts',
  'app/api/notifications/route.ts',
];

// Replace patterns
const replacements = [
  {
    // Replace fs require and file operations
    pattern: /const fs = require\('fs'\);\s*const path = require\('path'\);\s*const DATA_FILE = path\.join\(process\.cwd\(\), 'data', 'app\.json'\);/g,
    replacement: "import { loadData, saveData } from '@/lib/storage';"
  },
  {
    // Replace file existence check and read
    pattern: /let appData: AppData = \{[^}]+\};\s*if \(fs\.existsSync\(DATA_FILE\)\) \{\s*appData = JSON\.parse\(fs\.readFileSync\(DATA_FILE, 'utf-8'\)\);\s*\}/g,
    replacement: 'let appData = loadData();'
  },
  {
    // Replace simple loadData
    pattern: /if \(!fs\.existsSync\(DATA_FILE\)\) \{\s*return NextResponse\.json\(\{[^}]+\}\);\s*\}\s*const appData: AppData = JSON\.parse\(fs\.readFileSync\(DATA_FILE, 'utf-8'\)\);/g,
    replacement: 'const appData = loadData();'
  },
  {
    // Replace save operations
    pattern: /const DATA_DIR = path\.join\(process\.cwd\(\), 'data'\);\s*if \(!fs\.existsSync\(DATA_DIR\)\) \{\s*fs\.mkdirSync\(DATA_DIR, \{ recursive: true \}\);\s*\}\s*fs\.writeFileSync\(DATA_FILE, JSON\.stringify\(appData, null, 2\), 'utf-8'\);/g,
    replacement: 'saveData(appData);'
  },
  {
    // Replace simple writeFileSync
    pattern: /fs\.writeFileSync\(DATA_FILE, JSON\.stringify\(appData, null, 2\), 'utf-8'\);/g,
    replacement: 'saveData(appData);'
  },
];

console.log('This script would update API routes. Run manually or use search-replace tool instead.');
