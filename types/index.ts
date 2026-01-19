// Professional Task Tracker Types

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done' | 'blocked' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';
export type ProjectStatus = 'active' | 'archived' | 'completed';
export type WorkspaceStatus = 'active' | 'archived';

// User & Authentication
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// Workspace
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  slug: string;
  status: WorkspaceStatus;
  ownerId: string;
  members: WorkspaceMember[];
  settings: WorkspaceSettings;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  userId: string;
  role: UserRole;
  joinedAt: string;
}

export interface WorkspaceSettings {
  allowPublicProjects: boolean;
  defaultProjectTemplate?: string;
}

// Project
export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  status: ProjectStatus;
  ownerId: string;
  members: ProjectMember[];
  settings: ProjectSettings;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface ProjectMember {
  userId: string;
  role: UserRole;
  joinedAt: string;
}

export interface ProjectSettings {
  defaultView: 'list' | 'kanban' | 'calendar';
  allowPublicAccess: boolean;
  enableTimeTracking: boolean;
}

// Task
export interface Task {
  id: string;
  projectId: string;
  workspaceId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assigneeIds: string[];
  reporterId: string;
  dueDate?: string;
  startDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  dependencies: string[]; // task IDs
  parentTaskId?: string; // for subtasks
  subtasks: string[]; // task IDs
  position: number; // for ordering
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  createdBy: string;
  updatedBy: string;
}

// Comment
export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  mentions: string[]; // user IDs
  attachments: string[]; // attachment IDs
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
}

// Attachment
export interface Attachment {
  id: string;
  taskId?: string;
  commentId?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  uploadedBy: string;
  createdAt: string;
}

// Time Entry
export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

// Activity Log
export interface Activity {
  id: string;
  workspaceId: string;
  projectId?: string;
  taskId?: string;
  userId: string;
  type: 'task_created' | 'task_updated' | 'task_deleted' | 'task_completed' | 
        'comment_added' | 'member_added' | 'member_removed' | 'project_created' | 
        'project_updated' | 'status_changed' | 'assignee_changed';
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  type: 'task_assigned' | 'task_mentioned' | 'comment_added' | 'due_date_approaching' | 
        'task_completed' | 'project_invited' | 'workspace_invited';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

// Filter & View
export interface TaskFilter {
  status?: TaskStatus[];
  priority?: Priority[];
  assignees?: string[];
  tags?: string[];
  projects?: string[];
  dueDate?: {
    from?: string;
    to?: string;
  };
  search?: string;
}

export interface TaskView {
  id: string;
  name: string;
  type: 'list' | 'kanban' | 'calendar' | 'timeline';
  filter: TaskFilter;
  sortBy: 'created' | 'updated' | 'dueDate' | 'priority' | 'title';
  sortOrder: 'asc' | 'desc';
  groupBy?: 'status' | 'assignee' | 'priority' | 'project';
  userId: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Statistics
export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  blockedTasks: number;
  totalEstimatedHours: number;
  totalActualHours: number;
  completionPercentage: number;
  overdueTasks: number;
  tasksByStatus: Record<TaskStatus, number>;
  tasksByPriority: Record<Priority, number>;
}

export interface WorkspaceStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  totalMembers: number;
  completionRate: number;
}

// Main Data Structure
export interface AppData {
  currentUser?: User;
  workspaces: Workspace[];
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  attachments: Attachment[];
  timeEntries: TimeEntry[];
  activities: Activity[];
  notifications: Notification[];
  views: TaskView[];
  stats: {
    workspace?: WorkspaceStats;
    project?: Record<string, ProjectStats>;
  };
  lastUpdated: string;
}

// API Request/Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Session
export interface Session {
  userId: string;
  email: string;
  name: string;
  workspaceId?: string;
  expiresAt: string;
}
