'use client';

import { useState, useEffect } from 'react';
import { TimeEntry, Task, Project } from '@/types';
import { Clock, Plus, Calendar, FileText, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface TimeTrackerProps {
  tasks: Task[];
  projects: Project[];
  onUpdate: () => void;
}

export default function TimeTracker({ tasks, projects, onUpdate }: TimeTrackerProps) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    loadTimeEntries();
  }, [filterDate]);

  const loadTimeEntries = async () => {
    try {
      let url = '/api/time-entries';
      if (filterDate) {
        url += `?date=${filterDate}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setTimeEntries(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load time entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTaskId || !duration) {
      return;
    }

    try {
      const durationMinutes = parseDuration(duration);
      const today = date || new Date().toISOString().split('T')[0];
      
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: selectedTaskId,
          duration: durationMinutes,
          description,
          date: today,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowAddModal(false);
        setSelectedTaskId('');
        setDuration('');
        setDescription('');
        loadTimeEntries();
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to add time entry:', error);
    }
  };

  const parseDuration = (input: string): number => {
    // Parse formats like "1h 30m", "90m", "1.5h"
    const hoursMatch = input.match(/(\d+(?:\.\d+)?)\s*h/i);
    const minutesMatch = input.match(/(\d+)\s*m/i);
    
    let totalMinutes = 0;
    if (hoursMatch) {
      totalMinutes += parseFloat(hoursMatch[1]) * 60;
    }
    if (minutesMatch) {
      totalMinutes += parseInt(minutesMatch[1]);
    }
    
    // If no units, assume minutes
    if (!hoursMatch && !minutesMatch) {
      totalMinutes = parseFloat(input) || 0;
    }
    
    return Math.round(totalMinutes);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };

  const getTaskName = (taskId: string): string => {
    const task = tasks.find(t => t.id === taskId);
    return task?.title || 'Unknown Task';
  };

  const getProjectName = (taskId: string): string => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return 'Unknown';
    const project = projects.find(p => p.id === task.projectId);
    return project?.name || 'Unknown';
  };

  const totalMinutes = timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  const totalHours = totalMinutes / 60;

  // Group entries by date
  const entriesByDate = timeEntries.reduce((acc, entry) => {
    const date = entry.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, TimeEntry[]>);

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
          <h1 className="text-2xl font-bold text-white">Time Tracker</h1>
          <p className="text-gray-400 mt-1">
            Total: {totalHours.toFixed(1)} {totalHours === 1 ? 'hour' : 'hours'} logged
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Time Entry
          </button>
        </div>
      </div>

      {/* Time Entries by Date */}
      <div className="space-y-6">
        {Object.entries(entriesByDate)
          .sort((a, b) => b[0].localeCompare(a[0]))
          .map(([date, entries]) => {
            const dayTotal = entries.reduce((sum, e) => sum + (e.duration || 0), 0);
            return (
              <div key={date} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-white">
                      {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                    </h3>
                  </div>
                  <div className="text-gray-400">
                    {formatDuration(dayTotal)} total
                  </div>
                </div>

                <div className="space-y-3">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-white font-medium">
                              {getTaskName(entry.taskId)}
                            </div>
                            <div className="text-sm text-gray-400">
                              {getProjectName(entry.taskId)}
                            </div>
                            {entry.description && (
                              <div className="text-sm text-gray-400 mt-1">
                                {entry.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-white font-semibold">
                        {formatDuration(entry.duration || 0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        {timeEntries.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No time entries yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-blue-400 hover:text-blue-300"
            >
              Add your first time entry
            </button>
          </div>
        )}
      </div>

      {/* Add Time Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Add Time Entry</h2>
            <form onSubmit={handleAddEntry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Task *
                </label>
                <select
                  required
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a task</option>
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration * (e.g., &quot;1h 30m&quot;, &quot;90m&quot;, &quot;1.5h&quot;)
                </label>
                <input
                  type="text"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="1h 30m"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What did you work on?"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Add Entry
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedTaskId('');
                    setDuration('');
                    setDescription('');
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
