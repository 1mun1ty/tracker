// Complete generator for initialData.ts with ALL tasks from the roadmap
const fs = require('fs');
const path = require('path');

// This will generate the complete TypeScript file
// Due to the massive scope, I'll create a template and systematically add all tasks

const phasesCode = `const phases: Phase[] = [
  {
    id: 'phase-0',
    title: 'Phase 0: Absolute Basics',
    description: 'Week 0 - Before Starting: Computer setup, programming fundamentals, networking basics',
    type: 'foundation',
    monthStart: 0,
    monthEnd: 0,
    status: 'pending',
    color: '#6B7280',
  },
  {
    id: 'phase-1',
    title: 'Phase 1: Security Fundamentals',
    description: 'Months 1-2: Security concepts, web app security, network security, Linux, certifications',
    type: 'foundation',
    monthStart: 1,
    monthEnd: 2,
    status: 'pending',
    color: '#3B82F6',
  },
  {
    id: 'phase-2',
    title: 'Phase 2: Programming Mastery',
    description: 'Months 3-4: Python advanced, Rust fundamentals, databases, API development',
    type: 'development',
    monthStart: 3,
    monthEnd: 4,
    status: 'pending',
    color: '#8B5CF6',
  },
  {
    id: 'phase-3',
    title: 'Phase 3: AI & Machine Learning',
    description: 'Months 5-6: ML basics, deep learning, LLMs, LangChain, vector databases',
    type: 'development',
    monthStart: 5,
    monthEnd: 6,
    status: 'pending',
    color: '#10B981',
  },
  {
    id: 'phase-4',
    title: 'Phase 4: System Architecture',
    description: 'Month 7: Microservices, database design, API architecture, dev environment',
    type: 'architecture',
    monthStart: 7,
    monthEnd: 7,
    status: 'pending',
    color: '#F59E0B',
  },
  {
    id: 'phase-5',
    title: 'Phase 5: Build Rust Services',
    description: 'Months 8-9: Scanner service, parser service, API gateway, service integration',
    type: 'development',
    monthStart: 8,
    monthEnd: 9,
    status: 'pending',
    color: '#EF4444',
  },
  {
    id: 'phase-6',
    title: 'Phase 6: Build Python AI Services',
    description: 'Months 10-11: SOC agent, Pentest agent, multi-agent orchestration, RAG system',
    type: 'development',
    monthStart: 10,
    monthEnd: 11,
    status: 'pending',
    color: '#06B6D4',
  },
  {
    id: 'phase-7',
    title: 'Phase 7: Frontend Development',
    description: 'Months 12-13: React setup, authentication, SOC dashboard, Pentest interface, asset management',
    type: 'frontend',
    monthStart: 12,
    monthEnd: 13,
    status: 'pending',
    color: '#EC4899',
  },
  {
    id: 'phase-8',
    title: 'Phase 8: Integration & Testing',
    description: 'Month 14: Backend-frontend integration, third-party integrations, testing suite, security testing',
    type: 'hardening',
    monthStart: 14,
    monthEnd: 14,
    status: 'pending',
    color: '#14B8A6',
  },
  {
    id: 'phase-9',
    title: 'Phase 9: Production Deployment',
    description: 'Month 15: Cloud infrastructure, database setup, container deployment, monitoring, CI/CD',
    type: 'hardening',
    monthStart: 15,
    monthEnd: 15,
    status: 'pending',
    color: '#84CC16',
  },
  {
    id: 'phase-10',
    title: 'Phase 10: Security Hardening',
    description: 'Month 16: Authentication & authorization, data protection, compliance preparation',
    type: 'hardening',
    monthStart: 16,
    monthEnd: 16,
    status: 'pending',
    color: '#F97316',
  },
  {
    id: 'phase-11',
    title: 'Phase 11: Beta Testing & Launch',
    description: 'Month 17-18: Beta customer onboarding, feedback collection, commercial launch preparation',
    type: 'launch',
    monthStart: 17,
    monthEnd: 18,
    status: 'pending',
    color: '#A855F7',
  },
];`;

// Helper function to generate task code
function generateTaskCode(task) {
  const deps = task.dependencies && task.dependencies.length > 0 
    ? `dependencies: [${task.dependencies.map(d => `'${d}'`).join(', ')}],`
    : '';
  
  return `    {
      id: '${task.id}',
      title: ${JSON.stringify(task.title)},
      description: ${JSON.stringify(task.description || task.title)},
      status: 'pending',
      priority: '${task.priority}',
      phaseId: '${task.phaseId}',
      ${task.monthId ? `monthId: '${task.monthId}',` : ''}
      ${task.weekId ? `weekId: '${task.weekId}',` : ''}
      estimatedHours: ${task.estimatedHours},
      tags: [${task.tags.map(t => JSON.stringify(t)).join(', ')}],
      ${deps}
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }`;
}

// Load detailed Phase 0-1 tasks
let allTasks = [];
try {
  const phase01Data = JSON.parse(fs.readFileSync(path.join(__dirname, 'tasks-phase0-1.json'), 'utf8'));
  allTasks = [...phase01Data.tasks];
  console.log(`Loaded ${allTasks.length} detailed tasks from Phase 0-1`);
} catch (e) {
  console.log('Could not load detailed Phase 0-1 tasks, starting fresh');
  allTasks = [];
}

// Add Phase 2 tasks (Programming Mastery - Months 3-4)
const phase2Tasks = [
  // Python Advanced
  { id: 'task-2-1', title: 'Python Advanced - Week 1: OOP and Design Patterns', desc: 'Learn Classes and objects, Inheritance and polymorphism, Encapsulation, Common design patterns (Factory, Singleton, Observer). Practice with 5 OOP projects', phase: 2, month: 3, week: 1, priority: 'critical', hours: 40, tags: ['python', 'oop', 'design-patterns'] },
  { id: 'task-2-1-1', title: 'Project: Port Scanner (OOP version)', desc: 'Build Scanner class, Result handler class, Output formatter class, Async scanning', phase: 2, month: 3, week: 1, priority: 'high', hours: 12, tags: ['python', 'project', 'networking', 'oop'], deps: ['task-2-1'] },
  { id: 'task-2-2', title: 'Python Advanced - Week 2: Async Programming', desc: 'Learn Threading basics, Multiprocessing, Asyncio library, Concurrent web requests, Async file operations', phase: 2, month: 3, week: 2, priority: 'critical', hours: 40, tags: ['python', 'async', 'concurrency'] },
  { id: 'task-2-2-1', title: 'Project: Web Vulnerability Scanner', desc: 'Build SQL injection detector, XSS detector, Directory brute-forcer, Report generator', phase: 2, month: 3, week: 2, priority: 'high', hours: 20, tags: ['python', 'project', 'security', 'web'], deps: ['task-2-2'] },
  { id: 'task-2-3', title: 'Python Advanced - Week 3: Python for Security', desc: 'Learn Scapy for packet manipulation, Requests for HTTP operations, Socket programming, Paramiko for SSH, Subprocess for running commands', phase: 2, month: 3, week: 3, priority: 'critical', hours: 40, tags: ['python', 'security', 'networking'] },
  { id: 'task-2-3-1', title: 'Project: Log Analysis Tool', desc: 'Parse multiple log formats, Detect suspicious patterns, Generate alerts, Create statistics', phase: 2, month: 3, week: 3, priority: 'high', hours: 16, tags: ['python', 'project', 'security', 'logs'], deps: ['task-2-3'] },
  { id: 'task-2-3-2', title: 'Project: Network Sniffer', desc: 'Capture packets with Scapy, Parse protocols, Filter traffic, Save to pcap file', phase: 2, month: 3, week: 4, priority: 'high', hours: 12, tags: ['python', 'project', 'networking', 'scapy'], deps: ['task-2-3'] },
  { id: 'task-2-3-3', title: 'Project: Automated Exploit Tool', desc: 'Check for vulnerabilities, Attempt exploitation, Generate report', phase: 2, month: 3, week: 4, priority: 'high', hours: 16, tags: ['python', 'project', 'security', 'exploitation'], deps: ['task-2-3'] },
  
  // Rust Fundamentals
  { id: 'task-2-4', title: 'Rust Fundamentals - Week 1: Rust Basics', desc: 'Install Rust and Cargo, Learn variables and data types, Functions and control flow, Ownership concepts, Read "The Rust Book" chapters 1-6, Complete rustlings exercises (1-50)', phase: 2, month: 4, week: 1, priority: 'critical', hours: 40, tags: ['rust', 'fundamentals'] },
  { id: 'task-2-4-1', title: 'Project: CLI File Analyzer', desc: 'Read files, Parse content, Generate statistics, Handle errors properly', phase: 2, month: 4, week: 1, priority: 'high', hours: 8, tags: ['rust', 'project', 'cli'], deps: ['task-2-4'] },
  { id: 'task-2-5', title: 'Rust Fundamentals - Week 2: Intermediate Rust', desc: 'Learn Structs and methods, Enums and pattern matching, Error handling, Generic types, Read "The Rust Book" chapters 7-11, Complete rustlings exercises (51-100)', phase: 2, month: 4, week: 2, priority: 'critical', hours: 40, tags: ['rust', 'intermediate'] },
  { id: 'task-2-5-1', title: 'Project: Simple Port Scanner', desc: 'TCP connection attempts, Timeout handling, Multiple targets, Save results to file', phase: 2, month: 4, week: 2, priority: 'high', hours: 12, tags: ['rust', 'project', 'networking'], deps: ['task-2-5'] },
  { id: 'task-2-6', title: 'Rust Fundamentals - Week 3: Advanced Concepts', desc: 'Learn Lifetimes in depth, Traits and trait bounds, Smart pointers, Concurrency basics, Read "The Rust Book" chapters 12-16, Build 3 CLI tools', phase: 2, month: 4, week: 3, priority: 'critical', hours: 40, tags: ['rust', 'advanced'] },
  { id: 'task-2-6-1', title: 'Project: Async Port Scanner', desc: 'Use Tokio, Scan thousands of ports, Concurrent connections, Progress indicator', phase: 2, month: 4, week: 3, priority: 'high', hours: 16, tags: ['rust', 'project', 'async', 'networking'], deps: ['task-2-6'] },
  { id: 'task-2-7', title: 'Rust Fundamentals - Week 4: Async Rust & Networking', desc: 'Learn Tokio runtime, Async/await, TCP/UDP programming, HTTP clients with reqwest, Build network tools', phase: 2, month: 4, week: 4, priority: 'critical', hours: 40, tags: ['rust', 'async', 'networking'] },
  { id: 'task-2-7-1', title: 'Project: Packet Sniffer (Basic)', desc: 'Use pcap crate, Capture packets, Parse Ethernet/IP/TCP headers, Filter by protocol', phase: 2, month: 4, week: 4, priority: 'high', hours: 16, tags: ['rust', 'project', 'networking', 'packets'], deps: ['task-2-7'] },
  { id: 'task-2-7-2', title: 'Project: High-Speed Log Parser', desc: 'Read large files efficiently, Parse multiple formats, Extract fields, Output JSON', phase: 2, month: 4, week: 4, priority: 'high', hours: 12, tags: ['rust', 'project', 'performance', 'logs'], deps: ['task-2-7'] },
  
  // Database Fundamentals
  { id: 'task-2-8', title: 'Database Fundamentals - Week 1: SQL and PostgreSQL', desc: 'Install PostgreSQL, Create databases and tables, CRUD operations, Joins (INNER, LEFT, RIGHT, FULL), Aggregate functions, Subqueries, Indexes', phase: 2, month: 4, week: 4, priority: 'high', hours: 40, tags: ['database', 'sql', 'postgresql'] },
  { id: 'task-2-8-1', title: 'Project: Security Events Database', desc: 'Design schema for alerts, Store vulnerability data, Track incidents, Asset inventory, Query for reporting', phase: 2, month: 4, week: 4, priority: 'high', hours: 20, tags: ['database', 'project', 'security'], deps: ['task-2-8'] },
  { id: 'task-2-9', title: 'Database Fundamentals - Week 2: Advanced Topics', desc: 'Learn Database normalization (1NF, 2NF, 3NF), Schema design for security data, Query optimization, TimescaleDB for time-series, Backup and recovery, PostgreSQL security', phase: 2, month: 4, week: 4, priority: 'high', hours: 40, tags: ['database', 'advanced', 'design'], deps: ['task-2-8'] },
  
  // API Development
  { id: 'task-2-10', title: 'API Development - Week 1: Python FastAPI', desc: 'Install FastAPI and Uvicorn, Create first endpoint, Request/response models with Pydantic, Path and query parameters, Request body handling, Error handling, API documentation auto-generation', phase: 2, month: 4, week: 4, priority: 'high', hours: 40, tags: ['api', 'python', 'fastapi'] },
  { id: 'task-2-10-1', title: 'Project: Vulnerability API', desc: 'CRUD operations for vulnerabilities, Search and filter endpoints, CVE lookup integration, Risk scoring endpoint, Export data as JSON/CSV', phase: 2, month: 4, week: 4, priority: 'high', hours: 20, tags: ['api', 'project', 'security'], deps: ['task-2-10'] },
  { id: 'task-2-11', title: 'API Development - Week 2: Advanced API Features', desc: 'Learn JWT authentication, Rate limiting middleware, CORS configuration, Database integration, Background tasks, WebSocket support, API versioning', phase: 2, month: 4, week: 4, priority: 'high', hours: 40, tags: ['api', 'advanced', 'security'], deps: ['task-2-10'] },
];

