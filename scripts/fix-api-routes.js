const fs = require('fs');
const path = require('path');

const files = [
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

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Add import at top if not present
  if (!content.includes("from '@/lib/storage'")) {
    const importMatch = content.match(/import.*from '@/types'/);
    if (importMatch) {
      content = content.replace(
        importMatch[0],
        importMatch[0] + "\nimport { loadData, saveData } from '@/lib/storage';"
      );
    }
  }

  // Replace fs operations
  content = content.replace(
    /const fs = require\('fs'\);\s*const path = require\('path'\);\s*const DATA_FILE = path\.join\(process\.cwd\(\), 'data', 'app\.json'\);/g,
    ''
  );

  // Replace file existence checks and reads
  content = content.replace(
    /if \(!fs\.existsSync\(DATA_FILE\)\) \{\s*return NextResponse\.json\(\{[^}]+\}\);\s*\}\s*const appData: AppData = JSON\.parse\(fs\.readFileSync\(DATA_FILE, 'utf-8'\)\);/g,
    'const appData = loadData();'
  );

  content = content.replace(
    /if \(!fs\.existsSync\(DATA_FILE\)\) \{\s*return NextResponse\.json\(\{[^}]+\}\);\s*\}\s*const appData: AppData = JSON\.parse\(fs\.readFileSync\(DATA_FILE, 'utf-8'\)\);/g,
    'const appData = loadData();'
  );

  content = content.replace(
    /let appData: AppData = \{[^}]+\};\s*if \(fs\.existsSync\(DATA_FILE\)\) \{\s*appData = JSON\.parse\(fs\.readFileSync\(DATA_FILE, 'utf-8'\)\);\s*\}/g,
    'let appData = loadData();'
  );

  // Replace save operations
  content = content.replace(
    /const DATA_DIR = path\.join\(process\.cwd\(\), 'data'\);\s*if \(!fs\.existsSync\(DATA_DIR\)\) \{\s*fs\.mkdirSync\(DATA_DIR, \{ recursive: true \}\);\s*\}\s*fs\.writeFileSync\(DATA_FILE, JSON\.stringify\(appData, null, 2\), 'utf-8'\);/g,
    'saveData(appData);'
  );

  content = content.replace(
    /fs\.writeFileSync\(DATA_FILE, JSON\.stringify\(appData, null, 2\), 'utf-8'\);/g,
    'saveData(appData);'
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file}`);
});

console.log('Done!');
