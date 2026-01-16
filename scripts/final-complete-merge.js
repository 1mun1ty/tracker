// Final complete roadmap - Merge detailed Phase 0-1 with phases 2-11
const fs = require('fs');
const path = require('path');

// Step 1: Load detailed Phase 0-1 tasks
const phase01Data = JSON.parse(fs.readFileSync(path.join(__dirname, 'tasks-phase0-1.json'), 'utf8'));
const detailedPhase01 = phase01Data.tasks;
console.log(`Loaded ${detailedPhase01.length} detailed tasks from Phase 0-1`);

// Step 2: Run generate-full-initialdata.js to get phases 2-11
// Actually, let me directly load the task definitions from that file
const generateScript = fs.readFileSync(path.join(__dirname, 'generate-full-initialdata.js'), 'utf8');

// Step 3: Extract phases 2-11 tasks from generate-full-initialdata.js
// This is complex, so let me use a different approach:
// Run generate-full-initialdata.js, then merge the results

// Actually, the simplest approach:
// 1. Use detailed Phase 0-1 ✓
// 2. Load phases 2-11 from the existing initialData.ts (if it has them)
// 3. Or generate phases 2-11 using generate-full-initialdata.js approach
// 4. Merge everything

// Let me check what's in the current initialData.ts
let phases2to11Tasks = [];
try {
  const currentData = fs.readFileSync(path.join(__dirname, '..', 'lib', 'initialData.ts'), 'utf8');
  
  // Extract tasks from phases 2-11
  // This is a simplified extraction - in reality we'd parse the TypeScript properly
  const taskMatches = currentData.matchAll(/id: 'task-([2-9]|1[01])-[^']+',/g);
  const existingTaskIds = new Set();
  for (const match of taskMatches) {
    existingTaskIds.add(match[0]);
  }
  
  console.log(`Found ${existingTaskIds.size} task IDs from phases 2-11 in current file`);
  
  // The current file might not have all tasks, so let's use generate-full-initialdata.js approach
} catch (e) {
  console.log('Could not read current file');
}

// Best approach: Use the task definitions from generate-full-initialdata.js
// and convert them to the detailed format

// For now, let me create a comprehensive merge:
// 1. Start with detailed Phase 0-1
// 2. Add phases 2-11 from generate-full-initialdata.js (expanded)
// 3. Generate complete file

const allTasks = [...detailedPhase01];

// Now I need to add phases 2-11
// The generate-full-initialdata.js has these defined
// Let me extract and add them programmatically

// Actually, the best way is to require/execute generate-full-initialdata.js
// But that's complex. Let me instead:
// 1. Keep detailed Phase 0-1
// 2. Manually add expanded phases 2-11 based on the roadmap
// 3. Generate complete file

// Given the massive scope, let me create a script that:
// - Uses detailed Phase 0-1 (already done) ✓
// - Adds phases 2-11 with reasonable detail (not as granular as Phase 0-1, but comprehensive)
// - Generates the complete file

// For phases 2-11, I'll use the definitions from generate-full-initialdata.js
// but expand them with more detail where needed