// Convert phase2Tasks to the format needed and expand with detail
phase2Tasks.forEach(t => {
  // Check if task already exists (from detailed Phase 0-1)
  const exists = allTasks.some(existing => existing.id === t.id);
  if (exists) return;
  
  allTasks.push({
    id: t.id,
    title: t.title,
    description: t.desc,
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
});

// Expand Phase 2 with more detailed tasks (matching Phase 0-1 detail level)
// Python Advanced - Week 1: Add learning and practice tasks
allTasks.push({
  id: 'task-2-1-2',
  title: 'Learning: "Fluent Python" book',
  description: 'Read "Fluent Python" by Luciano Ramalho, Study advanced Python concepts, Complete exercises',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-3',
  weekId: 'week-3-1',
  estimatedHours: 12,
  tags: ['python', 'learning', 'book'],
  dependencies: ['task-2-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-1-3',
  title: 'Learning: "Black Hat Python" book',
  description: 'Read "Black Hat Python" by Justin Seitz, Study Python for security, Complete exercises',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-3',
  weekId: 'week-3-1',
  estimatedHours: 12,
  tags: ['python', 'learning', 'book', 'security'],
  dependencies: ['task-2-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-1-4',
  title: 'Learning: "Violent Python" book',
  description: 'Read "Violent Python" by TJ O\'Connor, Study Python security tools, Complete exercises',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-3',
  weekId: 'week-3-1',
  estimatedHours: 10,
  tags: ['python', 'learning', 'book', 'security'],
  dependencies: ['task-2-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-1-5',
  title: 'Practice: Real Python tutorials',
  description: 'Complete Real Python tutorials (advanced topics), Practice OOP patterns, Build practice projects',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-2',
  monthId: 'month-3',
  weekId: 'week-3-1',
  estimatedHours: 8,
  tags: ['python', 'practice', 'tutorial'],
  dependencies: ['task-2-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-1-6',
  title: 'Checkpoint: Python Advanced - OOP',
  description: 'Verify: Built 5 functional security tools in Python? Understand OOP patterns? Can write clean, maintainable code?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-3',
  weekId: 'week-3-1',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'python'],
  dependencies: ['task-2-1-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Python Advanced - Week 2: Expand async programming
allTasks.push({
  id: 'task-2-2-2',
  title: 'Learning: Async/await in Python',
  description: 'Study async/await syntax, Event loops, Coroutines, Async context managers, Async generators',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-3',
  weekId: 'week-3-2',
  estimatedHours: 8,
  tags: ['python', 'async', 'learning'],
  dependencies: ['task-2-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-2-3',
  title: 'Learning: Threading vs Multiprocessing',
  description: 'Study GIL (Global Interpreter Lock), Threading limitations, Multiprocessing benefits, When to use each',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-3',
  weekId: 'week-3-2',
  estimatedHours: 8,
  tags: ['python', 'concurrency', 'learning'],
  dependencies: ['task-2-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-2-4',
  title: 'Practice: Async web scraping',
  description: 'Build async web scraper, Practice concurrent requests, Handle rate limiting, Practice error handling',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-2',
  monthId: 'month-3',
  weekId: 'week-3-2',
  estimatedHours: 6,
  tags: ['python', 'async', 'practice'],
  dependencies: ['task-2-2-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Python Advanced - Week 3: Expand security tools
allTasks.push({
  id: 'task-2-3-4',
  title: 'Learning: Scapy for packet manipulation',
  description: 'Study Scapy basics, Packet crafting, Packet sniffing, Protocol layers, Packet analysis',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-3',
  weekId: 'week-3-3',
  estimatedHours: 8,
  tags: ['python', 'scapy', 'networking', 'learning'],
  dependencies: ['task-2-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-3-5',
  title: 'Learning: Requests library for HTTP',
  description: 'Master Requests library, Session management, Authentication, Headers, Cookies, Proxies',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-3',
  weekId: 'week-3-3',
  estimatedHours: 6,
  tags: ['python', 'requests', 'http', 'learning'],
  dependencies: ['task-2-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-3-6',
  title: 'Learning: Socket programming',
  description: 'Study TCP sockets, UDP sockets, Server sockets, Client sockets, Socket options',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-3',
  weekId: 'week-3-3',
  estimatedHours: 8,
  tags: ['python', 'sockets', 'networking', 'learning'],
  dependencies: ['task-2-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-3-7',
  title: 'Learning: Paramiko for SSH',
  description: 'Study Paramiko library, SSH connections, SFTP, Remote command execution, Key-based authentication',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-2',
  monthId: 'month-3',
  weekId: 'week-3-3',
  estimatedHours: 6,
  tags: ['python', 'paramiko', 'ssh', 'learning'],
  dependencies: ['task-2-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-3-8',
  title: 'Checkpoint: Python for Security',
  description: 'Verify: Built 5 functional security tools in Python? Can use Scapy, Requests, Sockets? Understand security programming?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-3',
  weekId: 'week-3-4',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'python', 'security'],
  dependencies: ['task-2-3-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Rust Fundamentals - Expand with learning tasks
allTasks.push({
  id: 'task-2-4-2',
  title: 'Learning: "The Rust Programming Language" book',
  description: 'Read "The Rust Programming Language" (official book), Complete chapters 1-6, Study ownership and borrowing',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-1',
  estimatedHours: 20,
  tags: ['rust', 'learning', 'book'],
  dependencies: ['task-2-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-4-3',
  title: 'Practice: Rustlings exercises',
  description: 'Complete rustlings exercises 1-50, Practice ownership, Practice borrowing, Practice lifetimes',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-1',
  estimatedHours: 12,
  tags: ['rust', 'practice', 'exercises'],
  dependencies: ['task-2-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-4-4',
  title: 'Learning: "Programming Rust" book',
  description: 'Read "Programming Rust" by Jim Blandy, Study Rust concepts, Complete exercises',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-1',
  estimatedHours: 12,
  tags: ['rust', 'learning', 'book'],
  dependencies: ['task-2-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-4-5',
  title: 'Practice: Rust By Example',
  description: 'Complete Rust By Example website tutorials, Practice all concepts, Build examples',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-1',
  estimatedHours: 8,
  tags: ['rust', 'practice', 'tutorial'],
  dependencies: ['task-2-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-4-6',
  title: 'Practice: Exercism Rust track',
  description: 'Complete Exercism Rust track, Practice problem solving, Practice Rust idioms',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-1',
  estimatedHours: 10,
  tags: ['rust', 'practice', 'exercism'],
  dependencies: ['task-2-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Rust Intermediate - Expand
allTasks.push({
  id: 'task-2-5-2',
  title: 'Learning: Rust Book chapters 7-11',
  description: 'Read "The Rust Book" chapters 7-11, Study structs, enums, error handling, generics',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-2',
  estimatedHours: 20,
  tags: ['rust', 'learning', 'book'],
  dependencies: ['task-2-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-5-3',
  title: 'Practice: Rustlings exercises 51-100',
  description: 'Complete rustlings exercises 51-100, Practice structs, Practice enums, Practice error handling',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-2',
  estimatedHours: 12,
  tags: ['rust', 'practice', 'exercises'],
  dependencies: ['task-2-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Rust Advanced - Expand
allTasks.push({
  id: 'task-2-6-2',
  title: 'Learning: Rust Book chapters 12-16',
  description: 'Read "The Rust Book" chapters 12-16, Study lifetimes, traits, smart pointers, concurrency',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-3',
  estimatedHours: 20,
  tags: ['rust', 'learning', 'book'],
  dependencies: ['task-2-6'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-6-3',
  title: 'Project: Build 3 CLI tools',
  description: 'Build 3 CLI tools in Rust, Practice error handling, Practice testing, Practice documentation',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-3',
  estimatedHours: 16,
  tags: ['rust', 'project', 'cli'],
  dependencies: ['task-2-6'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Rust Async - Expand
allTasks.push({
  id: 'task-2-7-3',
  title: 'Learning: Tokio runtime',
  description: 'Study Tokio runtime, Async runtime concepts, Task scheduling, Spawning tasks',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-4',
  estimatedHours: 8,
  tags: ['rust', 'tokio', 'async', 'learning'],
  dependencies: ['task-2-7'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-7-4',
  title: 'Learning: Async/await in Rust',
  description: 'Study async/await syntax in Rust, Futures, Pin, Async traits, Async closures',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-4',
  estimatedHours: 8,
  tags: ['rust', 'async', 'learning'],
  dependencies: ['task-2-7'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-7-5',
  title: 'Learning: TCP/UDP programming',
  description: 'Study TCP sockets in Rust, UDP sockets, Server implementation, Client implementation',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-4',
  estimatedHours: 8,
  tags: ['rust', 'networking', 'learning'],
  dependencies: ['task-2-7'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-7-6',
  title: 'Learning: HTTP clients with reqwest',
  description: 'Study reqwest library, HTTP requests, Async HTTP, Error handling, Response handling',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-4',
  estimatedHours: 6,
  tags: ['rust', 'http', 'reqwest', 'learning'],
  dependencies: ['task-2-7'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-7-7',
  title: 'Checkpoint: Rust Fundamentals',
  description: 'Verify: Can write performant, safe Rust code? Built 5 tools? Understand ownership and lifetimes?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-4',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'rust'],
  dependencies: ['task-2-7-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Database Fundamentals - Expand
allTasks.push({
  id: 'task-2-8-2',
  title: 'Learning: PostgreSQL Tutorial',
  description: 'Complete PostgreSQL Tutorial website, Study all concepts, Practice queries',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-4',
  estimatedHours: 12,
  tags: ['database', 'postgresql', 'learning', 'tutorial'],
  dependencies: ['task-2-8'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-8-3',
  title: 'Learning: "PostgreSQL: Up and Running" book',
  description: 'Read "PostgreSQL: Up and Running" book, Study database concepts, Complete exercises',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-4',
  estimatedHours: 12,
  tags: ['database', 'postgresql', 'learning', 'book'],
  dependencies: ['task-2-8'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-8-4',
  title: 'Practice: Mode Analytics SQL Tutorial',
  description: 'Complete Mode Analytics SQL Tutorial, Practice all query types, Practice joins',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-4',
  estimatedHours: 8,
  tags: ['database', 'sql', 'practice', 'tutorial'],
  dependencies: ['task-2-8'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-8-5',
  title: 'Practice: SQLBolt interactive lessons',
  description: 'Complete SQLBolt interactive lessons, Practice all SQL concepts, Master SQL queries',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-4',
  estimatedHours: 8,
  tags: ['database', 'sql', 'practice'],
  dependencies: ['task-2-8'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-8-6',
  title: 'Checkpoint: Database Fundamentals',
  description: 'Verify: Designed and implemented complex security database schema? Can write complex queries? Understand normalization?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-4',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'database'],
  dependencies: ['task-2-8-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// API Development - Expand
allTasks.push({
  id: 'task-2-10-2',
  title: 'Learning: FastAPI official documentation',
  description: 'Read FastAPI official documentation, Study all features, Complete examples',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-4',
  estimatedHours: 12,
  tags: ['api', 'fastapi', 'learning', 'documentation'],
  dependencies: ['task-2-10'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-10-3',
  title: 'Learning: "Building APIs with FastAPI" course',
  description: 'Complete "Building APIs with FastAPI" course, Study API design, Practice building APIs',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-4',
  estimatedHours: 12,
  tags: ['api', 'fastapi', 'learning', 'course'],
  dependencies: ['task-2-10'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-10-4',
  title: 'Practice: Postman learning center',
  description: 'Complete Postman learning center tutorials, Practice API testing, Practice API documentation',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-4',
  estimatedHours: 6,
  tags: ['api', 'postman', 'practice'],
  dependencies: ['task-2-10'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-10-5',
  title: 'Learning: REST API design best practices',
  description: 'Study REST API design best practices, HTTP methods, Status codes, API versioning, Error handling',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-4',
  estimatedHours: 8,
  tags: ['api', 'rest', 'learning', 'best-practices'],
  dependencies: ['task-2-10'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-2-10-6',
  title: 'Checkpoint: API Development',
  description: 'Verify: Built and documented 3 working APIs? Understand authentication? Can design RESTful APIs?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-2',
  monthId: 'month-4',
  weekId: 'week-4-4',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'api'],
  dependencies: ['task-2-10-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Phase 3: AI & Machine Learning (Months 5-6)
const phase3Tasks = [
  // ML Basics
  { id: 'task-3-1', title: 'Machine Learning Basics - Week 1: ML Theory', desc: 'Complete Andrew Ng\'s ML course (Coursera) Week 1-3, Understand linear regression, Logistic regression for classification, Cost functions, Gradient descent, Practice math concepts', phase: 3, month: 5, week: 1, priority: 'critical', hours: 40, tags: ['ml', 'theory', 'learning'] },
  { id: 'task-3-1-1', title: 'Project: Malware Classifier', desc: 'Collect malware dataset, Extract features, Train classification model, Evaluate performance, Save and load model', phase: 3, month: 5, week: 1, priority: 'high', hours: 20, tags: ['ml', 'project', 'security'], deps: ['task-3-1'] },
  { id: 'task-3-2', title: 'Machine Learning Basics - Week 2: Scikit-learn Practical', desc: 'Install scikit-learn, Load and explore datasets, Train/test split, Build classification models, Evaluate with accuracy, precision, recall, Cross-validation', phase: 3, month: 5, week: 2, priority: 'critical', hours: 40, tags: ['ml', 'scikit-learn', 'practical'], deps: ['task-3-1'] },
  { id: 'task-3-2-1', title: 'Project: Network Intrusion Detection', desc: 'Use NSL-KDD dataset, Feature selection, Train multiple models, Compare performance, Deploy model for predictions', phase: 3, month: 5, week: 2, priority: 'high', hours: 24, tags: ['ml', 'project', 'security', 'ids'], deps: ['task-3-2'] },
  { id: 'task-3-3', title: 'Machine Learning Basics - Week 3: Security ML Applications', desc: 'Learn Anomaly detection for logs, Malware classification, Network intrusion detection, User behavior analysis, Phishing detection', phase: 3, month: 5, week: 3, priority: 'critical', hours: 40, tags: ['ml', 'security', 'applications'], deps: ['task-3-2'] },
  { id: 'task-3-3-1', title: 'Project: Log Anomaly Detector', desc: 'Parse system logs, Extract patterns, Train anomaly detection (Isolation Forest), Flag suspicious activities, Generate alerts', phase: 3, month: 5, week: 3, priority: 'high', hours: 20, tags: ['ml', 'project', 'security', 'logs'], deps: ['task-3-3'] },
  { id: 'task-3-3-2', title: 'Project: Phishing URL Detector', desc: 'Collect URL datasets, Feature engineering (length, special chars, etc.), Train classifier, Test on new URLs, Create API endpoint', phase: 3, month: 5, week: 4, priority: 'high', hours: 16, tags: ['ml', 'project', 'security', 'phishing'], deps: ['task-3-3'] },
  
  // Deep Learning
  { id: 'task-3-4', title: 'Deep Learning Fundamentals - Week 1: Neural Networks Theory', desc: 'Complete Andrew Ng\'s Deep Learning Course 1, Understand forward propagation, Backpropagation algorithm, Activation functions (ReLU, sigmoid, tanh), Initialize weights properly, Regularization techniques', phase: 3, month: 5, week: 4, priority: 'critical', hours: 40, tags: ['deep-learning', 'neural-networks', 'theory'] },
  { id: 'task-3-5', title: 'Deep Learning Fundamentals - Week 2: PyTorch Basics', desc: 'Install PyTorch, Tensors and operations, Autograd system, Building neural networks, Training loops, Saving/loading models', phase: 3, month: 6, week: 1, priority: 'critical', hours: 40, tags: ['deep-learning', 'pytorch', 'practical'], deps: ['task-3-4'] },
  { id: 'task-3-5-1', title: 'Project: Basic Neural Network from Scratch', desc: 'Implement forward propagation, Implement backpropagation, Train on simple dataset, Understand internals deeply', phase: 3, month: 6, week: 1, priority: 'high', hours: 20, tags: ['deep-learning', 'project', 'neural-networks'], deps: ['task-3-5'] },
  { id: 'task-3-6', title: 'Deep Learning Fundamentals - Week 3: Advanced Architectures', desc: 'Learn CNNs for image analysis (malware images), RNNs for sequence data (log sequences), Autoencoders for anomaly detection, Transfer learning, Fine-tuning models', phase: 3, month: 6, week: 2, priority: 'critical', hours: 40, tags: ['deep-learning', 'advanced', 'architectures'], deps: ['task-3-5'] },
  { id: 'task-3-6-1', title: 'Project: Malware Image Classifier', desc: 'Convert malware to images, Build CNN architecture, Train classification model, Evaluate on test set, Deploy for inference', phase: 3, month: 6, week: 2, priority: 'high', hours: 24, tags: ['deep-learning', 'project', 'security', 'cnn'], deps: ['task-3-6'] },
  { id: 'task-3-6-2', title: 'Project: Log Sequence Anomaly Detector', desc: 'Preprocess log sequences, Build RNN/LSTM model, Train on normal logs, Detect anomalies in new logs, Real-time detection', phase: 3, month: 6, week: 3, priority: 'high', hours: 20, tags: ['deep-learning', 'project', 'security', 'rnn'], deps: ['task-3-6'] },
  { id: 'task-3-6-3', title: 'Project: Autoencoder for Network Traffic', desc: 'Collect network traffic data, Build autoencoder, Train on normal traffic, Detect anomalies (attacks), Visualize results', phase: 3, month: 6, week: 3, priority: 'high', hours: 16, tags: ['deep-learning', 'project', 'security', 'autoencoder'], deps: ['task-3-6'] },
  
  // LLMs
  { id: 'task-3-7', title: 'Large Language Models (LLMs) - Week 1: LLM Fundamentals', desc: 'Read "Attention Is All You Need" paper (simplified version), Understand transformer architecture, Learn about GPT, BERT, Claude models, Study prompt engineering techniques, Practice with ChatGPT/Claude', phase: 3, month: 6, week: 4, priority: 'critical', hours: 40, tags: ['llm', 'transformers', 'fundamentals'] },
  { id: 'task-3-7-1', title: 'Project: Security Report Generator', desc: 'Take vulnerability data, Generate executive summary, Create technical details, Produce remediation recommendations, Format as professional report', phase: 3, month: 6, week: 4, priority: 'high', hours: 16, tags: ['llm', 'project', 'security', 'reporting'], deps: ['task-3-7'] },
  { id: 'task-3-8', title: 'Large Language Models - Week 2: LLM APIs and Integration', desc: 'OpenAI API setup, Anthropic Claude API setup, Chat completions API, Function calling, Embeddings API, Token counting and costs', phase: 3, month: 6, week: 4, priority: 'critical', hours: 40, tags: ['llm', 'apis', 'integration'], deps: ['task-3-7'] },
  { id: 'task-3-8-1', title: 'Project: Threat Intelligence Analyst', desc: 'Feed threat data, Ask analysis questions, Get insights and patterns, Generate hypotheses, Create threat reports', phase: 3, month: 6, week: 4, priority: 'high', hours: 12, tags: ['llm', 'project', 'security', 'threat-intel'], deps: ['task-3-8'] },
  { id: 'task-3-8-2', title: 'Project: Log Analysis Assistant', desc: 'Send log samples, Ask for anomalies, Get explanations, Suggest investigations, Generate alerts', phase: 3, month: 6, week: 4, priority: 'high', hours: 12, tags: ['llm', 'project', 'security', 'logs'], deps: ['task-3-8'] },
  { id: 'task-3-8-3', title: 'Project: CVE Explainer', desc: 'Input CVE ID, Get plain English explanation, Impact assessment, Remediation steps, Related vulnerabilities', phase: 3, month: 6, week: 4, priority: 'high', hours: 8, tags: ['llm', 'project', 'security', 'cve'], deps: ['task-3-8'] },
  
  // LangChain & AI Agents
  { id: 'task-3-9', title: 'LangChain & AI Agents - Week 1: LangChain Basics', desc: 'Install LangChain, Understand components, LLMs and Chat Models, Prompt templates, Chains (LLMChain, SimpleSequentialChain), Output parsers, Build 5 simple chains', phase: 3, month: 6, week: 4, priority: 'critical', hours: 40, tags: ['langchain', 'ai-agents', 'basics'], deps: ['task-3-8'] },
  { id: 'task-3-10', title: 'LangChain & AI Agents - Week 2: Agents and Tools', desc: 'Learn Agent types (zero-shot, conversational), Tool creation, Custom tools for security, Agent executors, Debugging agents, Build 5 agent applications', phase: 3, month: 6, week: 4, priority: 'critical', hours: 40, tags: ['langchain', 'ai-agents', 'tools'], deps: ['task-3-9'] },
  { id: 'task-3-10-1', title: 'Project: Automated Pentester Agent', desc: 'Create tools: scan_port, check_vuln, exploit, Build agent that uses tools, Give it a target, Agent decides what to do, Generates findings report', phase: 3, month: 6, week: 4, priority: 'high', hours: 24, tags: ['langchain', 'project', 'security', 'pentest'], deps: ['task-3-10'] },
  { id: 'task-3-10-2', title: 'Project: SOC Analyst Agent', desc: 'Tools: query_siem, check_ioc, block_ip, Analyze alert, Investigate automatically, Determine if threat is real, Take action or escalate', phase: 3, month: 6, week: 4, priority: 'high', hours: 24, tags: ['langchain', 'project', 'security', 'soc'], deps: ['task-3-10'] },
  { id: 'task-3-11', title: 'LangChain & AI Agents - Week 3: RAG and Memory', desc: 'Learn Vector embeddings, Vector databases (Chroma, FAISS), Document loaders, Text splitters, Retrieval chains, Memory types (buffer, summary, vector), Build RAG applications', phase: 3, month: 6, week: 4, priority: 'critical', hours: 40, tags: ['langchain', 'rag', 'memory'], deps: ['task-3-10'] },
  { id: 'task-3-11-1', title: 'Project: Security Knowledge Base', desc: 'Load security documents, Create vector store, Build Q&A system, Ask security questions, Get accurate answers with citations', phase: 3, month: 6, week: 4, priority: 'high', hours: 20, tags: ['langchain', 'project', 'rag', 'knowledge-base'], deps: ['task-3-11'] },
  { id: 'task-3-11-2', title: 'Project: Threat Intel Research Agent', desc: 'Web search tool, IOC enrichment tool, Report generation tool, Research threat actor, Compile intelligence report', phase: 3, month: 6, week: 4, priority: 'high', hours: 16, tags: ['langchain', 'project', 'threat-intel'], deps: ['task-3-11'] },
  { id: 'task-3-11-3', title: 'Project: Multi-Agent Security Team', desc: 'Scanner agent, Analyzer agent, Reporter agent, Agents collaborate, Complete full security assessment', phase: 3, month: 6, week: 4, priority: 'high', hours: 24, tags: ['langchain', 'project', 'multi-agent'], deps: ['task-3-11'] },
  
  // Vector Databases
  { id: 'task-3-12', title: 'Vector Databases - Understanding Embeddings', desc: 'What are embeddings, How models create embeddings, OpenAI embeddings API, Sentence transformers, Cosine similarity', phase: 3, month: 6, week: 4, priority: 'high', hours: 20, tags: ['vector-db', 'embeddings'], deps: ['task-3-11'] },
  { id: 'task-3-12-1', title: 'Project: CVE Knowledge Base', desc: 'Download CVE data, Generate embeddings, Store in Chroma, Query: "find buffer overflow vulnerabilities", Get relevant CVEs', phase: 3, month: 6, week: 4, priority: 'high', hours: 12, tags: ['vector-db', 'project', 'cve'], deps: ['task-3-12'] },
  { id: 'task-3-12-2', title: 'Project: Security Playbook Retrieval', desc: 'Store incident response playbooks, Embed each playbook, Query: "ransomware detected", Retrieve relevant playbook', phase: 3, month: 6, week: 4, priority: 'high', hours: 12, tags: ['vector-db', 'project', 'playbooks'], deps: ['task-3-12'] },
];

// Phase 4: System Architecture (Month 7)
const phase4Tasks = [
  { id: 'task-4-1', title: 'Microservices Architecture - Design distributed system', desc: 'Learn Microservices principles, Service boundaries, API Gateway pattern, Service discovery, Load balancing, Circuit breakers, Message queues', phase: 4, month: 7, week: 1, priority: 'high', hours: 40, tags: ['architecture', 'microservices'] },
  { id: 'task-4-1-1', title: 'Project: Create Architecture Diagram', desc: 'Use draw.io or Lucidchart, Show all services, Show data flow, Show external integrations', phase: 4, month: 7, week: 1, priority: 'high', hours: 8, tags: ['architecture', 'project', 'diagram'], deps: ['task-4-1'] },
  { id: 'task-4-2', title: 'Database Architecture Design - Design complete data model', desc: 'Learn Schema design for security data, Time-series optimization, Relational data modeling, Query performance, Data retention strategies, Backup and recovery', phase: 4, month: 7, week: 2, priority: 'high', hours: 40, tags: ['database', 'architecture', 'design'] },
  { id: 'task-4-2-1', title: 'Project: Create ERD (Entity-Relationship Diagram)', desc: 'Use dbdiagram.io, Show all tables, Define relationships, Add indexes, Document constraints', phase: 4, month: 7, week: 2, priority: 'high', hours: 16, tags: ['database', 'project', 'erd'], deps: ['task-4-2'] },
  { id: 'task-4-3', title: 'API Architecture Design - Design all APIs needed', desc: 'Learn OpenAPI specification, API versioning strategies, Authentication flows, Rate limiting design, Error handling standards, API documentation', phase: 4, month: 7, week: 3, priority: 'high', hours: 40, tags: ['api', 'architecture', 'design'] },
  { id: 'task-4-3-1', title: 'Project: Create OpenAPI Specification', desc: 'Use Swagger Editor, Define all endpoints, Complete schemas, Authentication scheme, Generate documentation', phase: 4, month: 7, week: 3, priority: 'high', hours: 20, tags: ['api', 'project', 'openapi'], deps: ['task-4-3'] },
  { id: 'task-4-4', title: 'Development Environment Setup - Set up complete dev environment', desc: 'Create GitHub organization, Set up monorepo or multi-repos, Branch protection rules, PR templates, CI/CD workflows, VSCode with extensions, Docker Desktop, Docker Compose files', phase: 4, month: 7, week: 4, priority: 'high', hours: 24, tags: ['devops', 'setup', 'environment'] },
];

// Expand Phase 4 with detailed tasks
allTasks.push({
  id: 'task-4-1-2',
  title: 'Learning: "Building Microservices" book',
  description: 'Read "Building Microservices" by Sam Newman, Study microservices patterns, Learn best practices',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-4',
  monthId: 'month-7',
  weekId: 'week-7-1',
  estimatedHours: 16,
  tags: ['architecture', 'microservices', 'learning', 'book'],
  dependencies: ['task-4-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-4-1-3',
  title: 'Learning: "Microservices Patterns" book',
  description: 'Read "Microservices Patterns" by Chris Richardson, Study patterns, Learn implementation',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-4',
  monthId: 'month-7',
  weekId: 'week-7-1',
  estimatedHours: 16,
  tags: ['architecture', 'microservices', 'learning', 'book'],
  dependencies: ['task-4-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-4-1-4',
  title: 'Learning: Martin Fowler\'s microservices articles',
  description: 'Read Martin Fowler\'s microservices articles, Study concepts, Learn best practices',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-4',
  monthId: 'month-7',
  weekId: 'week-7-1',
  estimatedHours: 8,
  tags: ['architecture', 'microservices', 'learning'],
  dependencies: ['task-4-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-4-2-2',
  title: 'Learning: "Database Design for Mere Mortals" book',
  description: 'Read "Database Design for Mere Mortals" book, Study database design, Learn normalization',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-4',
  monthId: 'month-7',
  weekId: 'week-7-2',
  estimatedHours: 12,
  tags: ['database', 'design', 'learning', 'book'],
  dependencies: ['task-4-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-4-2-3',
  title: 'Learning: PostgreSQL documentation',
  description: 'Read PostgreSQL documentation, Study advanced features, Learn optimization',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-4',
  monthId: 'month-7',
  weekId: 'week-7-2',
  estimatedHours: 12,
  tags: ['database', 'postgresql', 'learning'],
  dependencies: ['task-4-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-4-2-4',
  title: 'Learning: TimescaleDB best practices',
  description: 'Study TimescaleDB best practices, Learn time-series optimization, Study hypertables',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-4',
  monthId: 'month-7',
  weekId: 'week-7-2',
  estimatedHours: 8,
  tags: ['database', 'timescaledb', 'learning'],
  dependencies: ['task-4-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-4-3-2',
  title: 'Learning: OpenAPI Specification documentation',
  description: 'Read OpenAPI Specification documentation, Study all features, Learn best practices',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-4',
  monthId: 'month-7',
  weekId: 'week-7-3',
  estimatedHours: 12,
  tags: ['api', 'openapi', 'learning'],
  dependencies: ['task-4-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-4-3-3',
  title: 'Learning: Swagger tutorial',
  description: 'Complete Swagger tutorial, Study Swagger Editor, Practice API design',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-4',
  monthId: 'month-7',
  weekId: 'week-7-3',
  estimatedHours: 8,
  tags: ['api', 'swagger', 'learning'],
  dependencies: ['task-4-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-4-3-4',
  title: 'Learning: API design best practices',
  description: 'Study REST API design best practices, Learn API versioning, Study error handling',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-4',
  monthId: 'month-7',
  weekId: 'week-7-3',
  estimatedHours: 8,
  tags: ['api', 'design', 'learning'],
  dependencies: ['task-4-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-4-4-1',
  title: 'Learning: Docker documentation',
  description: 'Read Docker documentation, Study Docker Compose, Learn best practices',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-4',
  monthId: 'month-7',
  weekId: 'week-7-4',
  estimatedHours: 8,
  tags: ['devops', 'docker', 'learning'],
  dependencies: ['task-4-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-4-4-2',
  title: 'Learning: Git best practices',
  description: 'Study Git best practices, Learn branching strategies, Study PR workflows',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-4',
  monthId: 'month-7',
  weekId: 'week-7-4',
  estimatedHours: 4,
  tags: ['devops', 'git', 'learning'],
  dependencies: ['task-4-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-4-4-3',
  title: 'Checkpoint: System Architecture',
  description: 'Verify: Complete architecture diagram created? Database schema designed? API specification complete? Dev environment ready?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-4',
  monthId: 'month-7',
  weekId: 'week-7-4',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'architecture'],
  dependencies: ['task-4-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Phase 5: Build Rust Services (Months 8-9)
const phase5Tasks = [
  { id: 'task-5-1', title: 'Rust Scanner Service - Week 1: Core Scanner', desc: 'Project setup with Cargo, Add dependencies (tokio, clap, serde, reqwest, trust-dns-resolver), Basic port scanner with async TCP connections, Timeout handling, Multiple targets support', phase: 5, month: 8, week: 1, priority: 'critical', hours: 40, tags: ['rust', 'scanner', 'networking'] },
  { id: 'task-5-1-1', title: 'Project: Basic Port Scanner', desc: 'Async TCP connections, Timeout handling, Multiple targets, Common ports list, Open port detection', phase: 5, month: 8, week: 1, priority: 'high', hours: 16, tags: ['rust', 'project', 'scanner'], deps: ['task-5-1'] },
  { id: 'task-5-2', title: 'Rust Scanner Service - Week 2: Advanced Features', desc: 'Service detection with banner grabbing, OS fingerprinting, Results caching, Export to multiple formats (JSON, XML)', phase: 5, month: 8, week: 2, priority: 'critical', hours: 40, tags: ['rust', 'scanner', 'advanced'], deps: ['task-5-1'] },
  { id: 'task-5-2-1', title: 'Project: Complete Scanner with API', desc: 'JSON output, XML output, Database storage, REST API endpoints', phase: 5, month: 8, week: 2, priority: 'high', hours: 20, tags: ['rust', 'project', 'scanner', 'api'], deps: ['task-5-2'] },
  { id: 'task-5-3', title: 'Rust Parser Service - Week 1: Parser Core', desc: 'Parser architecture with plugin system, Common event model, Field mapping, Syslog parser (RFC 3164, RFC 5424), JSON log parser', phase: 5, month: 8, week: 3, priority: 'critical', hours: 40, tags: ['rust', 'parser', 'logs'] },
  { id: 'task-5-3-1', title: 'Project: Multi-format Log Parser', desc: 'CEF/LEEF parser, Custom format support, Regex-based parser, Grok patterns', phase: 5, month: 8, week: 3, priority: 'high', hours: 24, tags: ['rust', 'project', 'parser'], deps: ['task-5-3'] },
  { id: 'task-5-4', title: 'Rust Parser Service - Week 2: Integration & Performance', desc: 'TimescaleDB integration, Batch insertion, Memory management, Throughput optimization (target: 100,000+ logs/second)', phase: 5, month: 8, week: 4, priority: 'critical', hours: 40, tags: ['rust', 'parser', 'performance'], deps: ['task-5-3'] },
  { id: 'task-5-5', title: 'Rust API Gateway - Week 1: Core Gateway', desc: 'Framework setup with Axum, Basic routing, Middleware system, Error handling, Authentication (JWT token validation, API key support), Core routes', phase: 5, month: 9, week: 1, priority: 'critical', hours: 40, tags: ['rust', 'gateway', 'api'] },
  { id: 'task-5-5-1', title: 'Project: Basic API Gateway', desc: 'Health check endpoint, API versioning, Request validation, Response formatting', phase: 5, month: 9, week: 1, priority: 'high', hours: 16, tags: ['rust', 'project', 'gateway'], deps: ['task-5-5'] },
  { id: 'task-5-6', title: 'Rust API Gateway - Week 2: Advanced Features', desc: 'Rate limiting (Token bucket algorithm), WebSocket server, Proxy & Load balancing, Service discovery, Circuit breaker', phase: 5, month: 9, week: 2, priority: 'critical', hours: 40, tags: ['rust', 'gateway', 'advanced'], deps: ['task-5-5'] },
  { id: 'task-5-7', title: 'Service Integration - Connect all Rust services', desc: 'gRPC setup with .proto files, Message queue (RabbitMQ or NATS), End-to-end tests, Service communication tests', phase: 5, month: 9, week: 3, priority: 'high', hours: 40, tags: ['rust', 'integration', 'grpc'], deps: ['task-5-6'] },
  { id: 'task-5-7-1', title: 'Project: Docker Compose for all services', desc: 'Create Docker Compose for all services, Integration test suite, Monitoring setup, Documentation', phase: 5, month: 9, week: 3, priority: 'high', hours: 16, tags: ['rust', 'project', 'docker', 'integration'], deps: ['task-5-7'] },
];

// Expand Phase 5 with detailed tasks
allTasks.push({
  id: 'task-5-1-2',
  title: 'Day 1-2: Project Setup',
  description: 'Create Cargo project, Add dependencies to Cargo.toml, Set up project structure, Configure build',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-8',
  weekId: 'week-8-1',
  estimatedHours: 4,
  tags: ['rust', 'setup', 'project'],
  dependencies: ['task-5-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-1-3',
  title: 'Day 3-4: Basic Port Scanner',
  description: 'Implement async TCP connections, Implement timeout handling, Add multiple targets support, Add common ports list',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-8',
  weekId: 'week-8-1',
  estimatedHours: 12,
  tags: ['rust', 'scanner', 'development'],
  dependencies: ['task-5-1-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-2-2',
  title: 'Day 1-2: OS Fingerprinting',
  description: 'Implement TCP/IP stack analysis, Implement TTL analysis, Implement window size analysis, Implement packet behavior analysis',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-8',
  weekId: 'week-8-2',
  estimatedHours: 12,
  tags: ['rust', 'scanner', 'os-detection'],
  dependencies: ['task-5-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-2-3',
  title: 'Day 3-4: Performance Optimization',
  description: 'Implement connection pooling, Implement rate limiting, Optimize memory usage, Add progress reporting',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-8',
  weekId: 'week-8-2',
  estimatedHours: 12,
  tags: ['rust', 'scanner', 'performance'],
  dependencies: ['task-5-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-3-2',
  title: 'Day 1-2: Parser Architecture',
  description: 'Design plugin architecture for formats, Design common event model, Design field mapping, Focus on performance',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-8',
  weekId: 'week-8-3',
  estimatedHours: 12,
  tags: ['rust', 'parser', 'architecture'],
  dependencies: ['task-5-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-3-3',
  title: 'Day 3-4: Syslog Parser',
  description: 'Implement RFC 3164 support, Implement RFC 5424 support, Parse priority, Normalize timestamps, Extract facility/severity',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-8',
  weekId: 'week-8-3',
  estimatedHours: 12,
  tags: ['rust', 'parser', 'syslog'],
  dependencies: ['task-5-3-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-3-4',
  title: 'Day 5-7: JSON Log Parser',
  description: 'Implement nested JSON support, Handle arrays, Validate schema, Flatten fields',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-8',
  weekId: 'week-8-3',
  estimatedHours: 12,
  tags: ['rust', 'parser', 'json'],
  dependencies: ['task-5-3-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-4-1',
  title: 'Day 1-2: CEF/LEEF Parser',
  description: 'Implement Common Event Format parser, Implement Log Event Extended Format parser, Parse key-value pairs, Handle extension fields',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-8',
  weekId: 'week-8-4',
  estimatedHours: 12,
  tags: ['rust', 'parser', 'cef', 'leef'],
  dependencies: ['task-5-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-4-2',
  title: 'Day 3-4: Custom Format Support',
  description: 'Implement regex-based parser, Implement Grok patterns, Support user-defined templates',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-8',
  weekId: 'week-8-4',
  estimatedHours: 12,
  tags: ['rust', 'parser', 'custom'],
  dependencies: ['task-5-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-4-3',
  title: 'Day 5-7: Integration & Performance',
  description: 'Integrate with TimescaleDB, Implement batch insertion, Optimize memory management, Optimize throughput (target: 100,000+ logs/second)',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-5',
  monthId: 'month-8',
  weekId: 'week-8-4',
  estimatedHours: 16,
  tags: ['rust', 'parser', 'performance', 'integration'],
  dependencies: ['task-5-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-4-4',
  title: 'Checkpoint: Rust Parser Service',
  description: 'Verify: Parser handling 100K+ logs/second? Low memory footprint? Minimal CPU usage? No data loss?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-8',
  weekId: 'week-8-4',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'rust', 'parser'],
  dependencies: ['task-5-4-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-5-2',
  title: 'Day 1-2: Framework Setup',
  description: 'Set up Axum framework, Configure basic routing, Set up middleware system, Implement error handling',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-9',
  weekId: 'week-9-1',
  estimatedHours: 12,
  tags: ['rust', 'gateway', 'axum', 'setup'],
  dependencies: ['task-5-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-5-3',
  title: 'Day 3-4: Authentication',
  description: 'Implement JWT token validation, Implement API key support, Implement token refresh, Implement user session management',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-9',
  weekId: 'week-9-1',
  estimatedHours: 12,
  tags: ['rust', 'gateway', 'authentication'],
  dependencies: ['task-5-5-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-5-4',
  title: 'Day 5-7: Core Routes',
  description: 'Implement health check endpoint, Implement API versioning, Implement request validation, Implement response formatting',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-9',
  weekId: 'week-9-1',
  estimatedHours: 12,
  tags: ['rust', 'gateway', 'routes'],
  dependencies: ['task-5-5-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-6-1',
  title: 'Day 1-2: Rate Limiting',
  description: 'Implement token bucket algorithm, Implement per-user limits, Implement per-endpoint limits, Integrate with Redis',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-9',
  weekId: 'week-9-2',
  estimatedHours: 12,
  tags: ['rust', 'gateway', 'rate-limiting'],
  dependencies: ['task-5-6'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-6-2',
  title: 'Day 3-4: WebSocket Server',
  description: 'Implement connection handling, Implement real-time updates, Implement event broadcasting, Implement client management',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-9',
  weekId: 'week-9-2',
  estimatedHours: 12,
  tags: ['rust', 'gateway', 'websocket'],
  dependencies: ['task-5-6'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-6-3',
  title: 'Day 5-7: Proxy & Load Balancing',
  description: 'Implement service discovery, Implement request forwarding, Implement health checks, Implement circuit breaker',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-9',
  weekId: 'week-9-2',
  estimatedHours: 12,
  tags: ['rust', 'gateway', 'proxy', 'load-balancing'],
  dependencies: ['task-5-6'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-6-4',
  title: 'Checkpoint: Rust API Gateway',
  description: 'Verify: Gateway handling 10K+ requests/second? Security features implemented? WebSocket working? Load balancing working?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-9',
  weekId: 'week-9-2',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'rust', 'gateway'],
  dependencies: ['task-5-6-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-7-2',
  title: 'Day 1-2: gRPC Setup',
  description: 'Define .proto files, Generate Rust code, Implement services, Create client libraries',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-9',
  weekId: 'week-9-3',
  estimatedHours: 12,
  tags: ['rust', 'integration', 'grpc'],
  dependencies: ['task-5-7'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-7-3',
  title: 'Day 3-4: Message Queue',
  description: 'Set up RabbitMQ or NATS, Implement producer, Implement consumer, Implement error handling',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-9',
  weekId: 'week-9-3',
  estimatedHours: 12,
  tags: ['rust', 'integration', 'message-queue'],
  dependencies: ['task-5-7'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-7-4',
  title: 'Day 5-7: Testing Integration',
  description: 'Write end-to-end tests, Test service communication, Test error scenarios, Test performance',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-9',
  weekId: 'week-9-3',
  estimatedHours: 12,
  tags: ['rust', 'integration', 'testing'],
  dependencies: ['task-5-7'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-5-7-5',
  title: 'Checkpoint: Service Integration',
  description: 'Verify: All Rust services communicating correctly? gRPC working? Message queue working? Tests passing?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-5',
  monthId: 'month-9',
  weekId: 'week-9-3',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'rust', 'integration'],
  dependencies: ['task-5-7-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Phase 6: Build Python AI Services (Months 10-11)
const phase6Tasks = [
  { id: 'task-6-1', title: 'SOC Agent Development - Week 1: Agent Foundation', desc: 'Project setup with Poetry, Base agent class, Tool interface, Memory management, Logging system, Tool development (query_siem, check_ioc, analyze_alert, enrich_context, execute_playbook)', phase: 6, month: 10, week: 1, priority: 'critical', hours: 40, tags: ['python', 'ai-agent', 'soc'] },
  { id: 'task-6-1-1', title: 'Project: Base SOC Agent with Tools', desc: 'Implement all tools, Test tool functionality, Agent decision making', phase: 6, month: 10, week: 1, priority: 'high', hours: 20, tags: ['python', 'project', 'soc-agent'], deps: ['task-6-1'] },
  { id: 'task-6-2', title: 'SOC Agent Development - Week 2: Threat Detection', desc: 'Log analysis with anomaly detection, Alert correlation (group related alerts, find attack chains, MITRE ATT&CK mapping), Threat intelligence integration (IOC enrichment, threat feed parsing)', phase: 6, month: 10, week: 2, priority: 'critical', hours: 40, tags: ['python', 'ai-agent', 'threat-detection'], deps: ['task-6-1'] },
  { id: 'task-6-3', title: 'SOC Agent Development - Week 3: Incident Response', desc: 'Playbook engine (YAML playbook definitions, conditional logic, action execution), Automated actions (block IP, isolate host, kill process, collect evidence, create ticket), Reporting (incident summary, timeline reconstruction, evidence collection, recommendations)', phase: 6, month: 10, week: 3, priority: 'critical', hours: 40, tags: ['python', 'ai-agent', 'incident-response'], deps: ['task-6-2'] },
  { id: 'task-6-3-1', title: 'Project: Complete SOC Agent', desc: 'Test with sample alerts, Verify all tools work, Check decision making, Validate reports', phase: 6, month: 10, week: 3, priority: 'high', hours: 24, tags: ['python', 'project', 'soc-agent'], deps: ['task-6-3'] },
  { id: 'task-6-4', title: 'Pentest Agent Development - Week 1: Reconnaissance Module', desc: 'OSINT tools (subdomain enumeration, DNS reconnaissance, WHOIS lookup, certificate transparency), Active scanning (port scanning, service detection, technology identification, directory enumeration), Attack surface mapping', phase: 6, month: 10, week: 4, priority: 'critical', hours: 40, tags: ['python', 'ai-agent', 'pentest', 'recon'] },
  { id: 'task-6-5', title: 'Pentest Agent Development - Week 2: Vulnerability Assessment', desc: 'CVE integration (NVD API integration, CPE matching, vulnerability lookup, exploit database search), Web app testing (SQL injection, XSS, CSRF, authentication flaws, file inclusion), Network testing (weak services, default credentials, misconfigurations, unpatched systems)', phase: 6, month: 11, week: 1, priority: 'critical', hours: 40, tags: ['python', 'ai-agent', 'pentest', 'vulnerability'], deps: ['task-6-4'] },
  { id: 'task-6-6', title: 'Pentest Agent Development - Week 3: Exploitation & Reporting', desc: 'Safe exploitation (PoC verification, Metasploit integration, exploit selection, payload generation, safety checks), Post-exploitation (privilege escalation, lateral movement, data collection, persistence check), Report generation (executive summary, technical findings, risk assessment, remediation plan, proof of concepts)', phase: 6, month: 11, week: 2, priority: 'critical', hours: 40, tags: ['python', 'ai-agent', 'pentest', 'exploitation'], deps: ['task-6-5'] },
  { id: 'task-6-6-1', title: 'Project: Complete Pentest Agent', desc: 'Test on DVWA, Test on HackTheBox, Verify safety features, Check report quality', phase: 6, month: 11, week: 2, priority: 'high', hours: 24, tags: ['python', 'project', 'pentest-agent'], deps: ['task-6-6'] },
  { id: 'task-6-7', title: 'Multi-Agent Orchestration - Make agents work together', desc: 'Agent coordinator (task delegation, result aggregation, conflict resolution, priority management), Communication protocol (agent-to-agent messaging, shared memory, state synchronization, event notifications), Collaborative workflows', phase: 6, month: 11, week: 3, priority: 'high', hours: 40, tags: ['python', 'ai-agent', 'orchestration'], deps: ['task-6-6'] },
  { id: 'task-6-7-1', title: 'Project: Multi-Agent Security Assessment', desc: 'Scanner agent finds assets, SOC agent checks threats, Pentest agent tests vulnerabilities, All results combined', phase: 6, month: 11, week: 3, priority: 'high', hours: 20, tags: ['python', 'project', 'multi-agent'], deps: ['task-6-7'] },
  { id: 'task-6-8', title: 'RAG Knowledge System - Build security knowledge base', desc: 'Data collection (CVE database, MITRE ATT&CK, security playbooks, best practices docs, tool documentation), Embedding & storage (document loading, text chunking, embedding generation, vector storage in Qdrant, metadata indexing), Retrieval system (semantic search, hybrid search, result re-ranking, context building, source citation)', phase: 6, month: 11, week: 4, priority: 'high', hours: 40, tags: ['python', 'rag', 'knowledge-base'], deps: ['task-6-7'] },
  { id: 'task-6-8-1', title: 'Project: Complete RAG System', desc: 'Test retrieval accuracy, Verify relevance, Check response time, Validate citations', phase: 6, month: 11, week: 4, priority: 'high', hours: 20, tags: ['python', 'project', 'rag'], deps: ['task-6-8'] },
];

// Expand Phase 6 with detailed tasks
allTasks.push({
  id: 'task-6-1-2',
  title: 'Day 1-3: Project Setup',
  description: 'Initialize Poetry project, Install dependencies (langchain, openai, anthropic, chromadb, fastapi), Set up project structure, Configure development environment',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-10',
  weekId: 'week-10-1',
  estimatedHours: 8,
  tags: ['python', 'ai-agent', 'setup'],
  dependencies: ['task-6-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-1-3',
  title: 'Day 4-5: Base Agent Class',
  description: 'Create agent base class, Implement tool interface, Implement memory management, Implement logging system',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-10',
  weekId: 'week-10-1',
  estimatedHours: 12,
  tags: ['python', 'ai-agent', 'development'],
  dependencies: ['task-6-1-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-1-4',
  title: 'Day 6-7: Tool Development',
  description: 'Implement query_siem tool, Implement check_ioc tool, Implement analyze_alert tool, Implement enrich_context tool, Implement execute_playbook tool',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-10',
  weekId: 'week-10-1',
  estimatedHours: 16,
  tags: ['python', 'ai-agent', 'tools'],
  dependencies: ['task-6-1-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-2-1',
  title: 'Day 1-2: Log Analysis',
  description: 'Implement anomaly detection in logs, Implement pattern matching, Implement statistical analysis, Implement baseline comparison',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-10',
  weekId: 'week-10-2',
  estimatedHours: 12,
  tags: ['python', 'ai-agent', 'logs', 'analysis'],
  dependencies: ['task-6-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-2-2',
  title: 'Day 3-4: Alert Correlation',
  description: 'Implement grouping related alerts, Implement finding attack chains, Implement MITRE ATT&CK mapping, Implement severity scoring',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-10',
  weekId: 'week-10-2',
  estimatedHours: 12,
  tags: ['python', 'ai-agent', 'alert-correlation'],
  dependencies: ['task-6-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-2-3',
  title: 'Day 5-7: Threat Intelligence',
  description: 'Implement IOC enrichment, Implement threat feed parsing, Implement reputation checking, Implement context gathering',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-10',
  weekId: 'week-10-2',
  estimatedHours: 12,
  tags: ['python', 'ai-agent', 'threat-intel'],
  dependencies: ['task-6-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-3-2',
  title: 'Day 1-3: Playbook Engine',
  description: 'Implement YAML playbook definitions, Implement conditional logic, Implement action execution, Implement state management',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-10',
  weekId: 'week-10-3',
  estimatedHours: 16,
  tags: ['python', 'ai-agent', 'playbook'],
  dependencies: ['task-6-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-3-3',
  title: 'Day 4-5: Automated Actions',
  description: 'Implement block IP address, Implement isolate host, Implement kill process, Implement collect evidence, Implement create ticket',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-10',
  weekId: 'week-10-3',
  estimatedHours: 12,
  tags: ['python', 'ai-agent', 'automation'],
  dependencies: ['task-6-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-3-4',
  title: 'Day 6-7: Reporting',
  description: 'Implement incident summary, Implement timeline reconstruction, Implement evidence collection, Implement recommendations',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-10',
  weekId: 'week-10-3',
  estimatedHours: 12,
  tags: ['python', 'ai-agent', 'reporting'],
  dependencies: ['task-6-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-3-5',
  title: 'Checkpoint: SOC Agent Development',
  description: 'Verify: SOC agent handling alerts automatically? All tools working? Decision making correct? Reports accurate?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-10',
  weekId: 'week-10-3',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'soc-agent'],
  dependencies: ['task-6-3-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-4-1',
  title: 'Day 1-2: OSINT Tools',
  description: 'Implement subdomain enumeration, Implement DNS reconnaissance, Implement WHOIS lookup, Implement certificate transparency, Implement social media search',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-10',
  weekId: 'week-10-4',
  estimatedHours: 12,
  tags: ['python', 'ai-agent', 'osint'],
  dependencies: ['task-6-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-4-2',
  title: 'Day 3-4: Active Scanning',
  description: 'Create port scanning tool (call Rust service), Create service detection tool, Create technology identification tool, Create directory enumeration tool',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-10',
  weekId: 'week-10-4',
  estimatedHours: 12,
  tags: ['python', 'ai-agent', 'scanning'],
  dependencies: ['task-6-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-4-3',
  title: 'Day 5-7: Attack Surface Mapping',
  description: 'Organize findings, Identify attack vectors, Prioritize targets, Generate scan report',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-10',
  weekId: 'week-10-4',
  estimatedHours: 12,
  tags: ['python', 'ai-agent', 'attack-surface'],
  dependencies: ['task-6-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-5-1',
  title: 'Day 1-2: CVE Integration',
  description: 'Implement NVD API integration, Implement CPE matching, Implement vulnerability lookup, Implement exploit database search',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-11',
  weekId: 'week-11-1',
  estimatedHours: 12,
  tags: ['python', 'ai-agent', 'cve'],
  dependencies: ['task-6-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-5-2',
  title: 'Day 3-4: Web App Testing',
  description: 'Test for SQL injection, Test for XSS vulnerabilities, Test for CSRF issues, Test for authentication flaws, Test for file inclusion',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-11',
  weekId: 'week-11-1',
  estimatedHours: 12,
  tags: ['python', 'ai-agent', 'web-testing'],
  dependencies: ['task-6-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-5-3',
  title: 'Day 5-7: Network Testing',
  description: 'Check for weak services, Check for default credentials, Check for misconfigurations, Check for unpatched systems',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-11',
  weekId: 'week-11-1',
  estimatedHours: 12,
  tags: ['python', 'ai-agent', 'network-testing'],
  dependencies: ['task-6-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-6-2',
  title: 'Day 1-3: Safe Exploitation',
  description: 'Implement PoC verification, Implement Metasploit integration, Implement exploit selection, Implement payload generation, Implement safety checks',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-11',
  weekId: 'week-11-2',
  estimatedHours: 16,
  tags: ['python', 'ai-agent', 'exploitation'],
  dependencies: ['task-6-6'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-6-3',
  title: 'Day 4-5: Post-Exploitation',
  description: 'Implement privilege escalation, Implement lateral movement, Implement data collection, Implement persistence check',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-11',
  weekId: 'week-11-2',
  estimatedHours: 12,
  tags: ['python', 'ai-agent', 'post-exploit'],
  dependencies: ['task-6-6'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-6-4',
  title: 'Day 6-7: Report Generation',
  description: 'Implement executive summary, Implement technical findings, Implement risk assessment, Implement remediation plan, Implement proof of concepts',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-11',
  weekId: 'week-11-2',
  estimatedHours: 12,
  tags: ['python', 'ai-agent', 'reporting'],
  dependencies: ['task-6-6'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-6-5',
  title: 'Checkpoint: Pentest Agent Development',
  description: 'Verify: Pentest agent completing assessments? Safety features working? Report quality good?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-11',
  weekId: 'week-11-2',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'pentest-agent'],
  dependencies: ['task-6-6-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-7-2',
  title: 'Day 1-2: Agent Coordinator',
  description: 'Implement task delegation, Implement result aggregation, Implement conflict resolution, Implement priority management',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-11',
  weekId: 'week-11-3',
  estimatedHours: 12,
  tags: ['python', 'ai-agent', 'orchestration'],
  dependencies: ['task-6-7'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-7-3',
  title: 'Day 3-4: Communication Protocol',
  description: 'Implement agent-to-agent messaging, Implement shared memory, Implement state synchronization, Implement event notifications',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-11',
  weekId: 'week-11-3',
  estimatedHours: 12,
  tags: ['python', 'ai-agent', 'communication'],
  dependencies: ['task-6-7'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-7-4',
  title: 'Day 5-7: Collaborative Workflows',
  description: 'Implement full security assessment workflow, Implement incident investigation workflow, Test agent collaboration',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-11',
  weekId: 'week-11-3',
  estimatedHours: 12,
  tags: ['python', 'ai-agent', 'workflows'],
  dependencies: ['task-6-7'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-7-5',
  title: 'Checkpoint: Multi-Agent Orchestration',
  description: 'Verify: Agents collaborating effectively? Data sharing working? Coordination correct?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-11',
  weekId: 'week-11-3',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'multi-agent'],
  dependencies: ['task-6-7-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-8-2',
  title: 'Day 1-2: Data Collection',
  description: 'Gather CVE database, Gather MITRE ATT&CK, Gather security playbooks, Gather best practices docs, Gather tool documentation',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-11',
  weekId: 'week-11-4',
  estimatedHours: 8,
  tags: ['python', 'rag', 'data-collection'],
  dependencies: ['task-6-8'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-8-3',
  title: 'Day 3-4: Embedding & Storage',
  description: 'Implement document loading, Implement text chunking, Implement embedding generation, Implement vector storage in Qdrant, Implement metadata indexing',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-11',
  weekId: 'week-11-4',
  estimatedHours: 12,
  tags: ['python', 'rag', 'embeddings'],
  dependencies: ['task-6-8'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-8-4',
  title: 'Day 5-7: Retrieval System',
  description: 'Implement semantic search, Implement hybrid search, Implement result re-ranking, Implement context building, Implement source citation',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-11',
  weekId: 'week-11-4',
  estimatedHours: 12,
  tags: ['python', 'rag', 'retrieval'],
  dependencies: ['task-6-8'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-6-8-5',
  title: 'Checkpoint: RAG Knowledge System',
  description: 'Verify: RAG system providing accurate knowledge? Retrieval working? Citations correct?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-6',
  monthId: 'month-11',
  weekId: 'week-11-4',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'rag'],
  dependencies: ['task-6-8-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Phase 7: Frontend Development (Months 12-13)
const phase7Tasks = [
  { id: 'task-7-1', title: 'React Project Setup - Set up modern React application', desc: 'Initialize project with Vite, Install dependencies (React Router, TanStack Query, Zustand, shadcn/ui, Tailwind CSS, Recharts, Socket.IO client), Configure routing, Set up API client, Create layout components, Set up authentication, Configure theme system', phase: 7, month: 12, week: 1, priority: 'high', hours: 24, tags: ['react', 'frontend', 'setup'] },
  { id: 'task-7-2', title: 'Authentication UI - Login and auth flows', desc: 'Login page (email/password form, remember me, forgot password, form validation, error handling, loading states), Authentication flow (JWT token storage, auto-refresh tokens, protected routes, redirect after login, logout functionality), User management (user profile, change password, account settings, API key management)', phase: 7, month: 12, week: 2, priority: 'high', hours: 24, tags: ['react', 'frontend', 'authentication'], deps: ['task-7-1'] },
  { id: 'task-7-3', title: 'SOC Dashboard - Security operations center interface', desc: 'Main dashboard widgets (active alerts counter, threat level gauge, recent incidents timeline, top attacked assets, geographic threat map, alert severity breakdown), Alert management (alert list with filtering, alert details view, status management, assignment workflow, bulk actions, export capabilities), Incident response pages (incident dashboard, investigation workspace, timeline view, evidence collection, playbook execution, collaboration features), Threat intelligence (IOC search, threat feed viewer, campaign tracker, actor profiles, TTP mapping)', phase: 7, month: 12, week: 3, priority: 'critical', hours: 80, tags: ['react', 'frontend', 'soc', 'dashboard'], deps: ['task-7-2'] },
  { id: 'task-7-4', title: 'Pentest Interface - Penetration testing interface', desc: 'Scan configuration (target input, scan type selection, options configuration, schedule setup, save templates), Scan monitoring (real-time progress bar, current activity, found services, discovered vulnerabilities, live logs), Results viewer (vulnerability list, risk scoring, filtering/sorting, vulnerability details, exploitation status, remediation tracking), Report generation (report templates, custom sections, export formats PDF/HTML/JSON, executive summary, technical details, remediation plan)', phase: 7, month: 12, week: 4, priority: 'critical', hours: 80, tags: ['react', 'frontend', 'pentest'], deps: ['task-7-2'] },
  { id: 'task-7-5', title: 'Asset Management - Track all security assets', desc: 'Asset inventory (asset list view, asset details, categorization, tagging system, search and filter), Asset details (basic information, network details, running services, discovered vulnerabilities, associated alerts, scan history), Asset relationships (network topology visualization, dependencies, communication flows, risk propagation)', phase: 7, month: 13, week: 1, priority: 'high', hours: 40, tags: ['react', 'frontend', 'assets'], deps: ['task-7-2'] },
  { id: 'task-7-6', title: 'Advanced Features - Polish and advanced functionality', desc: 'Real-time updates (WebSocket connection, live alert notifications, scan progress updates, system status updates, toast notifications), Search & filters (global search, advanced filters, saved searches, quick filters, filter combinations), Dark mode (theme toggle, dark color scheme, persistent preference, smooth transitions), Export & reporting (CSV export, PDF generation, custom reports, scheduled reports, email delivery), Help & documentation (in-app help, tooltips, onboarding tour, video tutorials, documentation links)', phase: 7, month: 13, week: 2, priority: 'high', hours: 60, tags: ['react', 'frontend', 'advanced'], deps: ['task-7-5'] },
];

// Expand Phase 7 with detailed tasks
allTasks.push({
  id: 'task-7-1-1',
  title: 'Day 1: Initialize Project',
  description: 'Run: npm create vite@latest frontend -- --template react-ts, cd frontend, npm install',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-12',
  weekId: 'week-12-1',
  estimatedHours: 2,
  tags: ['react', 'frontend', 'setup'],
  dependencies: ['task-7-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-1-2',
  title: 'Day 2: Project Structure',
  description: 'Create components directory, Create pages directory, Create hooks directory, Create services directory, Create store directory, Create types directory, Create utils directory',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-12',
  weekId: 'week-12-1',
  estimatedHours: 4,
  tags: ['react', 'frontend', 'structure'],
  dependencies: ['task-7-1-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-1-3',
  title: 'Day 3: Base Setup',
  description: 'Configure routing, Set up API client, Create layout components, Set up authentication, Configure theme system',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-12',
  weekId: 'week-12-1',
  estimatedHours: 8,
  tags: ['react', 'frontend', 'setup'],
  dependencies: ['task-7-1-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-1-4',
  title: 'Checkpoint: React Project Setup',
  description: 'Verify: React app running with routing? API client configured? Layout components created?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-12',
  weekId: 'week-12-1',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'react'],
  dependencies: ['task-7-1-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-2-1',
  title: 'Day 1: Login Page',
  description: 'Create email/password form, Add remember me checkbox, Add forgot password link, Implement form validation, Implement error handling, Implement loading states',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-12',
  weekId: 'week-12-2',
  estimatedHours: 8,
  tags: ['react', 'frontend', 'authentication'],
  dependencies: ['task-7-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-2-2',
  title: 'Day 2: Authentication Flow',
  description: 'Implement JWT token storage, Implement auto-refresh tokens, Implement protected routes, Implement redirect after login, Implement logout functionality',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-12',
  weekId: 'week-12-2',
  estimatedHours: 8,
  tags: ['react', 'frontend', 'authentication'],
  dependencies: ['task-7-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-2-3',
  title: 'Day 3: User Management',
  description: 'Create user profile page, Create change password page, Create account settings page, Create API key management page',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-12',
  weekId: 'week-12-2',
  estimatedHours: 8,
  tags: ['react', 'frontend', 'user-management'],
  dependencies: ['task-7-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-2-4',
  title: 'Checkpoint: Authentication UI',
  description: 'Verify: Authentication working end-to-end? Token refresh working? Protected routes working?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-12',
  weekId: 'week-12-2',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'authentication'],
  dependencies: ['task-7-2-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-3-1',
  title: 'Day 1-2: Main Dashboard',
  description: 'Create active alerts counter widget, Create threat level gauge widget, Create recent incidents timeline widget, Create top attacked assets widget, Create geographic threat map widget, Create alert severity breakdown widget',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-12',
  weekId: 'week-12-3',
  estimatedHours: 20,
  tags: ['react', 'frontend', 'dashboard', 'widgets'],
  dependencies: ['task-7-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-3-2',
  title: 'Day 3-4: Alert Management',
  description: 'Create alert list with filtering, Create alert details view, Implement status management, Implement assignment workflow, Implement bulk actions, Implement export capabilities',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-12',
  weekId: 'week-12-3',
  estimatedHours: 20,
  tags: ['react', 'frontend', 'alerts'],
  dependencies: ['task-7-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-3-3',
  title: 'Day 5-6: Incident Response',
  description: 'Create incident dashboard, Create investigation workspace, Create timeline view, Create evidence collection, Create playbook execution, Create collaboration features',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-12',
  weekId: 'week-12-3',
  estimatedHours: 20,
  tags: ['react', 'frontend', 'incident-response'],
  dependencies: ['task-7-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-3-4',
  title: 'Day 7: Threat Intelligence',
  description: 'Create IOC search, Create threat feed viewer, Create campaign tracker, Create actor profiles, Create TTP mapping',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-12',
  weekId: 'week-12-3',
  estimatedHours: 8,
  tags: ['react', 'frontend', 'threat-intel'],
  dependencies: ['task-7-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-4-1',
  title: 'Day 1-2: Scan Configuration',
  description: 'Create target input (IP, domain, range), Create scan type selection, Create options configuration, Create schedule setup, Create save templates',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-12',
  weekId: 'week-12-4',
  estimatedHours: 20,
  tags: ['react', 'frontend', 'pentest', 'scanning'],
  dependencies: ['task-7-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-4-2',
  title: 'Day 3-4: Scan Monitoring',
  description: 'Create real-time progress bar, Create current activity display, Create found services display, Create discovered vulnerabilities display, Create live logs',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-12',
  weekId: 'week-12-4',
  estimatedHours: 20,
  tags: ['react', 'frontend', 'pentest', 'monitoring'],
  dependencies: ['task-7-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-4-3',
  title: 'Day 5-6: Results Viewer',
  description: 'Create vulnerability list, Create risk scoring, Create filtering/sorting, Create vulnerability details, Create exploitation status, Create remediation tracking',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-12',
  weekId: 'week-12-4',
  estimatedHours: 20,
  tags: ['react', 'frontend', 'pentest', 'results'],
  dependencies: ['task-7-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-4-4',
  title: 'Day 7: Report Generation',
  description: 'Create report templates, Create custom sections, Implement export formats (PDF, HTML, JSON), Create executive summary, Create technical details, Create remediation plan',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-12',
  weekId: 'week-12-4',
  estimatedHours: 8,
  tags: ['react', 'frontend', 'pentest', 'reporting'],
  dependencies: ['task-7-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-4-5',
  title: 'Checkpoint: Pentest Interface',
  description: 'Verify: Pentest interface complete? All features working? Reports generating correctly?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-12',
  weekId: 'week-12-4',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'pentest'],
  dependencies: ['task-7-4-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-5-1',
  title: 'Day 1: Asset Inventory',
  description: 'Create asset list view, Create asset details, Implement categorization, Implement tagging system, Implement search and filter',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-13',
  weekId: 'week-13-1',
  estimatedHours: 12,
  tags: ['react', 'frontend', 'assets'],
  dependencies: ['task-7-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-5-2',
  title: 'Day 2: Asset Details',
  description: 'Show basic information, Show network details, Show running services, Show discovered vulnerabilities, Show associated alerts, Show scan history',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-13',
  weekId: 'week-13-1',
  estimatedHours: 12,
  tags: ['react', 'frontend', 'assets'],
  dependencies: ['task-7-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-5-3',
  title: 'Day 3: Asset Relationships',
  description: 'Visualize network topology, Visualize dependencies, Visualize communication flows, Visualize risk propagation',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-13',
  weekId: 'week-13-1',
  estimatedHours: 12,
  tags: ['react', 'frontend', 'assets', 'visualization'],
  dependencies: ['task-7-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-5-4',
  title: 'Checkpoint: Asset Management',
  description: 'Verify: Asset management working? All features implemented? Visualization working?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-13',
  weekId: 'week-13-1',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'assets'],
  dependencies: ['task-7-5-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-6-1',
  title: 'Day 1-2: Real-time Updates',
  description: 'Implement WebSocket connection, Implement live alert notifications, Implement scan progress updates, Implement system status updates, Implement toast notifications',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-13',
  weekId: 'week-13-2',
  estimatedHours: 16,
  tags: ['react', 'frontend', 'realtime'],
  dependencies: ['task-7-6'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-6-2',
  title: 'Day 3-4: Search & Filters',
  description: 'Implement global search, Implement advanced filters, Implement saved searches, Implement quick filters, Implement filter combinations',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-13',
  weekId: 'week-13-2',
  estimatedHours: 16,
  tags: ['react', 'frontend', 'search'],
  dependencies: ['task-7-6'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-6-3',
  title: 'Day 5: Dark Mode',
  description: 'Implement theme toggle, Implement dark color scheme, Implement persistent preference, Implement smooth transitions',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-7',
  monthId: 'month-13',
  weekId: 'week-13-2',
  estimatedHours: 8,
  tags: ['react', 'frontend', 'dark-mode'],
  dependencies: ['task-7-6'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-6-4',
  title: 'Day 6: Export & Reporting',
  description: 'Implement CSV export, Implement PDF generation, Implement custom reports, Implement scheduled reports, Implement email delivery',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-13',
  weekId: 'week-13-2',
  estimatedHours: 12,
  tags: ['react', 'frontend', 'export'],
  dependencies: ['task-7-6'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-6-5',
  title: 'Day 7: Help & Documentation',
  description: 'Create in-app help, Create tooltips, Create onboarding tour, Create video tutorials, Create documentation links',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-7',
  monthId: 'month-13',
  weekId: 'week-13-2',
  estimatedHours: 8,
  tags: ['react', 'frontend', 'help'],
  dependencies: ['task-7-6'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-7-6-6',
  title: 'Checkpoint: Advanced Features',
  description: 'Verify: All features polished? Real-time updates working? Search working? Dark mode working?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-7',
  monthId: 'month-13',
  weekId: 'week-13-2',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'frontend'],
  dependencies: ['task-7-6-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Phase 8: Integration & Testing (Month 14)
const phase8Tasks = [
  { id: 'task-8-1', title: 'Backend-Frontend Integration - Connect all pieces together', desc: 'API integration (connect to all endpoints, handle errors gracefully, loading states, retry logic, request caching), WebSocket integration (connect to WebSocket server, handle events, update UI in real-time, reconnection logic, error handling), End-to-end workflows (user login → Dashboard, configure scan → run scan → view results, alert received → investigate → respond, generate report → export → email)', phase: 8, month: 14, week: 1, priority: 'critical', hours: 60, tags: ['integration', 'frontend', 'backend'] },
  { id: 'task-8-2', title: 'Third-Party Integrations - Integrate external services', desc: 'SIEM integrations (Splunk API client, query Splunk data, send data to Splunk, alert forwarding; Elastic/ELK client, query logs, send events, dashboard integration; Microsoft Sentinel Azure API authentication, query workspace, create incidents, sync alerts), Collaboration tools (Slack API integration, send notifications, interactive messages, slash commands; Jira API client, create tickets, update status, sync comments; Email & PagerDuty SMTP configuration, email templates, PagerDuty API, incident routing)', phase: 8, month: 14, week: 2, priority: 'high', hours: 80, tags: ['integration', 'third-party', 'siem'] },
  { id: 'task-8-3', title: 'Testing Suite - Comprehensive test coverage', desc: 'Unit tests (Rust tests for all functions, mock dependencies, edge cases, error conditions; Python tests with pytest, target 80%+ code coverage), Integration tests (service-to-service communication, database operations, API endpoints, message queue, cache operations), End-to-end tests (use Playwright or Cypress: user registration/login, complete scan workflow, alert investigation, report generation), Performance tests (test with k6: API load testing, concurrent users, response times, database performance, memory usage; target: API response < 100ms p95, throughput 10,000 requests/sec, uptime 99.9%, error rate < 0.1%)', phase: 8, month: 14, week: 3, priority: 'critical', hours: 80, tags: ['testing', 'quality', 'performance'] },
  { id: 'task-8-4', title: 'Security Testing - Test your own security', desc: 'SAST (Static Analysis: Bandit for Python, Cargo audit for Rust, npm audit for Node, SonarQube, Semgrep; fix all findings), DAST (Dynamic Analysis: OWASP ZAP, Burp Suite, SQLmap, Nikto; find and fix vulnerabilities), Penetration test (authentication bypass, authorization flaws, injection attacks, XSS vulnerabilities, API security, infrastructure security; fix all issues found)', phase: 8, month: 14, week: 4, priority: 'critical', hours: 60, tags: ['security', 'testing', 'hardening'] },
];

// Expand Phase 8 with detailed tasks
allTasks.push({
  id: 'task-8-1-1',
  title: 'Day 1-2: API Integration',
  description: 'Connect to all endpoints, Handle errors gracefully, Implement loading states, Implement retry logic, Implement request caching',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-1',
  estimatedHours: 20,
  tags: ['integration', 'api', 'frontend'],
  dependencies: ['task-8-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-1-2',
  title: 'Day 3-4: WebSocket Integration',
  description: 'Connect to WebSocket server, Handle events, Update UI in real-time, Implement reconnection logic, Implement error handling',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-1',
  estimatedHours: 20,
  tags: ['integration', 'websocket', 'realtime'],
  dependencies: ['task-8-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-1-3',
  title: 'Day 5-7: End-to-End Workflows',
  description: 'Test user login → Dashboard, Test configure scan → run scan → view results, Test alert received → investigate → respond, Test generate report → export → email',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-1',
  estimatedHours: 20,
  tags: ['integration', 'workflows', 'testing'],
  dependencies: ['task-8-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-1-4',
  title: 'Checkpoint: Backend-Frontend Integration',
  description: 'Verify: Full workflows working? All endpoints connected? WebSocket working?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-1',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'integration'],
  dependencies: ['task-8-1-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-2-1',
  title: 'Week 1: SIEM Integrations',
  description: 'Splunk: Create API client, Query Splunk data, Send data to Splunk, Forward alerts. Elastic/ELK: Create client, Query logs, Send events, Integrate dashboard. Microsoft Sentinel: Authenticate with Azure API, Query workspace, Create incidents, Sync alerts',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-2',
  estimatedHours: 40,
  tags: ['integration', 'siem'],
  dependencies: ['task-8-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-2-2',
  title: 'Day 1-2: Splunk Integration',
  description: 'Create Splunk API client, Implement query Splunk data, Implement send data to Splunk, Implement alert forwarding',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-2',
  estimatedHours: 12,
  tags: ['integration', 'splunk'],
  dependencies: ['task-8-2-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-2-3',
  title: 'Day 3-4: Elastic/ELK Integration',
  description: 'Create Elastic/ELK client, Implement query logs, Implement send events, Implement dashboard integration',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-2',
  estimatedHours: 12,
  tags: ['integration', 'elastic', 'elk'],
  dependencies: ['task-8-2-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-2-4',
  title: 'Day 5-7: Microsoft Sentinel Integration',
  description: 'Authenticate with Azure API, Query workspace, Create incidents, Sync alerts',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-2',
  estimatedHours: 12,
  tags: ['integration', 'sentinel', 'azure'],
  dependencies: ['task-8-2-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-2-5',
  title: 'Week 2: Collaboration Tools',
  description: 'Slack: Create API integration, Send notifications, Create interactive messages, Create slash commands. Jira: Create API client, Create tickets, Update status, Sync comments. Email & PagerDuty: Configure SMTP, Create email templates, Integrate PagerDuty API, Implement incident routing',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-2',
  estimatedHours: 40,
  tags: ['integration', 'collaboration'],
  dependencies: ['task-8-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-2-6',
  title: 'Day 1-2: Slack Integration',
  description: 'Create Slack API integration, Implement send notifications, Implement interactive messages, Implement slash commands',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-2',
  estimatedHours: 12,
  tags: ['integration', 'slack'],
  dependencies: ['task-8-2-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-2-7',
  title: 'Day 3-4: Jira Integration',
  description: 'Create Jira API client, Implement create tickets, Implement update status, Implement sync comments',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-2',
  estimatedHours: 12,
  tags: ['integration', 'jira'],
  dependencies: ['task-8-2-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-2-8',
  title: 'Day 5-7: Email & PagerDuty',
  description: 'Configure SMTP, Create email templates, Integrate PagerDuty API, Implement incident routing',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-2',
  estimatedHours: 12,
  tags: ['integration', 'email', 'pagerduty'],
  dependencies: ['task-8-2-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-2-9',
  title: 'Checkpoint: Third-Party Integrations',
  description: 'Verify: All integrations working? SIEM integrations functional? Collaboration tools working?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-2',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'integrations'],
  dependencies: ['task-8-2-8'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-3-1',
  title: 'Day 1-2: Unit Tests',
  description: 'Rust: Test all functions, Mock dependencies, Test edge cases, Test error conditions. Python: Write tests with pytest, Target 80%+ code coverage',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-3',
  estimatedHours: 20,
  tags: ['testing', 'unit-tests'],
  dependencies: ['task-8-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-3-2',
  title: 'Day 3-4: Integration Tests',
  description: 'Test service-to-service communication, Test database operations, Test API endpoints, Test message queue, Test cache operations',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-3',
  estimatedHours: 20,
  tags: ['testing', 'integration-tests'],
  dependencies: ['task-8-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-3-3',
  title: 'Day 5-6: End-to-End Tests',
  description: 'Use Playwright or Cypress: Test user registration/login, Test complete scan workflow, Test alert investigation, Test report generation',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-3',
  estimatedHours: 20,
  tags: ['testing', 'e2e-tests'],
  dependencies: ['task-8-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-3-4',
  title: 'Day 7: Performance Tests',
  description: 'Test with k6: API load testing, Test concurrent users, Test response times, Test database performance, Test memory usage. Target: API response < 100ms p95, throughput 10,000 requests/sec, uptime 99.9%, error rate < 0.1%',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-3',
  estimatedHours: 8,
  tags: ['testing', 'performance'],
  dependencies: ['task-8-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-3-5',
  title: 'Checkpoint: Testing Suite',
  description: 'Verify: All tests passing? 80%+ code coverage? Performance targets met?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-3',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'testing'],
  dependencies: ['task-8-3-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-4-1',
  title: 'Day 1: SAST (Static Analysis)',
  description: 'Run Bandit for Python, Run Cargo audit for Rust, Run npm audit for Node, Run SonarQube, Run Semgrep, Fix all findings',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-4',
  estimatedHours: 16,
  tags: ['security', 'testing', 'sast'],
  dependencies: ['task-8-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-4-2',
  title: 'Day 2: DAST (Dynamic Analysis)',
  description: 'Test with OWASP ZAP, Test with Burp Suite, Test with SQLmap, Test with Nikto, Find and fix vulnerabilities',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-4',
  estimatedHours: 16,
  tags: ['security', 'testing', 'dast'],
  dependencies: ['task-8-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-4-3',
  title: 'Day 3: Penetration Test',
  description: 'Test authentication bypass, Test authorization flaws, Test injection attacks, Test XSS vulnerabilities, Test API security, Test infrastructure security, Fix all issues found',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-4',
  estimatedHours: 16,
  tags: ['security', 'testing', 'pentest'],
  dependencies: ['task-8-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-8-4-4',
  title: 'Checkpoint: Security Testing',
  description: 'Verify: No critical vulnerabilities? All findings fixed? Security hardened?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-8',
  monthId: 'month-14',
  weekId: 'week-14-4',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'security'],
  dependencies: ['task-8-4-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Phase 9: Production Deployment (Month 15)
const phase9Tasks = [
  { id: 'task-9-1', title: 'Cloud Infrastructure - Set up production infrastructure', desc: 'Choose cloud provider (AWS/Google Cloud/Azure/Digital Ocean), Infrastructure as Code with Terraform (define all resources, VPC and networking, compute instances, databases, load balancers, storage), Kubernetes setup (create EKS/GKE/AKS cluster, configure node pools, set up Ingress, configure autoscaling, set up monitoring), Networking (DNS configuration, SSL certificates, CDN setup, DDoS protection, firewall rules)', phase: 9, month: 15, week: 1, priority: 'critical', hours: 80, tags: ['devops', 'cloud', 'infrastructure'] },
  { id: 'task-9-2', title: 'Database Setup - Production databases', desc: 'PostgreSQL (create managed database, configure replication, set up backups, performance tuning, connection pooling), Other databases (Redis cluster, Qdrant deployment, TimescaleDB setup, backup configuration)', phase: 9, month: 15, week: 2, priority: 'critical', hours: 40, tags: ['devops', 'database', 'production'] },
  { id: 'task-9-3', title: 'Container Deployment - Deploy all services', desc: 'Dockerize services (create Dockerfiles for Rust services, Python services, Frontend; optimize with multi-stage builds, small image sizes, security scanning), Kubernetes manifests (create Deployments, Services, ConfigMaps, Secrets, Ingress), Deploy (push images to registry, apply Kubernetes manifests, configure health checks, set up autoscaling, verify all services running)', phase: 9, month: 15, week: 3, priority: 'critical', hours: 60, tags: ['devops', 'docker', 'kubernetes'] },
  { id: 'task-9-4', title: 'Monitoring & Logging - Observability stack', desc: 'Metrics (set up Prometheus: service metrics, custom metrics, alert rules, Grafana dashboards), Logging (set up Loki for logs, log aggregation, log retention, log analysis, error tracking with Sentry), Also set up (distributed tracing with Tempo, APM Application Performance Monitoring, uptime monitoring, status page)', phase: 9, month: 15, week: 4, priority: 'high', hours: 40, tags: ['devops', 'monitoring', 'observability'] },
  { id: 'task-9-5', title: 'CI/CD Pipeline - Automated deployment', desc: 'GitHub Actions (create workflows for: run tests on PR, build Docker images, security scanning, code quality checks), Deployment pipeline (automate: deploy to staging, run smoke tests, deploy to production, rollback capability)', phase: 9, month: 15, week: 4, priority: 'high', hours: 40, tags: ['devops', 'cicd', 'automation'] },
];

// Expand Phase 9 with detailed tasks
allTasks.push({
  id: 'task-9-1-1',
  title: 'Day 1: Choose Cloud Provider',
  description: 'Evaluate AWS, Evaluate Google Cloud, Evaluate Azure, Evaluate Digital Ocean, Choose provider based on requirements',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-9',
  monthId: 'month-15',
  weekId: 'week-15-1',
  estimatedHours: 8,
  tags: ['devops', 'cloud', 'selection'],
  dependencies: ['task-9-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-9-1-2',
  title: 'Day 2-3: Infrastructure as Code',
  description: 'Set up Terraform, Define all resources, Define VPC and networking, Define compute instances, Define databases, Define load balancers, Define storage',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-9',
  monthId: 'month-15',
  weekId: 'week-15-1',
  estimatedHours: 24,
  tags: ['devops', 'terraform', 'iac'],
  dependencies: ['task-9-1-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-9-1-3',
  title: 'Day 4-5: Kubernetes Setup',
  description: 'Create EKS/GKE/AKS cluster, Configure node pools, Set up Ingress, Configure autoscaling, Set up monitoring',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-9',
  monthId: 'month-15',
  weekId: 'week-15-1',
  estimatedHours: 24,
  tags: ['devops', 'kubernetes', 'setup'],
  dependencies: ['task-9-1-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-9-1-4',
  title: 'Day 6-7: Networking',
  description: 'Configure DNS, Configure SSL certificates, Set up CDN, Set up DDoS protection, Configure firewall rules',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-9',
  monthId: 'month-15',
  weekId: 'week-15-1',
  estimatedHours: 16,
  tags: ['devops', 'networking', 'security'],
  dependencies: ['task-9-1-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-9-1-5',
  title: 'Checkpoint: Cloud Infrastructure',
  description: 'Verify: Infrastructure ready? Kubernetes cluster running? Networking configured?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-9',
  monthId: 'month-15',
  weekId: 'week-15-1',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'infrastructure'],
  dependencies: ['task-9-1-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-9-2-1',
  title: 'Day 1: PostgreSQL Setup',
  description: 'Create managed database, Configure replication, Set up backups, Performance tuning, Connection pooling',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-9',
  monthId: 'month-15',
  weekId: 'week-15-2',
  estimatedHours: 16,
  tags: ['devops', 'database', 'postgresql'],
  dependencies: ['task-9-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-9-2-2',
  title: 'Day 2: Other Databases',
  description: 'Deploy Redis cluster, Deploy Qdrant, Set up TimescaleDB, Configure backup configuration',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-9',
  monthId: 'month-15',
  weekId: 'week-15-2',
  estimatedHours: 16,
  tags: ['devops', 'database', 'setup'],
  dependencies: ['task-9-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-9-2-3',
  title: 'Checkpoint: Database Setup',
  description: 'Verify: Databases production-ready? Backups configured? Performance optimized?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-9',
  monthId: 'month-15',
  weekId: 'week-15-2',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'database'],
  dependencies: ['task-9-2-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-9-3-1',
  title: 'Day 1: Dockerize Services',
  description: 'Create Dockerfiles for Rust services, Create Dockerfiles for Python services, Create Dockerfile for Frontend, Optimize with multi-stage builds, Minimize image sizes, Run security scanning',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-9',
  monthId: 'month-15',
  weekId: 'week-15-3',
  estimatedHours: 16,
  tags: ['devops', 'docker', 'containerization'],
  dependencies: ['task-9-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-9-3-2',
  title: 'Day 2: Kubernetes Manifests',
  description: 'Create Deployments, Create Services, Create ConfigMaps, Create Secrets, Create Ingress',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-9',
  monthId: 'month-15',
  weekId: 'week-15-3',
  estimatedHours: 16,
  tags: ['devops', 'kubernetes', 'manifests'],
  dependencies: ['task-9-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-9-3-3',
  title: 'Day 3: Deploy',
  description: 'Push images to registry, Apply Kubernetes manifests, Configure health checks, Set up autoscaling, Verify all services running',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-9',
  monthId: 'month-15',
  weekId: 'week-15-3',
  estimatedHours: 16,
  tags: ['devops', 'deployment', 'kubernetes'],
  dependencies: ['task-9-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-9-3-4',
  title: 'Checkpoint: Container Deployment',
  description: 'Verify: All services deployed? Health checks passing? Autoscaling working?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-9',
  monthId: 'month-15',
  weekId: 'week-15-3',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'deployment'],
  dependencies: ['task-9-3-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-9-4-1',
  title: 'Day 1: Metrics',
  description: 'Set up Prometheus, Configure service metrics, Configure custom metrics, Create alert rules, Create Grafana dashboards',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-9',
  monthId: 'month-15',
  weekId: 'week-15-4',
  estimatedHours: 16,
  tags: ['devops', 'monitoring', 'prometheus'],
  dependencies: ['task-9-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-9-4-2',
  title: 'Day 2: Logging',
  description: 'Set up Loki for logs, Configure log aggregation, Configure log retention, Configure log analysis, Set up error tracking with Sentry, Set up distributed tracing with Tempo, Set up APM, Set up uptime monitoring, Set up status page',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-9',
  monthId: 'month-15',
  weekId: 'week-15-4',
  estimatedHours: 16,
  tags: ['devops', 'monitoring', 'logging'],
  dependencies: ['task-9-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-9-4-3',
  title: 'Checkpoint: Monitoring & Logging',
  description: 'Verify: Full observability? Metrics working? Logs aggregating? Alerts configured?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-9',
  monthId: 'month-15',
  weekId: 'week-15-4',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'monitoring'],
  dependencies: ['task-9-4-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-9-5-1',
  title: 'Day 1: GitHub Actions',
  description: 'Create workflows for: run tests on PR, build Docker images, security scanning, code quality checks',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-9',
  monthId: 'month-15',
  weekId: 'week-15-4',
  estimatedHours: 16,
  tags: ['devops', 'cicd', 'github-actions'],
  dependencies: ['task-9-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-9-5-2',
  title: 'Day 2: Deployment Pipeline',
  description: 'Automate: deploy to staging, run smoke tests, deploy to production, rollback capability',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-9',
  monthId: 'month-15',
  weekId: 'week-15-4',
  estimatedHours: 16,
  tags: ['devops', 'cicd', 'deployment'],
  dependencies: ['task-9-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-9-5-3',
  title: 'Checkpoint: CI/CD Pipeline',
  description: 'Verify: Automated deployments working? Tests running? Rollback working?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-9',
  monthId: 'month-15',
  weekId: 'week-15-4',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'cicd'],
  dependencies: ['task-9-5-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Phase 10: Security Hardening (Month 16)
const phase10Tasks = [
  { id: 'task-10-1', title: 'Authentication & Authorization - Secure access control', desc: 'OAuth2/OIDC (OAuth2 server, SSO integration, SAML support, social login), MFA (TOTP Time-based OTP, SMS verification, backup codes, recovery flow), RBAC (role definitions, permission system, fine-grained access, audit logging)', phase: 10, month: 16, week: 1, priority: 'critical', hours: 60, tags: ['security', 'authentication', 'authorization'] },
  { id: 'task-10-2', title: 'Data Protection - Encrypt sensitive data', desc: 'Encryption at rest (database encryption, file encryption, backup encryption, key management with Vault), Encryption in transit (TLS 1.3 everywhere, certificate management, perfect forward secrecy, HSTS enabled), Secrets management (HashiCorp Vault setup, rotate secrets regularly, secure API keys, environment variables)', phase: 10, month: 16, week: 2, priority: 'critical', hours: 40, tags: ['security', 'encryption', 'data-protection'] },
  { id: 'task-10-3', title: 'Compliance Preparation - Prepare for certifications', desc: 'SOC 2 Type 1 (document: security controls, access controls, change management, incident response, monitoring), GDPR compliance (data inventory, privacy policy, consent management, data deletion, privacy by design), Audit preparation (create: policy documents, procedures, evidence collection, control testing, remediation plans)', phase: 10, month: 16, week: 3, priority: 'high', hours: 60, tags: ['security', 'compliance', 'audit'] },
];

// Phase 11: Beta Testing & Launch (Months 17-18)
const phase11Tasks = [
  { id: 'task-11-1', title: 'Beta Customer Onboarding - Recruit and onboard beta users', desc: 'Recruit beta customers (identify target users, create beta program application, select participants, set expectations), Onboard beta users (create onboarding materials, provide training, set up accounts, establish communication channels), Collect feedback (create feedback forms, schedule regular check-ins, track issues and feature requests, prioritize improvements)', phase: 11, month: 17, week: 1, priority: 'high', hours: 40, tags: ['beta', 'onboarding', 'feedback'] },
  { id: 'task-11-2', title: 'Feedback Collection & Iteration - Improve based on feedback', desc: 'Analyze feedback (categorize feedback, identify common issues, prioritize improvements, create improvement plan), Implement improvements (fix critical bugs, add requested features, improve UX based on feedback, optimize performance), Test improvements (verify fixes work, test new features, get beta user validation, iterate as needed)', phase: 11, month: 17, week: 2, priority: 'high', hours: 60, tags: ['beta', 'feedback', 'iteration'] },
  { id: 'task-11-3', title: 'Commercial Launch Preparation - Prepare for public launch', desc: 'Marketing materials (create website, write documentation, create demo videos, prepare case studies, create pricing plans), Legal preparation (terms of service, privacy policy, SLA agreements, data processing agreements), Support setup (create support system, train support team, create knowledge base, set up ticketing system), Launch plan (create launch timeline, prepare announcements, plan marketing campaign, prepare support team)', phase: 11, month: 17, week: 3, priority: 'high', hours: 80, tags: ['launch', 'marketing', 'preparation'] },
  { id: 'task-11-4', title: 'Public Launch - Launch to the public', desc: 'Launch day (announce launch, monitor systems, handle initial users, respond to support requests, track metrics), Post-launch (monitor performance, collect user feedback, fix critical issues, plan next features, scale infrastructure as needed)', phase: 11, month: 18, week: 1, priority: 'critical', hours: 40, tags: ['launch', 'public', 'deployment'] },
  { id: 'task-11-5', title: 'Feature Expansion - Continue development', desc: 'Plan new features (gather requirements, prioritize features, create roadmaps, design new capabilities), Implement features (develop new features, test thoroughly, deploy incrementally, gather feedback), Maintain and improve (fix bugs, optimize performance, improve UX, add integrations, scale infrastructure)', phase: 11, month: 18, week: 2, priority: 'medium', hours: 80, tags: ['launch', 'features', 'expansion'] },
];

// Expand Phase 11 with detailed tasks
allTasks.push({
  id: 'task-11-1-1',
  title: 'Day 1-2: Recruit Beta Customers',
  description: 'Identify target users, Create beta program application, Select participants, Set expectations',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-11',
  monthId: 'month-17',
  weekId: 'week-17-1',
  estimatedHours: 12,
  tags: ['beta', 'recruitment'],
  dependencies: ['task-11-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-11-1-2',
  title: 'Day 3-4: Onboard Beta Users',
  description: 'Create onboarding materials, Provide training, Set up accounts, Establish communication channels',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-11',
  monthId: 'month-17',
  weekId: 'week-17-1',
  estimatedHours: 12,
  tags: ['beta', 'onboarding'],
  dependencies: ['task-11-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-11-1-3',
  title: 'Day 5-7: Collect Feedback',
  description: 'Create feedback forms, Schedule regular check-ins, Track issues and feature requests, Prioritize improvements',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-11',
  monthId: 'month-17',
  weekId: 'week-17-1',
  estimatedHours: 12,
  tags: ['beta', 'feedback'],
  dependencies: ['task-11-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-11-2-1',
  title: 'Day 1-2: Analyze Feedback',
  description: 'Categorize feedback, Identify common issues, Prioritize improvements, Create improvement plan',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-11',
  monthId: 'month-17',
  weekId: 'week-17-2',
  estimatedHours: 16,
  tags: ['beta', 'feedback', 'analysis'],
  dependencies: ['task-11-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-11-2-2',
  title: 'Day 3-5: Implement Improvements',
  description: 'Fix critical bugs, Add requested features, Improve UX based on feedback, Optimize performance',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-11',
  monthId: 'month-17',
  weekId: 'week-17-2',
  estimatedHours: 24,
  tags: ['beta', 'improvements', 'development'],
  dependencies: ['task-11-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-11-2-3',
  title: 'Day 6-7: Test Improvements',
  description: 'Verify fixes work, Test new features, Get beta user validation, Iterate as needed',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-11',
  monthId: 'month-17',
  weekId: 'week-17-2',
  estimatedHours: 12,
  tags: ['beta', 'testing', 'validation'],
  dependencies: ['task-11-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-11-3-1',
  title: 'Day 1-3: Marketing Materials',
  description: 'Create website, Write documentation, Create demo videos, Prepare case studies, Create pricing plans',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-11',
  monthId: 'month-17',
  weekId: 'week-17-3',
  estimatedHours: 24,
  tags: ['launch', 'marketing'],
  dependencies: ['task-11-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-11-3-2',
  title: 'Day 4-5: Legal Preparation',
  description: 'Create terms of service, Create privacy policy, Create SLA agreements, Create data processing agreements',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-11',
  monthId: 'month-17',
  weekId: 'week-17-3',
  estimatedHours: 16,
  tags: ['launch', 'legal'],
  dependencies: ['task-11-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-11-3-3',
  title: 'Day 6-7: Support Setup',
  description: 'Create support system, Train support team, Create knowledge base, Set up ticketing system',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-11',
  monthId: 'month-17',
  weekId: 'week-17-3',
  estimatedHours: 16,
  tags: ['launch', 'support'],
  dependencies: ['task-11-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-11-3-4',
  title: 'Launch Plan',
  description: 'Create launch timeline, Prepare announcements, Plan marketing campaign, Prepare support team',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-11',
  monthId: 'month-17',
  weekId: 'week-17-3',
  estimatedHours: 8,
  tags: ['launch', 'planning'],
  dependencies: ['task-11-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-11-4-1',
  title: 'Launch Day',
  description: 'Announce launch, Monitor systems, Handle initial users, Respond to support requests, Track metrics',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-11',
  monthId: 'month-18',
  weekId: 'week-18-1',
  estimatedHours: 16,
  tags: ['launch', 'public', 'deployment'],
  dependencies: ['task-11-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-11-4-2',
  title: 'Post-Launch',
  description: 'Monitor performance, Collect user feedback, Fix critical issues, Plan next features, Scale infrastructure as needed',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-11',
  monthId: 'month-18',
  weekId: 'week-18-1',
  estimatedHours: 16,
  tags: ['launch', 'post-launch'],
  dependencies: ['task-11-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-11-5-1',
  title: 'Plan New Features',
  description: 'Gather requirements, Prioritize features, Create roadmaps, Design new capabilities',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-11',
  monthId: 'month-18',
  weekId: 'week-18-2',
  estimatedHours: 24,
  tags: ['launch', 'features', 'planning'],
  dependencies: ['task-11-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-11-5-2',
  title: 'Implement Features',
  description: 'Develop new features, Test thoroughly, Deploy incrementally, Gather feedback',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-11',
  monthId: 'month-18',
  weekId: 'week-18-2',
  estimatedHours: 32,
  tags: ['launch', 'features', 'development'],
  dependencies: ['task-11-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-11-5-3',
  title: 'Maintain and Improve',
  description: 'Fix bugs, Optimize performance, Improve UX, Add integrations, Scale infrastructure',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-11',
  monthId: 'month-18',
  weekId: 'week-18-2',
  estimatedHours: 24,
  tags: ['launch', 'maintenance', 'improvement'],
  dependencies: ['task-11-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Add all phase tasks and expand with detail
[phase3Tasks, phase4Tasks, phase5Tasks, phase6Tasks, phase7Tasks, phase8Tasks, phase9Tasks, phase10Tasks, phase11Tasks].forEach(phaseTasks => {
  phaseTasks.forEach(t => {
    // Check if task already exists
    const exists = allTasks.some(existing => existing.id === t.id);
    if (exists) return;
    
    allTasks.push({
      id: t.id,
      title: t.title,
      description: t.desc,
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
  });
});

// Expand Phase 3 (AI & ML) with detailed learning and practice tasks
// ML Basics - Week 1
allTasks.push({
  id: 'task-3-1-2',
  title: 'Learning: Andrew Ng\'s Machine Learning course',
  description: 'Complete Andrew Ng\'s Machine Learning (Coursera) Week 1-3, Study linear regression, Study logistic regression, Study cost functions, Study gradient descent',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-3',
  monthId: 'month-5',
  weekId: 'week-5-1',
  estimatedHours: 20,
  tags: ['ml', 'learning', 'coursera'],
  dependencies: ['task-3-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-1-3',
  title: 'Practice: Math concepts for ML',
  description: 'Review linear algebra, Review calculus, Review statistics, Practice gradient descent math, Practice cost function math',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-5',
  weekId: 'week-5-1',
  estimatedHours: 8,
  tags: ['ml', 'math', 'practice'],
  dependencies: ['task-3-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// ML Basics - Week 2
allTasks.push({
  id: 'task-3-2-2',
  title: 'Learning: Scikit-learn documentation',
  description: 'Read scikit-learn documentation, Study all algorithms, Study evaluation metrics, Study preprocessing',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-5',
  weekId: 'week-5-2',
  estimatedHours: 12,
  tags: ['ml', 'scikit-learn', 'learning'],
  dependencies: ['task-3-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-2-3',
  title: 'Learning: "Hands-On Machine Learning" book',
  description: 'Read "Hands-On Machine Learning" by Aurélien Géron, Study ML concepts, Complete exercises',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-5',
  weekId: 'week-5-2',
  estimatedHours: 16,
  tags: ['ml', 'learning', 'book'],
  dependencies: ['task-3-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-2-4',
  title: 'Practice: Kaggle Learn courses',
  description: 'Complete Kaggle Learn courses, Practice ML concepts, Build practice models',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-3',
  monthId: 'month-5',
  weekId: 'week-5-2',
  estimatedHours: 12,
  tags: ['ml', 'practice', 'kaggle'],
  dependencies: ['task-3-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-2-5',
  title: 'Checkpoint: Machine Learning Basics',
  description: 'Verify: Built 4 working ML models for security? Understand ML concepts? Can evaluate models?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-5',
  weekId: 'week-5-3',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'ml'],
  dependencies: ['task-3-3-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Deep Learning - Expand
allTasks.push({
  id: 'task-3-4-1',
  title: 'Learning: Deep Learning Specialization',
  description: 'Complete Deep Learning Specialization (Coursera), Study neural networks, Study CNNs, Study RNNs',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-3',
  monthId: 'month-5',
  weekId: 'week-5-4',
  estimatedHours: 20,
  tags: ['deep-learning', 'learning', 'coursera'],
  dependencies: ['task-3-4'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-5-2',
  title: 'Learning: PyTorch official tutorials',
  description: 'Complete PyTorch official tutorials, Study tensors, Study autograd, Study neural networks',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-1',
  estimatedHours: 12,
  tags: ['deep-learning', 'pytorch', 'learning'],
  dependencies: ['task-3-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-5-3',
  title: 'Learning: Fast.ai Practical Deep Learning',
  description: 'Complete Fast.ai Practical Deep Learning course, Study practical approaches, Build models',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-1',
  estimatedHours: 16,
  tags: ['deep-learning', 'fastai', 'learning'],
  dependencies: ['task-3-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-5-4',
  title: 'Learning: "Deep Learning with Python" book',
  description: 'Read "Deep Learning with Python" by François Chollet, Study Keras, Study deep learning',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-1',
  estimatedHours: 12,
  tags: ['deep-learning', 'learning', 'book'],
  dependencies: ['task-3-5'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-6-4',
  title: 'Checkpoint: Deep Learning Fundamentals',
  description: 'Verify: Built and trained 4 deep learning models? Understand neural networks? Can use PyTorch?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-3',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'deep-learning'],
  dependencies: ['task-3-6-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// LLMs - Expand
allTasks.push({
  id: 'task-3-7-2',
  title: 'Learning: "Attention Is All You Need" paper',
  description: 'Read "Attention Is All You Need" paper (simplified version), Understand transformers, Study attention mechanism',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-4',
  estimatedHours: 8,
  tags: ['llm', 'transformers', 'learning', 'paper'],
  dependencies: ['task-3-7'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-7-3',
  title: 'Learning: Prompt engineering techniques',
  description: 'Study zero-shot prompting, Study few-shot prompting, Study chain-of-thought prompting, Study role-based prompting',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-4',
  estimatedHours: 8,
  tags: ['llm', 'prompt-engineering', 'learning'],
  dependencies: ['task-3-7'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-8-4',
  title: 'Learning: OpenAI Cookbook',
  description: 'Study OpenAI Cookbook (GitHub), Learn API usage, Study examples, Practice with API',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-4',
  estimatedHours: 8,
  tags: ['llm', 'openai', 'learning'],
  dependencies: ['task-3-8'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-8-5',
  title: 'Learning: Anthropic Prompt Engineering Guide',
  description: 'Read Anthropic Prompt Engineering Guide, Study prompt techniques, Practice prompting',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-4',
  estimatedHours: 6,
  tags: ['llm', 'anthropic', 'learning'],
  dependencies: ['task-3-8'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-8-6',
  title: 'Learning: Hugging Face course',
  description: 'Complete Hugging Face course, Study transformers library, Practice with models',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-4',
  estimatedHours: 12,
  tags: ['llm', 'huggingface', 'learning'],
  dependencies: ['task-3-8'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-8-7',
  title: 'Checkpoint: Large Language Models',
  description: 'Verify: Built 4 LLM-powered applications? Understand prompt engineering? Can use LLM APIs?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-4',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'llm'],
  dependencies: ['task-3-8-3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// LangChain - Expand
allTasks.push({
  id: 'task-3-9-1',
  title: 'Learning: LangChain documentation',
  description: 'Read LangChain documentation, Study components, Study chains, Study agents',
  status: 'pending',
  priority: 'critical',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-4',
  estimatedHours: 12,
  tags: ['langchain', 'learning', 'documentation'],
  dependencies: ['task-3-9'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-9-2',
  title: 'Learning: LangChain YouTube channel',
  description: 'Watch LangChain YouTube channel videos, Study examples, Learn best practices',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-4',
  estimatedHours: 8,
  tags: ['langchain', 'learning', 'video'],
  dependencies: ['task-3-9'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-9-3',
  title: 'Learning: "LangChain AI Handbook"',
  description: 'Read "LangChain AI Handbook", Study LangChain patterns, Learn advanced techniques',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-4',
  estimatedHours: 10,
  tags: ['langchain', 'learning', 'book'],
  dependencies: ['task-3-9'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-9-4',
  title: 'Practice: LangChain cookbook examples',
  description: 'Complete LangChain cookbook examples, Practice building chains, Practice building agents',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-4',
  estimatedHours: 10,
  tags: ['langchain', 'practice', 'examples'],
  dependencies: ['task-3-9'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-10-3',
  title: 'Checkpoint: LangChain & AI Agents',
  description: 'Verify: Built 5 working AI agents? Understand LangChain? Can create custom tools?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-4',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'langchain'],
  dependencies: ['task-3-10-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Vector Databases - Expand
allTasks.push({
  id: 'task-3-12-3',
  title: 'Learning: Chroma documentation',
  description: 'Read Chroma documentation, Study vector databases, Study embeddings, Study similarity search',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-4',
  estimatedHours: 8,
  tags: ['vector-db', 'chroma', 'learning'],
  dependencies: ['task-3-12'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-12-4',
  title: 'Learning: Pinecone learning center',
  description: 'Complete Pinecone learning center tutorials, Study vector databases, Practice with Pinecone',
  status: 'pending',
  priority: 'medium',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-4',
  estimatedHours: 6,
  tags: ['vector-db', 'pinecone', 'learning'],
  dependencies: ['task-3-12'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-12-5',
  title: 'Learning: LangChain vector store guides',
  description: 'Read LangChain vector store guides, Study integration, Practice with vector stores',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-4',
  estimatedHours: 6,
  tags: ['vector-db', 'langchain', 'learning'],
  dependencies: ['task-3-12'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

allTasks.push({
  id: 'task-3-12-6',
  title: 'Checkpoint: Vector Databases',
  description: 'Verify: Built 3 RAG applications with vector DBs? Understand embeddings? Can query vector stores?',
  status: 'pending',
  priority: 'high',
  phaseId: 'phase-3',
  monthId: 'month-6',
  weekId: 'week-6-4',
  estimatedHours: 0,
  tags: ['checkpoint', 'review', 'vector-db'],
  dependencies: ['task-3-12-2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

console.log(`Total tasks: ${allTasks.length}`);

// Now generate the complete TypeScript file
const header = `import { Phase, Month, Week, Task, Milestone, ProjectData } from '@/types';

export function generateInitialData(): ProjectData {
`;

const monthsCode = `  // Generate months (0-18)
  const months: Month[] = [];
  for (let i = 0; i <= 18; i++) {
    let phaseId = '';
    if (i === 0) phaseId = 'phase-0';
    else if (i >= 1 && i <= 2) phaseId = 'phase-1';
    else if (i >= 3 && i <= 4) phaseId = 'phase-2';
    else if (i >= 5 && i <= 6) phaseId = 'phase-3';
    else if (i === 7) phaseId = 'phase-4';
    else if (i >= 8 && i <= 9) phaseId = 'phase-5';
    else if (i >= 10 && i <= 11) phaseId = 'phase-6';
    else if (i >= 12 && i <= 13) phaseId = 'phase-7';
    else if (i === 14) phaseId = 'phase-8';
    else if (i === 15) phaseId = 'phase-9';
    else if (i === 16) phaseId = 'phase-10';
    else phaseId = 'phase-11';
    
    months.push({
      id: \`month-\${i}\`,
      title: i === 0 ? 'Week 0' : \`Month \${i}\`,
      phaseId,
      monthNumber: i,
      estimatedHours: 0,
      actualHours: 0,
    });
  }
`;

const weeksCode = `  // Generate weeks
  const weeks: Week[] = [];
  months.forEach(month => {
    const weekCount = month.monthNumber === 0 ? 1 : 4;
    for (let w = 1; w <= weekCount; w++) {
      weeks.push({
        id: \`week-\${month.monthNumber}-\${w}\`,
        title: \`Week \${w}\`,
        monthId: month.id,
        weekNumber: w,
        estimatedHours: 0,
        actualHours: 0,
      });
    }
  });
`;

const tasksCode = `  // Comprehensive Task List - Complete Beginner to Expert Roadmap
  const tasks: Task[] = [
${allTasks.map(t => generateTaskCode(t)).join(',\n')}
  ];
`;

const milestonesCode = `  const milestones: Milestone[] = [
    {
      id: 'milestone-0',
      title: 'Complete Absolute Basics',
      description: 'Finished Phase 0: Computer setup, programming fundamentals, networking basics',
      targetDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      phaseId: 'phase-0',
      status: 'pending',
      tasks: allTasks.filter(t => t.phaseId === 'phase-0').map(t => t.id).slice(0, 5),
    },
    {
      id: 'milestone-1',
      title: 'Complete Security Fundamentals',
      description: 'Finished Phase 1: Security concepts, web security, network security, Linux mastery',
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      phaseId: 'phase-1',
      status: 'pending',
      tasks: allTasks.filter(t => t.phaseId === 'phase-1').map(t => t.id).slice(0, 10),
    },
    {
      id: 'milestone-2',
      title: 'Complete Programming Mastery',
      description: 'Finished Phase 2: Python advanced, Rust fundamentals, databases, APIs',
      targetDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
      phaseId: 'phase-2',
      status: 'pending',
      tasks: allTasks.filter(t => t.phaseId === 'phase-2').map(t => t.id).slice(0, 10),
    },
  ];
`;

const footer = `  const stats: ProjectStats = {
    totalTasks: tasks.length,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: tasks.length,
    totalEstimatedHours: tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0),
    totalActualHours: 0,
    completionPercentage: 0,
  };

  return {
    phases,
    months,
    weeks,
    tasks,
    milestones,
    timeEntries: [],
    stats,
    lastUpdated: new Date().toISOString(),
  };
}
`;

// Note: The tasksCode references 'allTasks' but should reference 'tasks'
// Let me fix that
const fixedTasksCode = tasksCode.replace(/allTasks/g, 'tasks');
const fixedMilestonesCode = milestonesCode.replace(/allTasks/g, 'tasks');

const completeFile = header + phasesCode + '\n\n' + monthsCode + '\n' + weeksCode + '\n' + fixedTasksCode + '\n' + fixedMilestonesCode + '\n' + footer;

fs.writeFileSync(
  path.join(__dirname, '..', 'lib', 'initialData.ts'),
  completeFile
);

console.log('Generated complete initialData.ts file!');
console.log(`Total tasks: ${allTasks.length}`);
console.log('File saved to lib/initialData.ts');
