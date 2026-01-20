'use client';

import { useState, useMemo } from 'react';
import { Task, Project, TaskStatus, Priority } from '@/types';
import { Plus, Search, ChevronDown, ChevronRight, Clock, CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import TaskModal from './TaskModal';

interface TaskListProps {
  tasks: Task[];
  project: Project;
  onTaskUpdate: () => void;
}

interface GroupedTasks {
  [key: string]: Task[];
}

const statusIcons: Record<string, React.ReactNode> = {
  todo: <Circle className="w-4 h-4 text-slate-400" />,
  in_progress: <PlayCircle className="w-4 h-4 text-blue-400" />,
  in_review: <Clock className="w-4 h-4 text-yellow-400" />,
  done: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  blocked: <Circle className="w-4 h-4 text-red-400" />,
};

const priorityColors: Record<string, string> = {
  low: 'bg-slate-500/20 text-slate-400',
  medium: 'bg-blue-500/20 text-blue-400',
  high: 'bg-orange-500/20 text-orange-400',
  urgent: 'bg-red-500/20 text-red-400',
};

export default function TaskList({ tasks, project, onTaskUpdate }: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Phase 1: Foundations']));

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, filterStatus]);

  // Group tasks by phase
  const groupedTasks = useMemo(() => {
    const groups: GroupedTasks = {};
    
    filteredTasks.forEach(task => {
      const phaseTag = task.tags?.find(tag => tag.startsWith('Phase')) || 'Other';
      if (!groups[phaseTag]) {
        groups[phaseTag] = [];
      }
      groups[phaseTag].push(task);
    });

    // Sort groups by phase number
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const numA = parseInt(a.match(/Phase (\d+)/)?.[1] || '99');
      const numB = parseInt(b.match(/Phase (\d+)/)?.[1] || '99');
      return numA - numB;
    });

    const sortedGroups: GroupedTasks = {};
    sortedKeys.forEach(key => {
      sortedGroups[key] = groups[key];
    });

    return sortedGroups;
  }, [filteredTasks]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    return { total, done, inProgress, todo };
  }, [tasks]);

  const toggleGroup = (group: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(group)) {
      newExpanded.delete(group);
    } else {
      newExpanded.add(group);
    }
    setExpandedGroups(newExpanded);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const getGroupStats = (groupTasks: Task[]) => {
    const done = groupTasks.filter(t => t.status === 'done').length;
    const total = groupTasks.length;
    return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header with Stats */}
      <div className="p-6 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Learning Tasks</h2>
            <p className="text-sm text-slate-400 mt-1">
              {stats.done} of {stats.total} completed • {stats.inProgress} in progress
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedTask(null);
              setShowTaskModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${stats.total > 0 ? (stats.done / stats.total) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
            className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do ({stats.todo})</option>
            <option value="in_progress">In Progress ({stats.inProgress})</option>
            <option value="done">Done ({stats.done})</option>
          </select>

          <button
            onClick={() => setExpandedGroups(new Set(Object.keys(groupedTasks)))}
            className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={() => setExpandedGroups(new Set())}
            className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Grouped Task List */}
      <div className="flex-1 overflow-auto p-4">
        {Object.entries(groupedTasks).map(([group, groupTasks]) => {
          const isExpanded = expandedGroups.has(group);
          const groupStats = getGroupStats(groupTasks);
          
          return (
            <div key={group} className="mb-3">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group)}
                className="w-full flex items-center gap-3 p-4 bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-all group"
              >
                <div className="text-slate-400 group-hover:text-white transition-colors">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <span className="font-semibold text-white">{group}</span>
                  <span className="ml-3 text-sm text-slate-400">
                    {groupStats.done}/{groupStats.total} tasks
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        groupStats.percent === 100 ? 'bg-emerald-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${groupStats.percent}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${
                    groupStats.percent === 100 ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    {groupStats.percent}%
                  </span>
                </div>
              </button>

              {/* Group Tasks */}
              {isExpanded && (
                <div className="mt-2 space-y-1 pl-4">
                  {groupTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className="w-full flex items-center gap-3 p-3 bg-slate-800/40 hover:bg-slate-800/80 rounded-lg transition-all text-left group"
                    >
                      {statusIcons[task.status] || statusIcons.todo}
                      <span className={`flex-1 text-sm ${
                        task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-200'
                      }`}>
                        {task.title}
                      </span>
                      {task.priority && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                      )}
                      {task.estimatedHours && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.estimatedHours}h
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {Object.keys(groupedTasks).length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-400">No tasks found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {showTaskModal && (
        <TaskModal
          task={selectedTask || undefined}
          project={project}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          onSave={onTaskUpdate}
        />
      )}
    </div>
  );
}
