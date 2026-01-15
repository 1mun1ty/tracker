'use client';

import { useState, useEffect } from 'react';
import { ProjectData, Task, TaskStatus, Priority } from '@/types';
import { DataManager } from '@/lib/data';
import { useTimer } from '@/lib/timerContext';
import { useToast } from '@/lib/toast';
import { formatDate, getStatusColor, getPriorityColor, cn, formatDuration, formatTimerTime } from '@/lib/utils';
import { CheckCircle2, Circle, Clock, AlertCircle, X, Filter, Search, List, Trophy, Play, Square, ChevronDown, ChevronUp, Plus, Edit2, Trash2 } from 'lucide-react';

interface TaskListProps {
  data: ProjectData;
  onUpdate: () => void;
}

export default function TaskList({ data, onUpdate }: TaskListProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'blocked'>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [filterPhase, setFilterPhase] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(data.phases.map(p => p.id)));
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    phaseId: data.phases[0]?.id || '',
    priority: 'medium' as Priority,
    estimatedHours: 0,
    status: 'pending' as TaskStatus,
  });
  const [savingTimers, setSavingTimers] = useState<Set<string>>(new Set());

  const manager = DataManager.getInstance();
  const { timer, startTimer: startGlobalTimer, stopTimer: stopGlobalTimer, isActive } = useTimer();
  const { showConfirm, showToast } = useToast();

  // Start task workflow: Change status to in_progress and start timer
  const startTask = (taskId: string) => {
    // Update task status to in_progress
    manager.updateTask(taskId, { 
      status: 'in_progress',
      updatedAt: new Date().toISOString()
    });
    
    // Start global timer
    startGlobalTimer(taskId);
    
    onUpdate();
  };

  // Stop timer and save time entry
  const stopTimer = (taskId: string) => {
    if (!timer.taskId || timer.taskId !== taskId || !timer.startTime) return;
    
    // Prevent duplicate saves
    const timerKey = `${timer.taskId}-${timer.startTime.toISOString()}`;
    if (savingTimers.has(timerKey)) return;
    
    setSavingTimers(prev => new Set(prev).add(timerKey));

    const endTime = new Date();
    const startTime = timer.startTime;
    const taskIdToSave = timer.taskId;
    
    // Calculate duration in seconds first, then convert to minutes (as decimal for precision)
    const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const durationMinutes = durationSeconds / 60; // Store as decimal to preserve seconds
    const today = new Date().toISOString().split('T')[0];

    // Check for duplicate entry (same task, same start time)
    const existingEntry = data.timeEntries.find(te => 
      te.taskId === taskIdToSave && 
      te.startTime === startTime.toISOString()
    );

    if (!existingEntry) {
      manager.addTimeEntry({
        taskId: taskIdToSave,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: durationMinutes, // Store as decimal minutes (e.g., 0.45 for 27 seconds)
        date: today,
      });
    }

    stopGlobalTimer();
    setTimeout(() => {
      setSavingTimers(prev => {
        const next = new Set(prev);
        next.delete(timerKey);
        return next;
      });
    }, 1000);
    onUpdate();
  };

  // Complete task: Stop timer, save time, mark as completed
  const completeTask = (taskId: string) => {
    // Stop timer if running
    if (timer.taskId === taskId) {
      stopTimer(taskId);
    }

    // Mark as completed
    manager.updateTask(taskId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    onUpdate();
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    if (newStatus === 'completed') {
      completeTask(taskId);
    } else {
      manager.updateTask(taskId, { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      onUpdate();
    }
  };

  // Handle tab changes
  const handleTabChange = (tab: 'all' | 'pending' | 'in_progress' | 'completed' | 'blocked') => {
    setActiveTab(tab);
  };

  const filteredTasks = data.tasks.filter(task => {
    // Tab-based filtering
    if (activeTab === 'pending' && task.status !== 'pending') return false;
    if (activeTab === 'in_progress' && task.status !== 'in_progress') return false;
    if (activeTab === 'completed' && task.status !== 'completed') return false;
    if (activeTab === 'blocked' && task.status !== 'blocked') return false;
    
    // Priority filter
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    
    // Phase filter - this is the key fix
    if (filterPhase !== 'all' && task.phaseId !== filterPhase) return false;
    
    // Search filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Group tasks by phase
  const tasksByPhase = data.phases.reduce((acc, phase) => {
    const phaseTasks = filteredTasks.filter(t => t.phaseId === phase.id);
    // Show phase if it has tasks OR if "All Phases" is selected (to show empty phases for planning)
    // When a specific phase is selected, only show that phase
    if (filterPhase === 'all') {
      // Show all phases (even empty ones) when "All Phases" is selected
      if (phaseTasks.length > 0 || activeTab === 'all') {
        acc[phase.id] = {
          phase,
          tasks: phaseTasks
        };
      }
    } else {
      // When specific phase is selected, only show that phase if it matches
      if (phase.id === filterPhase) {
        acc[phase.id] = {
          phase,
          tasks: phaseTasks
        };
      }
    }
    return acc;
  }, {} as Record<string, { phase: typeof data.phases[0]; tasks: Task[] }>);

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'blocked':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const selectedPhase = data.phases.find(p => p.id === filterPhase);
  const completedTasks = data.tasks.filter(t => t.status === 'completed');
  const pendingTasks = data.tasks.filter(t => t.status === 'pending');
  const inProgressTasks = data.tasks.filter(t => t.status === 'in_progress');
  const blockedTasks = data.tasks.filter(t => t.status === 'blocked');

  const togglePhase = (phaseId: string) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phaseId)) {
      newExpanded.delete(phaseId);
    } else {
      newExpanded.add(phaseId);
    }
    setExpandedPhases(newExpanded);
  };

  const createTask = () => {
    if (!newTask.title.trim() || !newTask.phaseId) return;

    const task: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: newTask.title,
      description: newTask.description || undefined,
      status: newTask.status,
      priority: newTask.priority,
      phaseId: newTask.phaseId,
      estimatedHours: newTask.estimatedHours || undefined,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    manager.addTask(task);
    setShowAddTaskModal(false);
    setNewTask({
      title: '',
      description: '',
      phaseId: data.phases[0]?.id || '',
      priority: 'medium',
      estimatedHours: 0,
      status: 'pending',
    });
    onUpdate();
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setShowEditTaskModal(true);
  };

  const saveEditedTask = () => {
    if (!editingTask || !editingTask.title.trim() || !editingTask.phaseId) return;

    manager.updateTask(editingTask.id, {
      title: editingTask.title,
      description: editingTask.description || undefined,
      status: editingTask.status,
      priority: editingTask.priority,
      phaseId: editingTask.phaseId,
      estimatedHours: editingTask.estimatedHours || undefined,
    });

    setShowEditTaskModal(false);
    setEditingTask(null);
    setSelectedTask(null);
    onUpdate();
    showToast('Task updated successfully!', 'success');
  };

  const deleteTask = (taskId: string) => {
    const task = data.tasks.find(t => t.id === taskId);
    if (!task) return;

    const taskTimeEntries = data.timeEntries.filter(te => te.taskId === taskId);
    const hasProgress = task.status !== 'pending' || taskTimeEntries.length > 0 || (task.actualHours && task.actualHours > 0);

    const warningMessage = hasProgress
      ? `⚠️ WARNING: This task has progress (${taskTimeEntries.length} time entries, ${task.actualHours?.toFixed(1) || 0}h logged). Deleting will permanently remove the task and all associated time entries. This action cannot be undone. Continue?`
      : `Are you sure you want to delete "${task.title}"? This action cannot be undone.`;

    showConfirm(
      warningMessage,
      () => {
        // Stop timer if this task is active
        if (isActive(taskId)) {
          stopGlobalTimer();
        }
        manager.deleteTask(taskId);
        setSelectedTask(null);
        onUpdate();
        showToast('Task deleted successfully', 'success');
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Tasks</h2>
          <p className="mt-2 text-sm text-gray-400">
            Manage all project tasks and track progress
          </p>
        </div>
        <button
          onClick={() => setShowAddTaskModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 shadow-lg rounded-xl border border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => handleTabChange('all')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <List className="w-5 h-5" />
              <span>All Tasks</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'all' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}>
                {data.tasks.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange('pending')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 ${
              activeTab === 'pending'
                ? 'bg-gradient-to-r from-yellow-900/30 to-amber-900/30 text-yellow-400 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Circle className="w-5 h-5" />
              <span>Pending</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700 text-gray-300'
              }`}>
                {pendingTasks.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange('in_progress')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 ${
              activeTab === 'in_progress'
                ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 text-blue-400 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>In Progress</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'in_progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-300'
              }`}>
                {inProgressTasks.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange('completed')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 ${
              activeTab === 'completed'
                ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 text-green-400 border-b-2 border-green-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>Completed</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-300'
              }`}>
                {completedTasks.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange('blocked')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 ${
              activeTab === 'blocked'
                ? 'bg-gradient-to-r from-red-900/30 to-rose-900/30 text-red-400 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>Blocked</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'blocked' ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-300'
              }`}>
                {blockedTasks.length}
              </span>
            </div>
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-gray-700/50 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white placeholder-gray-400"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as Priority | 'all')}
              className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            {/* Phase Filter */}
            <select
              value={filterPhase}
              onChange={(e) => setFilterPhase(e.target.value)}
              className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
            >
              <option value="all">All Phases</option>
              {data.phases.map(phase => (
                <option key={phase.id} value={phase.id}>{phase.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task List - Grouped by Phase */}
      {activeTab === 'completed' ? (
        /* Completed Tasks - Professional View */
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl rounded-xl border border-green-500/30 overflow-hidden">
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Completed Tasks</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {completedTasks.length} task{completedTasks.length !== 1 ? 's' : ''} completed
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-20 w-20 mx-auto text-green-500/30 mb-4" />
                <p className="text-gray-300 font-medium text-lg">No completed tasks yet</p>
                <p className="text-sm text-gray-500 mt-2">Complete your first task to see it here!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTasks.map(task => {
                  const phase = data.phases.find(p => p.id === task.phaseId);
                  const completedDate = task.completedAt ? new Date(task.completedAt) : null;
                  return (
                    <div
                      key={task.id}
                      className="bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-200 border border-green-500/30 hover:border-green-500/50 cursor-pointer"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                            <CheckCircle2 className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white line-through mb-1">
                              {task.title}
                            </h4>
                            {phase && (
                              <span className="inline-flex items-center text-xs text-gray-400">
                                <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: phase.color }}></span>
                                {phase.title}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-green-500/20 text-green-400 border border-green-500/30">
                          DONE
                        </span>
                      </div>
                      
                      {task.description && (
                        <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          {completedDate && (
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {completedDate.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          )}
                          {task.actualHours && task.actualHours > 0 && (
                            <span className="font-semibold text-green-400">
                              ⏱️ {task.actualHours.toFixed(1)}h
                            </span>
                          )}
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 text-xs font-bold rounded",
                          getPriorityColor(task.priority)
                        )}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Tasks Grouped by Phase */
        <div className="space-y-4">
          {Object.keys(tasksByPhase).length === 0 ? (
            <div className="bg-gray-800 shadow-xl rounded-xl border border-gray-700 p-12 text-center">
              <Circle className="h-16 w-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-300 font-medium text-lg">No tasks found</p>
              <p className="text-sm text-gray-500 mt-2">
                {data.tasks.length === 0 
                  ? 'Tasks will appear here once data is loaded. Try refreshing the page.'
                  : 'Try adjusting your filters or search query'}
              </p>
              <div className="mt-4 space-y-3">
                <p className="text-sm text-gray-400 mb-2">
                  {data.tasks.length === 0 
                    ? 'No tasks found. Click below to load all roadmap tasks.'
                    : `Only ${data.tasks.length} tasks loaded. Click below to load all 254 tasks from the complete roadmap.`}
                </p>
                <button
                  onClick={async () => {
                    showConfirm(
                      'This will add missing tasks from the complete roadmap while preserving all your progress (completed tasks, time entries, etc.). Continue?',
                      async () => {
                        const manager = DataManager.getInstance();
                        const currentData = manager.getData();
                        const { generateInitialData } = await import('@/lib/initialData');
                        const initialData = generateInitialData();
                        
                        // Create a map of existing tasks by ID for quick lookup
                        const existingTasksMap = new Map(currentData.tasks.map(t => [t.id, t]));
                        
                        // Merge tasks: preserve existing task progress, add new tasks
                        const mergedTasks = initialData.tasks.map(newTask => {
                          const existingTask = existingTasksMap.get(newTask.id);
                          if (existingTask) {
                            // Preserve existing task progress
                            return {
                              ...newTask, // Get updated structure from initial data
                              status: existingTask.status, // Preserve status
                              actualHours: existingTask.actualHours || 0, // Preserve actual hours
                              completedAt: existingTask.completedAt, // Preserve completion date
                              updatedAt: existingTask.updatedAt, // Preserve last update
                              createdAt: existingTask.createdAt, // Preserve creation date
                              // Preserve any custom changes (priority, estimated hours if manually changed)
                              priority: existingTask.priority !== 'medium' ? existingTask.priority : newTask.priority,
                              estimatedHours: existingTask.estimatedHours !== newTask.estimatedHours ? existingTask.estimatedHours : newTask.estimatedHours,
                            };
                          }
                          // New task - use as is
                          return newTask;
                        });
                        
                        // Preserve all existing time entries
                        const preservedTimeEntries = currentData.timeEntries;
                        
                        // Update data with merged tasks, preserving time entries and milestones
                        manager.updateData(() => ({
                          ...initialData,
                          tasks: mergedTasks,
                          timeEntries: preservedTimeEntries, // Keep all existing time entries
                          milestones: currentData.milestones, // Preserve milestone progress
                        }));
                        
                        onUpdate();
                        showToast('Tasks updated successfully! All your progress (completed tasks, time entries) has been preserved.', 'success');
                      }
                    );
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all text-base"
                >
                  {data.tasks.length === 0 ? 'Load All Tasks (254 tasks)' : 'Reload All Tasks (254 tasks)'}
                </button>
              </div>
            </div>
          ) : (
            Object.values(tasksByPhase).map(({ phase, tasks }) => {
              const isExpanded = expandedPhases.has(phase.id);
              const completed = tasks.filter(t => t.status === 'completed').length;
              const inProgress = tasks.filter(t => t.status === 'in_progress').length;
              const pending = tasks.filter(t => t.status === 'pending').length;
              
              return (
                <div key={phase.id} className="bg-gray-800 shadow-xl rounded-xl border border-gray-700 overflow-hidden">
                  {/* Phase Header */}
                  <button
                    onClick={() => togglePhase(phase.id)}
                    className="w-full p-5 bg-gradient-to-r hover:from-gray-700 hover:to-gray-800 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                          style={{ backgroundColor: phase.color }}
                        >
                          <span className="text-white font-bold text-lg">
                            {phase.monthStart}
                          </span>
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-white">{phase.title}</h3>
                          <p className="text-sm text-gray-400">{phase.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-400">
                              <span className="font-bold text-white">{tasks.length}</span> tasks
                            </span>
                            {pending > 0 && (
                              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-semibold border border-yellow-500/30">
                                {pending} pending
                              </span>
                            )}
                            {inProgress > 0 && (
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold border border-blue-500/30">
                                {inProgress} in progress
                              </span>
                            )}
                            {completed > 0 && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold border border-green-500/30">
                                {completed} completed
                              </span>
                            )}
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Phase Tasks */}
                  {isExpanded && (
                    <div className="divide-y divide-gray-700">
                      {tasks.map(task => {
                        const isTimerActive = isActive(task.id);
                        const isInProgress = task.status === 'in_progress';
                        const taskTimeEntries = data.timeEntries.filter(te => te.taskId === task.id);
                        const totalTaskTime = taskTimeEntries.reduce((sum, te) => sum + (te.duration || 0), 0);
                        
                        return (
                          <div
                            key={task.id}
                            className={`p-5 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-800 cursor-pointer transition-all duration-200 border-l-4 ${
                              isTimerActive 
                                ? 'border-blue-500 bg-blue-500/10' 
                                : task.status === 'in_progress'
                                ? 'border-indigo-500 bg-indigo-500/10'
                                : 'border-transparent'
                            }`}
                            onClick={() => setSelectedTask(task)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4 flex-1">
                                <div className="mt-1">
                                  {getStatusIcon(task.status)}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-base font-semibold text-white">
                                      {task.title}
                                    </h3>
                                    <span className={cn(
                                      "px-2.5 py-1 text-xs font-bold rounded-md border",
                                      getPriorityColor(task.priority)
                                    )}>
                                      {task.priority.toUpperCase()}
                                    </span>
                                    {isTimerActive && (
                                      <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center space-x-1">
                                        <Clock className="w-3 h-3 animate-pulse" />
                                        <span className="font-mono">{formatTimerTime(timer.elapsedSeconds)}</span>
                                      </span>
                                    )}
                                    {totalTaskTime > 0 && (
                                      <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30 font-mono">
                                        ⏱️ {formatTimerTime(Math.floor(totalTaskTime * 60))}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {task.description && (
                                    <p className="mt-1 text-sm text-gray-400 line-clamp-2 mb-3">
                                      {task.description}
                                    </p>
                                  )}
                                  
                                  <div className="flex items-center flex-wrap gap-3 text-xs">
                                    {task.estimatedHours && (
                                      <span className="text-gray-400">Est: {task.estimatedHours}h</span>
                                    )}
                                    {task.actualHours && task.actualHours > 0 && (
                                      <span className="text-blue-400 font-medium">Actual: {task.actualHours.toFixed(1)}h</span>
                                    )}
                                    {taskTimeEntries.length > 0 && (
                                      <span className="text-purple-400 font-medium">
                                        {taskTimeEntries.length} time entry{taskTimeEntries.length !== 1 ? 's' : ''}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex items-center space-x-2 ml-4">
                                {task.status === 'pending' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startTask(task.id);
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-semibold text-sm flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
                                  >
                                    <Play className="w-4 h-4" />
                                    <span>Start</span>
                                  </button>
                                )}
                                {isInProgress && !isTimerActive && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startTask(task.id);
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-semibold text-sm flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
                                  >
                                    <Play className="w-4 h-4" />
                                    <span>Resume</span>
                                  </button>
                                )}
                                {isTimerActive && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      stopTimer(task.id);
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 font-semibold text-sm flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
                                  >
                                    <Square className="w-4 h-4" />
                                    <span>Stop</span>
                                  </button>
                                )}
                                {isInProgress && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      completeTask(task.id);
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 font-semibold text-sm flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Complete</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">{selectedTask.title}</h3>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {selectedTask.description && (
                <p className="text-gray-300 mb-4">{selectedTask.description}</p>
              )}
              
              {/* Time Tracking Info */}
              {(() => {
                const taskTimeEntries = data.timeEntries.filter(te => te.taskId === selectedTask.id);
                const totalTime = taskTimeEntries.reduce((sum, te) => {
                  // Calculate from startTime/endTime if available for accuracy
                  if (te.startTime && te.endTime) {
                    const start = new Date(te.startTime);
                    const end = new Date(te.endTime);
                    const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
                    return sum + (seconds / 60);
                  }
                  return sum + (te.duration || 0);
                }, 0);
                return taskTimeEntries.length > 0 && (
                  <div className="mb-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                    <h4 className="text-sm font-semibold text-purple-400 mb-2">Time Tracking</h4>
                    <p className="text-lg font-bold text-purple-300 font-mono">Total: {formatTimerTime(Math.floor(totalTime * 60))}</p>
                    <p className="text-xs text-purple-400 mt-1">{taskTimeEntries.length} time entry{taskTimeEntries.length !== 1 ? 's' : ''}</p>
                    <div className="mt-2 space-y-1">
                      {taskTimeEntries.slice(0, 5).map(entry => {
                        // Calculate duration from startTime/endTime if available
                        let durationSeconds = 0;
                        if (entry.startTime && entry.endTime) {
                          const start = new Date(entry.startTime);
                          const end = new Date(entry.endTime);
                          durationSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
                        } else {
                          durationSeconds = Math.floor((entry.duration || 0) * 60);
                        }
                        return (
                          <div key={entry.id} className="text-xs text-purple-400 font-mono">
                            {formatDate(entry.date)}: {formatTimerTime(durationSeconds)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Status</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => {
                      handleStatusChange(selectedTask.id, e.target.value as TaskStatus);
                      setSelectedTask({ ...selectedTask, status: e.target.value as TaskStatus });
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300">Priority</label>
                  <select
                    value={selectedTask.priority}
                    onChange={(e) => {
                      manager.updateTask(selectedTask.id, { priority: e.target.value as Priority });
                      setSelectedTask({ ...selectedTask, priority: e.target.value as Priority });
                      onUpdate();
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Estimated Hours</label>
                  <input
                    type="number"
                    value={selectedTask.estimatedHours || ''}
                    onChange={(e) => {
                      const hours = parseFloat(e.target.value) || 0;
                      manager.updateTask(selectedTask.id, { estimatedHours: hours });
                      setSelectedTask({ ...selectedTask, estimatedHours: hours });
                      onUpdate();
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300">Actual Hours</label>
                  <input
                    type="number"
                    value={selectedTask.actualHours?.toFixed(1) || ''}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-gray-400"
                  />
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex flex-col space-y-3 mt-6 pt-4 border-t border-gray-700">
                <div className="flex space-x-3">
                  {selectedTask.status === 'pending' && (
                    <button
                      onClick={() => {
                        startTask(selectedTask.id);
                        setSelectedTask({ ...selectedTask, status: 'in_progress' });
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-semibold flex items-center justify-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start Task</span>
                    </button>
                  )}
                  {selectedTask.status === 'in_progress' && !isActive(selectedTask.id) && (
                    <button
                      onClick={() => {
                        startTask(selectedTask.id);
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-semibold flex items-center justify-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Resume Timer</span>
                    </button>
                  )}
                  {isActive(selectedTask.id) && (
                    <button
                      onClick={() => {
                        stopTimer(selectedTask.id);
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 font-semibold flex items-center justify-center space-x-2"
                    >
                      <Square className="w-4 h-4" />
                      <span>Stop Timer</span>
                    </button>
                  )}
                  {selectedTask.status === 'in_progress' && (
                    <button
                      onClick={() => {
                        completeTask(selectedTask.id);
                        setSelectedTask({ ...selectedTask, status: 'completed' });
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 font-semibold flex items-center justify-center space-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Task</span>
                    </button>
                  )}
                </div>
                
                {/* Edit and Delete Buttons */}
                <div className="flex space-x-3 pt-2 border-t border-gray-700">
                  <button
                    onClick={() => {
                      openEditTask(selectedTask);
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 font-semibold flex items-center justify-center space-x-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Task</span>
                  </button>
                  <button
                    onClick={() => {
                      deleteTask(selectedTask.id);
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 font-semibold flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Task</span>
                  </button>
                </div>
              </div>
              
              {selectedTask.tags && selectedTask.tags.length > 0 && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-300">Tags</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedTask.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditTaskModal && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Edit Task</h3>
                <button
                  onClick={() => {
                    setShowEditTaskModal(false);
                    setEditingTask(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Task Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    placeholder="Enter task title"
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingTask.description || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    placeholder="Enter task description"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phase <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={editingTask.phaseId}
                      onChange={(e) => setEditingTask({ ...editingTask, phaseId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                    >
                      {data.phases.map(phase => (
                        <option key={phase.id} value={phase.id}>{phase.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={editingTask.priority}
                      onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as Priority })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Estimated Hours
                    </label>
                    <input
                      type="number"
                      value={editingTask.estimatedHours || ''}
                      onChange={(e) => setEditingTask({ ...editingTask, estimatedHours: parseFloat(e.target.value) || 0 })}
                      min="0"
                      step="0.5"
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={editingTask.status}
                      onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as TaskStatus })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-gray-700">
                  <button
                    onClick={saveEditedTask}
                    disabled={!editingTask.title.trim() || !editingTask.phaseId}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setShowEditTaskModal(false);
                      setEditingTask(null);
                    }}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Add New Task</h3>
                <button
                  onClick={() => setShowAddTaskModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Task Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title"
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Enter task description"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phase <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={newTask.phaseId}
                      onChange={(e) => setNewTask({ ...newTask, phaseId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                    >
                      {data.phases.map(phase => (
                        <option key={phase.id} value={phase.id}>{phase.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Estimated Hours
                    </label>
                    <input
                      type="number"
                      value={newTask.estimatedHours || ''}
                      onChange={(e) => setNewTask({ ...newTask, estimatedHours: parseFloat(e.target.value) || 0 })}
                      min="0"
                      step="0.5"
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Initial Status
                    </label>
                    <select
                      value={newTask.status}
                      onChange={(e) => setNewTask({ ...newTask, status: e.target.value as TaskStatus })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-gray-700">
                  <button
                    onClick={createTask}
                    disabled={!newTask.title.trim() || !newTask.phaseId}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Task
                  </button>
                  <button
                    onClick={() => setShowAddTaskModal(false)}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
