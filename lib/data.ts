import { ProjectData, Phase, Month, Week, Task, Milestone } from '@/types';

// Server-side file operations will be handled dynamically
// This avoids TypeScript errors in browser context

function getInitialData(): ProjectData {
  return {
    phases: [],
    months: [],
    weeks: [],
    tasks: [],
    milestones: [],
    timeEntries: [],
    stats: {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      pendingTasks: 0,
      totalEstimatedHours: 0,
      totalActualHours: 0,
      completionPercentage: 0,
    },
    lastUpdated: new Date().toISOString(),
  };
}

export function loadData(): ProjectData {
  if (typeof window !== 'undefined') {
    // Client-side: use localStorage
    const stored = localStorage.getItem('projectData');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return getInitialData();
      }
    }
    return getInitialData();
  }

  // Server-side: use file system (only in Node.js)
  if (typeof window === 'undefined') {
    try {
      // Dynamic import to avoid TypeScript errors
      const fs = eval('require')('fs');
      const path = eval('require')('path');
      const cwd = (globalThis as any).process?.cwd?.() || '';
      const DATA_FILE = path.join(cwd, 'data', 'project.json');
      
      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(content);
      }
    } catch (error) {
      // Not in Node.js or file doesn't exist
    }
  }
  return getInitialData();
}

export function saveData(data: ProjectData): void {
  data.lastUpdated = new Date().toISOString();
  
  if (typeof window !== 'undefined') {
    // Client-side: use localStorage
    localStorage.setItem('projectData', JSON.stringify(data));
    return;
  }

  // Server-side: use file system (only in Node.js)
  if (typeof window === 'undefined') {
    try {
      // Dynamic import to avoid TypeScript errors
      const fs = eval('require')('fs');
      const path = eval('require')('path');
      const cwd = (globalThis as any).process?.cwd?.() || '';
      const DATA_DIR = path.join(cwd, 'data');
      const DATA_FILE = path.join(DATA_DIR, 'project.json');
      
      // Ensure directory exists
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      // Not in Node.js environment or write failed
      console.error('Error saving data:', error);
    }
  }
}

// Client-side data management functions
export class DataManager {
  private static instance: DataManager;
  private data: ProjectData;

  private constructor() {
    this.data = loadData();
  }

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  getData(): ProjectData {
    return this.data;
  }

  updateData(updater: (data: ProjectData) => ProjectData): void {
    this.data = updater(this.data);
    this.updateStats();
    saveData(this.data);
  }

  private updateStats(): void {
    const tasks = this.data.tasks;
    // Calculate actual hours from timeEntries (more accurate)
    const totalActualMinutes = this.data.timeEntries.reduce((sum, te) => sum + (te.duration || 0), 0);
    const totalActualHours = totalActualMinutes / 60;
    
    this.data.stats = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
      pendingTasks: tasks.filter(t => t.status === 'pending').length,
      totalEstimatedHours: tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0),
      totalActualHours: totalActualHours,
      completionPercentage: tasks.length > 0 
        ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)
        : 0,
    };
  }

  // Task methods
  addTask(task: Task): void {
    this.updateData(data => ({
      ...data,
      tasks: [...data.tasks, task],
    }));
  }

  updateTask(taskId: string, updates: Partial<Task>): void {
    this.updateData(data => ({
      ...data,
      tasks: data.tasks.map(t => 
        t.id === taskId 
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      ),
    }));
  }

  deleteTask(taskId: string): void {
    this.updateData(data => ({
      ...data,
      tasks: data.tasks.filter(t => t.id !== taskId),
      timeEntries: data.timeEntries.filter(te => te.taskId !== taskId),
    }));
  }

  // Time entry methods
  addTimeEntry(entry: Omit<import('@/types').TimeEntry, 'id'>): void {
    const newEntry: import('@/types').TimeEntry = {
      ...entry,
      id: `te-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    this.updateData(data => ({
      ...data,
      timeEntries: [...data.timeEntries, newEntry],
    }));

    // Update task actual hours
    if (entry.duration) {
      const task = this.data.tasks.find(t => t.id === entry.taskId);
      if (task) {
        this.updateTask(entry.taskId, {
          actualHours: (task.actualHours || 0) + (entry.duration / 60),
        });
      }
    }
  }

  // Phase methods
  addPhase(phase: Phase): void {
    this.updateData(data => ({
      ...data,
      phases: [...data.phases, phase],
    }));
  }

  // Month methods
  addMonth(month: Month): void {
    this.updateData(data => ({
      ...data,
      months: [...data.months, month],
    }));
  }

  // Week methods
  addWeek(week: Week): void {
    this.updateData(data => ({
      ...data,
      weeks: [...data.weeks, week],
    }));
  }

  // Milestone methods
  addMilestone(milestone: Milestone): void {
    this.updateData(data => ({
      ...data,
      milestones: [...data.milestones, milestone],
    }));
  }

  updateMilestone(milestoneId: string, updates: Partial<Milestone>): void {
    this.updateData(data => ({
      ...data,
      milestones: data.milestones.map(m => 
        m.id === milestoneId 
          ? { ...m, ...updates }
          : m
      ),
    }));
  }

  deleteMilestone(milestoneId: string): void {
    this.updateData(data => ({
      ...data,
      milestones: data.milestones.filter(m => m.id !== milestoneId),
    }));
  }
}