'use client';

import { useState, useEffect } from 'react';
import { TimeEntry, Project, Task } from '@/types';
import { Clock, Calendar, TrendingUp, Target, Play, Plus } from 'lucide-react';
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, isToday } from 'date-fns';
import TimeTracker from './TimeTracker';
import ActiveTimer from './ActiveTimer';

interface TimeDashboardProps {
  projects: Project[];
  tasks: Task[];
  onUpdate: () => void;
}

type TimePeriod = 'today' | 'week' | 'month' | 'all';

export default function TimeDashboard({ projects, tasks, onUpdate }: TimeDashboardProps) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<TimePeriod>('today');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [showTimeTracker, setShowTimeTracker] = useState(false);

  useEffect(() => {
    loadTimeEntries();
  }, [period, selectedProject]);

  const loadTimeEntries = async () => {
    try {
      const response = await fetch('/api/time-entries');
      const data = await response.json();
      if (data.success) {
        let entries = data.data || [];
        
        // Filter by period
        const now = new Date();
        if (period === 'today') {
          const today = format(now, 'yyyy-MM-dd');
          entries = entries.filter((e: TimeEntry) => e.date === today);
        } else if (period === 'week') {
          const weekStart = format(startOfWeek(now), 'yyyy-MM-dd');
          const weekEnd = format(endOfWeek(now), 'yyyy-MM-dd');
          entries = entries.filter((e: TimeEntry) => e.date >= weekStart && e.date <= weekEnd);
        } else if (period === 'month') {
          const monthStart = format(startOfMonth(now), 'yyyy-MM-dd');
          const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');
          entries = entries.filter((e: TimeEntry) => e.date >= monthStart && e.date <= monthEnd);
        }

        // Filter by project
        if (selectedProject !== 'all') {
          const projectTasks = tasks.filter(t => t.projectId === selectedProject).map(t => t.id);
          entries = entries.filter((e: TimeEntry) => projectTasks.includes(e.taskId));
        }

        setTimeEntries(entries);
      }
    } catch (error) {
      console.error('Failed to load time entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalHours = () => {
    const totalMinutes = timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    return totalMinutes / 60;
  };

  const getProjectHours = (projectId: string) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId).map(t => t.id);
    const projectEntries = timeEntries.filter(e => projectTasks.includes(e.taskId));
    const totalMinutes = projectEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    return totalMinutes / 60;
  };

  const getDailyHours = () => {
    const dailyHours: Record<string, number> = {};
    timeEntries.forEach(entry => {
      const date = entry.date;
      if (!dailyHours[date]) {
        dailyHours[date] = 0;
      }
      dailyHours[date] += (entry.duration || 0) / 60;
    });
    return dailyHours;
  };

  const totalHours = getTotalHours();
  const dailyHours = getDailyHours();
  const avgDailyHours = Object.keys(dailyHours).length > 0
    ? Object.values(dailyHours).reduce((a, b) => a + b, 0) / Object.keys(dailyHours).length
    : 0;

  if (showTimeTracker) {
    return (
      <div>
        <button
          onClick={() => setShowTimeTracker(false)}
          className="mb-4 text-blue-400 hover:text-blue-300"
        >
          ← Back to Dashboard
        </button>
        <TimeTracker tasks={tasks} projects={projects} onUpdate={onUpdate} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Time Tracker</h1>
          <p className="text-gray-400 mt-1">Track and analyze your time</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTimeTracker(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Clock className="w-4 h-4" />
            View All Entries
          </button>
        </div>
      </div>

      {/* Active Timer */}
      <ActiveTimer tasks={tasks} onStop={loadTimeEntries} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Total Time</div>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-white">{totalHours.toFixed(1)}</div>
          <div className="text-sm text-gray-400 mt-1">hours this {period}</div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Daily Average</div>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-white">{avgDailyHours.toFixed(1)}</div>
          <div className="text-sm text-gray-400 mt-1">hours per day</div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Entries</div>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-white">{timeEntries.length}</div>
          <div className="text-sm text-gray-400 mt-1">time entries</div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Active Projects</div>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            {new Set(timeEntries.map(e => {
              const task = tasks.find(t => t.id === e.taskId);
              return task?.projectId;
            }).filter(Boolean)).size}
          </div>
          <div className="text-sm text-gray-400 mt-1">projects tracked</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as TimePeriod)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Projects</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>

      {/* Project Time Breakdown */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Time by Project</h2>
        <div className="space-y-3">
          {projects.map(project => {
            const hours = getProjectHours(project.id);
            if (hours === 0 && selectedProject !== 'all') return null;
            
            const percentage = totalHours > 0 ? (hours / totalHours) * 100 : 0;
            
            return (
              <div key={project.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-white font-medium">{project.name}</span>
                  </div>
                  <span className="text-white font-semibold">{hours.toFixed(1)}h</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: project.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
          {projects.length === 0 && (
            <p className="text-gray-400 text-center py-4">No projects yet</p>
          )}
        </div>
      </div>

      {/* Recent Time Entries */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Time Entries</h2>
        <div className="space-y-3">
          {timeEntries.slice(0, 10).map(entry => {
            const task = tasks.find(t => t.id === entry.taskId);
            const project = task ? projects.find(p => p.id === task.projectId) : null;
            const duration = (entry.duration || 0) / 60;
            
            return (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: project?.color || '#6B7280' }}
                  />
                  <div>
                    <div className="text-white font-medium">
                      {task?.title || 'Unknown Task'}
                    </div>
                    <div className="text-sm text-gray-400">
                      {project?.name || 'Unknown Project'} • {format(parseISO(entry.date), 'MMM d, yyyy')}
                    </div>
                    {entry.description && (
                      <div className="text-sm text-gray-500 mt-1">{entry.description}</div>
                    )}
                  </div>
                </div>
                <div className="text-white font-semibold">{duration.toFixed(1)}h</div>
              </div>
            );
          })}
          {timeEntries.length === 0 && (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No time entries yet</p>
              <p className="text-sm text-gray-500 mt-2">Start tracking time to see entries here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
