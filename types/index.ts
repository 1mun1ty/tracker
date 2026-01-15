export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type PhaseType = 'foundation' | 'architecture' | 'development' | 'frontend' | 'hardening' | 'launch';

export interface TimeEntry {
  id: string;
  taskId: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  description?: string;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  phaseId: string;
  weekId?: string;
  monthId?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  dependencies?: string[]; // task IDs
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  dueDate?: string;
}

export interface Week {
  id: string;
  title: string;
  description?: string;
  monthId: string;
  weekNumber: number;
  startDate?: string;
  endDate?: string;
  estimatedHours?: number;
  actualHours?: number;
}

export interface Month {
  id: string;
  title: string;
  description?: string;
  phaseId: string;
  monthNumber: number;
  startDate?: string;
  endDate?: string;
  estimatedHours?: number;
  actualHours?: number;
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  type: PhaseType;
  monthStart: number;
  monthEnd: number;
  estimatedHours?: number;
  actualHours?: number;
  status: TaskStatus;
  color: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  targetDate: string;
  achievedDate?: string;
  phaseId: string;
  status: 'pending' | 'achieved' | 'delayed';
  tasks: string[]; // task IDs
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  totalEstimatedHours: number;
  totalActualHours: number;
  completionPercentage: number;
  currentPhase?: string;
  daysRemaining?: number;
}

export interface ProjectData {
  phases: Phase[];
  months: Month[];
  weeks: Week[];
  tasks: Task[];
  milestones: Milestone[];
  timeEntries: TimeEntry[];
  stats: ProjectStats;
  lastUpdated: string;
}