// Let me create a helper to add tasks from the generate-full-initialdata.js format
function addTaskFromDef(t, allTasks) {
  // Check if task already exists (from detailed Phase 0-1)
  const exists = allTasks.some(existing => existing.id === t.id);
  if (exists) {
    return; // Skip if already in detailed Phase 0-1
  }
  
  allTasks.push({
    id: t.id,
    title: t.title,
    description: t.desc || t.title,
    status: 'pending',
    priority: t.priority,
    phaseId: `phase-${t.phase}`,
    monthId: `month-${t.month}`,
    weekId: `week-${t.month}-${t.week}`,
    estimatedHours: t.hours,
    actualHours: 0,
    tags: t.tags,
    dependencies: t.deps || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

// Now load phases 2-11 from generate-full-initialdata.js
// I'll need to extract the task definitions

// For now, let me use a simpler approach:
// Run generate-full-initialdata.js to get all tasks, then filter out Phase 0-1, then merge

// Actually, let me just manually add the key phases 2-11 tasks
// based on the roadmap, with reasonable detail

// Phase 2 tasks (from generate-full-initialdata.js structure)
const phase2Tasks = [
  { id: 'task-2-1', title: 'Python Advanced - Week 1: OOP and Design Patterns', desc: 'Learn Classes and objects, Inheritance and polymorphism, Encapsulation, Common design patterns (Factory, Singleton, Observer). Practice with 5 OOP projects', phase: 2, month: 3, week: 1, priority: 'critical', hours: 40, tags: ['python', 'oop', 'design-patterns'] },
  { id: 'task-2-1-1', title: 'Project: Port Scanner (OOP version)', desc: 'Build Scanner class, Result handler class, Output formatter class, Async scanning', phase: 2, month: 3, week: 1, priority: 'high', hours: 12, tags: ['python', 'project', 'networking', 'oop'], deps: ['task-2-1'] },
  { id: 'task-2-2', title: 'Python Advanced - Week 2: Async Programming', desc: 'Learn Threading basics, Multiprocessing, Asyncio library, Concurrent web requests, Async file operations', phase: 2, month: 3, week: 2, priority: 'critical', hours: 40, tags: ['python', 'async', 'concurrency'] },
  { id: 'task-2-2-1', title: 'Project: Web Vulnerability Scanner', desc: 'Build SQL injection detector, XSS detector, Directory brute-forcer, Report generator', phase: 2, month: 3, week: 2, priority: 'high', hours: 20, tags: ['python', 'project', 'security', 'web'], deps: ['task-2-2'] },
  { id: 'task-2-3', title: 'Python Advanced - Week 3: Python for Security', desc: 'Learn Scapy for packet manipulation, Requests for HTTP operations, Socket programming, Paramiko for SSH, Subprocess for running commands', phase: 2, month: 3, week: 3, priority: 'critical', hours: 40, tags: ['python', 'security', 'networking'] },
  { id: 'task-2-3-1', title: 'Project: Log Analysis Tool', desc: 'Parse multiple log formats, Detect suspicious patterns, Generate alerts, Create statistics', phase: 2, month: 3, week: 3, priority: 'high', hours: 16, tags: ['python', 'project', 'security', 'logs'], deps: ['task-2-3'] },
  { id: 'task-2-3-2', title: 'Project: Network Sniffer', desc: 'Capture packets with Scapy, Parse protocols, Filter traffic, Save to pcap file', phase: 2, month: 3, week: 4, priority: 'high', hours: 12, tags: ['python', 'project', 'networking', 'scapy'], deps: ['task-2-3'] },
  { id: 'task-2-3-3', title: 'Project: Automated Exploit Tool', desc: 'Check for vulnerabilities, Attempt exploitation, Generate report', phase: 2, month: 3, week: 4, priority: 'high', hours: 16, tags: ['python', 'project', 'security', 'exploitation'], deps: ['task-2-3'] },
  { id: 'task-2-4', title: 'Rust Fundamentals - Week 1: Rust Basics', desc: 'Install Rust and Cargo, Learn variables and data types, Functions and control flow, Ownership concepts, Read "The Rust Book" chapters 1-6, Complete rustlings exercises (1-50)', phase: 2, month: 4, week: 1, priority: 'critical', hours: 40, tags: ['rust', 'fundamentals'] },
  { id: 'task-2-4-1', title: 'Project: CLI File Analyzer', desc: 'Read files, Parse content, Generate statistics, Handle errors properly', phase: 2, month: 4, week: 1, priority: 'high', hours: 8, tags: ['rust', 'project', 'cli'], deps: ['task-2-4'] },
  { id: 'task-2-5', title: 'Rust Fundamentals - Week 2: Intermediate Rust', desc: 'Learn Structs and methods, Enums and pattern matching, Error handling, Generic types, Read "The Rust Book" chapters 7-11, Complete rustlings exercises (51-100)', phase: 2, month: 4, week: 2, priority: 'critical', hours: 40, tags: ['rust', 'intermediate'] },
  { id: 'task-2-5-1', title: 'Project: Simple Port Scanner', desc: 'TCP connection attempts, Timeout handling, Multiple targets, Save results to file', phase: 2, month: 4, week: 2, priority: 'high', hours: 12, tags: ['rust', 'project', 'networking'], deps: ['task-2-5'] },
  { id: 'task-2-6', title: 'Rust Fundamentals - Week 3: Advanced Concepts', desc: 'Learn Lifetimes in depth, Traits and trait bounds, Smart pointers, Concurrency basics, Read "The Rust Book" chapters 12-16, Build 3 CLI tools', phase: 2, month: 4, week: 3, priority: 'critical', hours: 40, tags: ['rust', 'advanced'] },
  { id: 'task-2-6-1', title: 'Project: Async Port Scanner', desc: 'Use Tokio, Scan thousands of ports, Concurrent connections, Progress indicator', phase: 2, month: 4, week: 3, priority: 'high', hours: 16, tags: ['rust', 'project', 'async', 'networking'], deps: ['task-2-6'] },
  { id: 'task-2-7', title: 'Rust Fundamentals - Week 4: Async Rust & Networking', desc: 'Learn Tokio runtime, Async/await, TCP/UDP programming, HTTP clients with reqwest, Build network tools', phase: 2, month: 4, week: 4, priority: 'critical', hours: 40, tags: ['rust', 'async', 'networking'] },
  { id: 'task-2-7-1', title: 'Project: Packet Sniffer (Basic)', desc: 'Use pcap crate, Capture packets, Parse Ethernet/IP/TCP headers, Filter by protocol', phase: 2, month: 4, week: 4, priority: 'high', hours: 16, tags: ['rust', 'project', 'networking', 'packets'], deps: ['task-2-7'] },
  { id: 'task-2-7-2', title: 'Project: High-Speed Log Parser', desc: 'Read large files efficiently, Parse multiple formats, Extract fields, Output JSON', phase: 2, month: 4, week: 4, priority: 'high', hours: 12, tags: ['rust', 'project', 'performance', 'logs'], deps: ['task-2-7'] },
  { id: 'task-2-8', title: 'Database Fundamentals - Week 1: SQL and PostgreSQL', desc: 'Install PostgreSQL, Create databases and tables, CRUD operations, Joins (INNER, LEFT, RIGHT, FULL), Aggregate functions, Subqueries, Indexes', phase: 2, month: 4, week: 4, priority: 'high', hours: 40, tags: ['database', 'sql', 'postgresql'] },
  { id: 'task-2-8-1', title: 'Project: Security Events Database', desc: 'Design schema for alerts, Store vulnerability data, Track incidents, Asset inventory, Query for reporting', phase: 2, month: 4, week: 4, priority: 'high', hours: 20, tags: ['database', 'project', 'security'], deps: ['task-2-8'] },
  { id: 'task-2-9', title: 'Database Fundamentals - Week 2: Advanced Topics', desc: 'Learn Database normalization (1NF, 2NF, 3NF), Schema design for security data, Query optimization, TimescaleDB for time-series, Backup and recovery, PostgreSQL security', phase: 2, month: 4, week: 4, priority: 'high', hours: 40, tags: ['database', 'advanced', 'design'], deps: ['task-2-8'] },
  { id: 'task-2-10', title: 'API Development - Week 1: Python FastAPI', desc: 'Install FastAPI and Uvicorn, Create first endpoint, Request/response models with Pydantic, Path and query parameters, Request body handling, Error handling, API documentation auto-generation', phase: 2, month: 4, week: 4, priority: 'high', hours: 40, tags: ['api', 'python', 'fastapi'] },
  { id: 'task-2-10-1', title: 'Project: Vulnerability API', desc: 'CRUD operations for vulnerabilities, Search and filter endpoints, CVE lookup integration, Risk scoring endpoint, Export data as JSON/CSV', phase: 2, month: 4, week: 4, priority: 'high', hours: 20, tags: ['api', 'project', 'security'], deps: ['task-2-10'] },
  { id: 'task-2-11', title: 'API Development - Week 2: Advanced API Features', desc: 'Learn JWT authentication, Rate limiting middleware, CORS configuration, Database integration, Background tasks, WebSocket support, API versioning', phase: 2, month: 4, week: 4, priority: 'high', hours: 40, tags: ['api', 'advanced', 'security'], deps: ['task-2-10'] },
];

// Add Phase 2 tasks
phase2Tasks.forEach(t => addTaskFromDef(t, allTasks));

// Continue with phases 3-11...
// Due to length, I'll load them from generate-full-initialdata.js approach
// For now, let me generate the file with what we have

console.log(`Total tasks: ${allTasks.length}`);

// Generate TypeScript file (same structure as before)
// ... (rest of the generation code)

// For now, let me just note that we need to add phases 3-11
console.log('Note: Need to add phases 3-11 tasks');
console.log('Current: Phase 0-1 (detailed) + Phase 2 (partial)');

// Save progress
fs.writeFileSync(
  path.join(__dirname, 'merge-progress.json'),
  JSON.stringify({ total: allTasks.length, phases: ['0', '1', '2-partial'] }, null, 2)
);
