import { AppData, Workspace, Project, Task, User, Comment, Attachment, TimeEntry, Activity, Notification, TaskView } from '@/types';

function getInitialData(): AppData {
  return {
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
}

export function loadData(): AppData {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('taskTrackerData');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return getInitialData();
      }
    }
    return getInitialData();
  }

  // Server-side: use file system
  if (typeof window === 'undefined') {
    try {
      const fs = eval('require')('fs');
      const path = eval('require')('path');
      const cwd = (globalThis as any).process?.cwd?.() || '';
      const DATA_FILE = path.join(cwd, 'data', 'app.json');
      
      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }
  return getInitialData();
}

export function saveData(data: AppData): void {
  data.lastUpdated = new Date().toISOString();
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('taskTrackerData', JSON.stringify(data));
    return;
  }

  // Server-side: use file system
  if (typeof window === 'undefined') {
    try {
      const fs = eval('require')('fs');
      const path = eval('require')('path');
      const cwd = (globalThis as any).process?.cwd?.() || '';
      const DATA_DIR = path.join(cwd, 'data');
      const DATA_FILE = path.join(DATA_DIR, 'app.json');
      
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }
}

// Client-side data management
export class DataManager {
  private static instance: DataManager;
  private data: AppData;

  private constructor() {
    this.data = loadData();
  }

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  getData(): AppData {
    return this.data;
  }

  updateData(updater: (data: AppData) => AppData): void {
    this.data = updater(this.data);
    saveData(this.data);
  }

  // User methods
  setCurrentUser(user: User): void {
    this.updateData(data => ({
      ...data,
      currentUser: user,
    }));
  }

  getCurrentUser(): User | undefined {
    return this.data.currentUser;
  }

  // Workspace methods
  addWorkspace(workspace: Workspace): void {
    this.updateData(data => ({
      ...data,
      workspaces: [...data.workspaces, workspace],
    }));
  }

  updateWorkspace(workspaceId: string, updates: Partial<Workspace>): void {
    this.updateData(data => ({
      ...data,
      workspaces: data.workspaces.map(w => 
        w.id === workspaceId 
          ? { ...w, ...updates, updatedAt: new Date().toISOString() }
          : w
      ),
    }));
  }

  deleteWorkspace(workspaceId: string): void {
    this.updateData(data => ({
      ...data,
      workspaces: data.workspaces.filter(w => w.id !== workspaceId),
      projects: data.projects.filter(p => p.workspaceId !== workspaceId),
      tasks: data.tasks.filter(t => t.workspaceId !== workspaceId),
    }));
  }

  // Project methods
  addProject(project: Project): void {
    this.updateData(data => ({
      ...data,
      projects: [...data.projects, project],
    }));
  }

  updateProject(projectId: string, updates: Partial<Project>): void {
    this.updateData(data => ({
      ...data,
      projects: data.projects.map(p => 
        p.id === projectId 
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      ),
    }));
  }

  deleteProject(projectId: string): void {
    this.updateData(data => ({
      ...data,
      projects: data.projects.filter(p => p.id !== projectId),
      tasks: data.tasks.filter(t => t.projectId !== projectId),
    }));
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
      comments: data.comments.filter(c => c.taskId !== taskId),
      attachments: data.attachments.filter(a => a.taskId === taskId),
      timeEntries: data.timeEntries.filter(te => te.taskId !== taskId),
    }));
  }

  // Comment methods
  addComment(comment: Comment): void {
    this.updateData(data => ({
      ...data,
      comments: [...data.comments, comment],
    }));
  }

  updateComment(commentId: string, updates: Partial<Comment>): void {
    this.updateData(data => ({
      ...data,
      comments: data.comments.map(c => 
        c.id === commentId 
          ? { ...c, ...updates, updatedAt: new Date().toISOString(), editedAt: new Date().toISOString() }
          : c
      ),
    }));
  }

  deleteComment(commentId: string): void {
    this.updateData(data => ({
      ...data,
      comments: data.comments.filter(c => c.id !== commentId),
    }));
  }

  // Time entry methods
  addTimeEntry(entry: Omit<TimeEntry, 'id'>): void {
    const newEntry: TimeEntry = {
      ...entry,
      id: `te-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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

  // Activity methods
  addActivity(activity: Omit<Activity, 'id'>): void {
    const newActivity: Activity = {
      ...activity,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    this.updateData(data => ({
      ...data,
      activities: [newActivity, ...data.activities].slice(0, 1000), // Keep last 1000
    }));
  }

  // Notification methods
  addNotification(notification: Omit<Notification, 'id'>): void {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    this.updateData(data => ({
      ...data,
      notifications: [newNotification, ...data.notifications],
    }));
  }

  markNotificationRead(notificationId: string): void {
    this.updateData(data => ({
      ...data,
      notifications: data.notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }));
  }

  // View methods
  addView(view: TaskView): void {
    this.updateData(data => ({
      ...data,
      views: [...data.views, view],
    }));
  }

  updateView(viewId: string, updates: Partial<TaskView>): void {
    this.updateData(data => ({
      ...data,
      views: data.views.map(v => 
        v.id === viewId 
          ? { ...v, ...updates, updatedAt: new Date().toISOString() }
          : v
      ),
    }));
  }

  deleteView(viewId: string): void {
    this.updateData(data => ({
      ...data,
      views: data.views.filter(v => v.id !== viewId),
    }));
  }
}
