'use client';

import { useMemo } from 'react';
import { ProjectData } from '@/types';
import { DataManager } from '@/lib/data';
import { useTimer } from '@/lib/timerContext';
import { formatDuration, formatTime, formatTimerTime } from '@/lib/utils';
import { Play, Square, Clock, Calendar } from 'lucide-react';
import TimeCalendar from './TimeCalendar';

interface TimeTrackerProps {
  data: ProjectData;
  onUpdate: () => void;
}

export default function TimeTracker({ data, onUpdate }: TimeTrackerProps) {
  const manager = DataManager.getInstance();
  const { timer, startTimer: startGlobalTimer, stopTimer: stopGlobalTimer, isActive } = useTimer();

  // Get only active/in-progress tasks
  const activeTasks = useMemo(() => {
    return data.tasks.filter(t => 
      t.status === 'in_progress' || isActive(t.id)
    );
  }, [data.tasks, isActive]);

  const stopTimerAndSave = () => {
    if (!timer.taskId || !timer.startTime) return;

    const endTime = new Date();
    const startTime = timer.startTime;
    // Calculate duration in seconds first, then convert to minutes (as decimal for precision)
    const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const durationMinutes = durationSeconds / 60; // Store as decimal to preserve seconds
    const today = new Date().toISOString().split('T')[0];

    manager.addTimeEntry({
      taskId: timer.taskId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: durationMinutes, // Store as decimal minutes (e.g., 0.45 for 27 seconds)
      date: today,
    });

    stopGlobalTimer();
    onUpdate();
  };

  // Get time entries for active tasks only
  const activeTimeEntries = useMemo(() => {
    const activeTaskIds = activeTasks.map(t => t.id);
    return data.timeEntries
      .filter(te => activeTaskIds.includes(te.taskId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.timeEntries, activeTasks]);

  // Group by date
  const entriesByDate = useMemo(() => {
    return activeTimeEntries.reduce((acc, entry) => {
      if (!acc[entry.date]) acc[entry.date] = [];
      acc[entry.date].push(entry);
      return acc;
    }, {} as Record<string, typeof activeTimeEntries>);
  }, [activeTimeEntries]);

  const totalTimeToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return activeTimeEntries
      .filter(te => te.date === today)
      .reduce((sum, te) => sum + (te.duration || 0), 0);
  }, [activeTimeEntries]);

  const totalTimeThisWeek = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return activeTimeEntries
      .filter(te => new Date(te.date) >= weekAgo)
      .reduce((sum, te) => sum + (te.duration || 0), 0);
  }, [activeTimeEntries]);

  const totalTimeThisMonth = useMemo(() => {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    return activeTimeEntries
      .filter(te => new Date(te.date) >= monthStart)
      .reduce((sum, te) => sum + (te.duration || 0), 0);
  }, [activeTimeEntries]);

  // Get all time entries (not just active tasks) for comprehensive stats
  const allTimeEntries = useMemo(() => {
    return data.timeEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.timeEntries]);

  const allTimeToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return allTimeEntries
      .filter(te => te.date === today)
      .reduce((sum, te) => {
        // Calculate from startTime/endTime if available for accuracy
        if (te.startTime && te.endTime) {
          const start = new Date(te.startTime);
          const end = new Date(te.endTime);
          const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
          return sum + (seconds / 60);
        }
        return sum + (te.duration || 0);
      }, 0);
  }, [allTimeEntries]);

  const allTimeThisWeek = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return allTimeEntries
      .filter(te => new Date(te.date) >= weekAgo)
      .reduce((sum, te) => {
        // Calculate from startTime/endTime if available for accuracy
        if (te.startTime && te.endTime) {
          const start = new Date(te.startTime);
          const end = new Date(te.endTime);
          const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
          return sum + (seconds / 60);
        }
        return sum + (te.duration || 0);
      }, 0);
  }, [allTimeEntries]);

  const allTimeThisMonth = useMemo(() => {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    return allTimeEntries
      .filter(te => new Date(te.date) >= monthStart)
      .reduce((sum, te) => {
        // Calculate from startTime/endTime if available for accuracy
        if (te.startTime && te.endTime) {
          const start = new Date(te.startTime);
          const end = new Date(te.endTime);
          const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
          return sum + (seconds / 60);
        }
        return sum + (te.duration || 0);
      }, 0);
  }, [allTimeEntries]);

  const currentTask = useMemo(() => {
    if (!timer.taskId) return null;
    return data.tasks.find(t => t.id === timer.taskId);
  }, [data.tasks, timer.taskId]);

  // Get latest 5 active tasks sorted by most recent activity
  const latestActiveTasks = useMemo(() => {
    return activeTasks
      .map(task => {
        const taskEntries = data.timeEntries.filter(te => te.taskId === task.id);
        const lastEntry = taskEntries.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
        return {
          task,
          lastActivity: lastEntry ? new Date(lastEntry.date).getTime() : 0,
        };
      })
      .sort((a, b) => b.lastActivity - a.lastActivity)
      .slice(0, 5)
      .map(item => item.task);
  }, [activeTasks, data.timeEntries]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Time Tracker</h2>
        <p className="mt-2 text-sm text-gray-400">
          Track your time and view statistics. Start a task timer from the Tasks page to begin tracking time.
        </p>
        {allTimeEntries.length === 0 && (
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>How to track time:</strong> Go to the Tasks page, click "Start" on any task, then click "Stop Timer" when done. Your time will appear here automatically.
            </p>
          </div>
        )}
      </div>

      {/* Stats - All Time Entries */}
      <div className="bg-gray-800 shadow-xl rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-bold text-white">Time Statistics</h3>
          <p className="text-sm text-gray-400 mt-1">Total time logged across all tasks</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-400">Today</p>
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white font-mono">
              {formatTimerTime(Math.floor(allTimeToday * 60))}
            </p>
            <p className="text-xs text-blue-400 mt-1">
              {allTimeEntries.filter(te => te.date === new Date().toISOString().split('T')[0]).length} session{allTimeEntries.filter(te => te.date === new Date().toISOString().split('T')[0]).length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-green-400">This Week</p>
              <Clock className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white font-mono">
              {formatTimerTime(Math.floor(allTimeThisWeek * 60))}
            </p>
            <p className="text-xs text-green-400 mt-1">
              Last 7 days
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-purple-400">This Month</p>
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white font-mono">
              {formatTimerTime(Math.floor(allTimeThisMonth * 60))}
            </p>
            <p className="text-xs text-purple-400 mt-1">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Time Entries - All Tasks */}
      {allTimeEntries.length > 0 ? (
        <div className="bg-gray-800 shadow-xl rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-bold text-white">Time Log</h3>
            <p className="text-sm text-gray-400 mt-1">All time entries across all tasks</p>
          </div>
          <div className="divide-y divide-gray-700">
            {(() => {
              // Group all entries by date
              const allEntriesByDate = allTimeEntries.reduce((acc, entry) => {
                if (!acc[entry.date]) acc[entry.date] = [];
                acc[entry.date].push(entry);
                return acc;
              }, {} as Record<string, typeof allTimeEntries>);

              return Object.entries(allEntriesByDate)
                .slice(0, 14) // Show last 14 days
                .map(([date, entries]) => {
                  // Calculate day total from startTime/endTime if available for accuracy
                  const dayTotal = entries.reduce((sum, e) => {
                    if (e.startTime && e.endTime) {
                      const start = new Date(e.startTime);
                      const end = new Date(e.endTime);
                      const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
                      return sum + (seconds / 60);
                    }
                    return sum + (e.duration || 0);
                  }, 0);
                  const isToday = date === new Date().toISOString().split('T')[0];
                  return (
                    <div key={date} className={`p-4 ${isToday ? 'bg-blue-500/10' : ''}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className={`font-medium ${isToday ? 'text-blue-400' : 'text-white'}`}>
                            {new Date(date).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                            {isToday && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                Today
                              </span>
                            )}
                          </h4>
                        </div>
                        <span className={`text-base font-bold ${isToday ? 'text-blue-400' : 'text-white'} font-mono`}>
                          {formatTimerTime(Math.floor(dayTotal * 60))}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {entries.map(entry => {
                          const task = data.tasks.find(t => t.id === entry.taskId);
                          const startTime = entry.startTime ? new Date(entry.startTime) : null;
                          const endTime = entry.endTime ? new Date(entry.endTime) : null;
                          
                          return (
                            <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white">
                                  {task?.title || 'Unknown Task'}
                                </p>
                                {startTime && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    {startTime.toLocaleTimeString('en-US', { 
                                      hour: 'numeric', 
                                      minute: '2-digit',
                                      second: endTime && (endTime.getTime() - startTime.getTime()) < 60000 ? '2-digit' : undefined
                                    })}
                                    {endTime && (
                                      <span className="ml-1">
                                        - {endTime.toLocaleTimeString('en-US', { 
                                          hour: 'numeric', 
                                          minute: '2-digit',
                                          second: (endTime.getTime() - startTime.getTime()) < 60000 ? '2-digit' : undefined
                                        })}
                                      </span>
                                    )}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-white font-mono">
                                  {(() => {
                                    // Calculate from startTime/endTime if available for accuracy, otherwise use stored duration
                                    if (startTime && endTime) {
                                      const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
                                      return formatTimerTime(durationSeconds);
                                    } else {
                                      const durationMinutes = entry.duration || 0;
                                      const durationSeconds = Math.floor(durationMinutes * 60);
                                      return formatTimerTime(durationSeconds);
                                    }
                                  })()}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
            })()}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 shadow-xl rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-bold text-white">Time Log</h3>
            <p className="text-sm text-gray-400 mt-1">All time entries across all tasks</p>
          </div>
          <div className="p-12 text-center">
            <Clock className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-300 font-medium text-lg">No time logged yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Start a task timer from the Tasks page to begin tracking time
            </p>
          </div>
        </div>
      )}

      {/* Time Calendar */}
      <TimeCalendar data={data} />

      {/* Latest Active Tasks - Only show latest 5 at bottom */}
      {latestActiveTasks.length > 0 && (
        <div className="bg-gray-800 shadow-xl rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-bold text-white">Latest Active Tasks</h3>
            <p className="text-sm text-gray-400 mt-1">
              {latestActiveTasks.length} of {activeTasks.length} active task{activeTasks.length !== 1 ? 's' : ''} shown
            </p>
          </div>
          <div className="divide-y divide-gray-700">
            {latestActiveTasks.map(task => {
              const taskTimeEntries = data.timeEntries.filter(te => te.taskId === task.id);
              const totalTaskTime = taskTimeEntries.reduce((sum, te) => sum + (te.duration || 0), 0);
              const isCurrentlyTracking = isActive(task.id);
              
              return (
                <div
                  key={task.id}
                  className={`p-5 ${isCurrentlyTracking ? 'bg-blue-500/10 border-l-4 border-blue-500' : 'hover:bg-gray-700'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-base font-semibold text-white">{task.title}</h4>
                        {isCurrentlyTracking && (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center space-x-1">
                            <Clock className="w-3 h-3 animate-pulse" />
                            <span>Tracking</span>
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-400 mb-3 line-clamp-1">{task.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Total Time: <span className="font-semibold text-white font-mono">{formatTimerTime(Math.floor(totalTaskTime * 60))}</span></span>
                        {taskTimeEntries.length > 0 && (
                          <span>{taskTimeEntries.length} session{taskTimeEntries.length !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                    {!isCurrentlyTracking && (
                      <button
                        onClick={() => {
                          manager.updateTask(task.id, { status: 'in_progress' });
                          startGlobalTimer(task.id);
                          onUpdate();
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-semibold text-sm flex items-center space-x-2"
                      >
                        <Play className="w-4 h-4" />
                        <span>Start Timer</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
