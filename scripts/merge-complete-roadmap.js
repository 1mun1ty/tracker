// Complete roadmap merger - Merge detailed Phase 0-1 with expanded phases 2-11
const fs = require('fs');
const path = require('path');

// Load detailed Phase 0-1 tasks
const phase01Data = JSON.parse(fs.readFileSync(path.join(__dirname, 'tasks-phase0-1.json'), 'utf8'));
const allTasks = [...phase01Data.tasks];

console.log(`Loaded ${allTasks.length} detailed tasks from Phase 0-1`);

// Now we need to add phases 2-11 with full detail
// The generate-full-initialdata.js has phases 2-11 but they're condensed
// We need to expand them with the same level of detail as Phase 0-1

// For now, let's use the existing generate-full-initialdata.js approach
// but we'll expand it further with more detailed tasks

// Actually, the best approach is to:
// 1. Use detailed Phase 0-1 (already loaded) ✓
// 2. Run generate-full-initialdata.js to get phases 2-11
// 3. Merge them together
// 4. Expand phases 2-11 with more detail

// Let me create a function to load tasks from generate-full-initialdata.js
// and merge them, avoiding duplicates

function createTask(id, title, description, phase, month, week, priority, hours, tags = [], deps = []) {
  return {
    id,
    title,
    description: description || title,
    status: 'pending',
    priority,
    phaseId: `phase-${t.phase}`,
    monthId: month !== undefined ? `month-${month}` : undefined,
    weekId: week !== undefined ? `week-${month}-${week}` : undefined,
    estimatedHours: hours,
    actualHours: 0,
    tags,
    dependencies: deps,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Load existing tasks from generate-full-initialdata.js by running it
// Actually, let me just read the existing initialData.ts and extract tasks from phases 2-11
// Then merge with detailed Phase 0-1

try {
  const existingData = fs.readFileSync(path.join(__dirname, '..', 'lib', 'initialData.ts'), 'utf8');
  
  // Extract task IDs to check what we have
  const existingTaskIds = new Set();
  const taskIdRegex = /id: 'task-(\d+)-/g;
  let match;
  while ((match = taskIdRegex.exec(existingData)) !== null) {
    const phaseNum = parseInt(match[1]);
    if (phaseNum >= 2) {
      existingTaskIds.add(match[0]);
    }
  }
  
  console.log(`Found ${existingTaskIds.size} existing tasks from phases 2-11`);
  
  // Now we need to add the existing phases 2-11 tasks
  // But we want to expand them with more detail
  
  // For now, let's use the generate-full-initialdata.js approach
  // which already has phases 2-11 defined
  
} catch (e) {
  console.log('Could not read existing file');
}

// The best approach: Use generate-full-initialdata.js to get phases 2-11
// Then merge with detailed Phase 0-1, avoiding duplicates

// Actually, let me just run generate-full-initialdata.js and merge the results
// But first, let me check what tasks we already have from Phase 0-1

const phase01TaskIds = new Set(allTasks.map(t => t.id));
console.log(`Phase 0-1 has ${phase01TaskIds.size} unique tasks`);

// Now I need to add phases 2-11
// The generate-full-initialdata.js script has these phases defined
// Let me extract and add them

// For a complete solution, I should:
// 1. Keep detailed Phase 0-1 tasks ✓
// 2. Load phases 2-11 from generate-full-initialdata.js
// 3. Expand phases 2-11 with more detail (day-by-day, learning, practice, projects, checkpoints)
// 4. Generate complete file

// Given the massive scope, let me create a script that does this step by step
// For now, let me generate the file with what we have and note that phases 2-11 need expansion

console.log(`Total tasks so far: ${allTasks.length}`);
console.log('Note: Need to add and expand phases 2-11 with full detail');

// Save current state
const output = {
  tasks: allTasks,
  total: allTasks.length,
  note: 'Phases 2-11 need to be added and expanded with full detail'
};

fs.writeFileSync(
  path.join(__dirname, 'tasks-current-state.json'),
  JSON.stringify(output, null, 2)
);

console.log('Saved current state to tasks-current-state.json');
console.log('Next step: Add and expand phases 2-11 with full detail');
