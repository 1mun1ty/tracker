'use client';

import { useMemo, useState, useCallback } from 'react';
import { ProjectData } from '@/types';
import { formatDuration, formatTimerTime } from '@/lib/utils';
import { Calendar, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';

interface TimeCalendarProps {
  data: ProjectData;
}

export default function TimeCalendar({ data }: TimeCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Get time entries grouped by date
  const timeByDate = useMemo(() => {
    return data.timeEntries.reduce((acc, entry) => {
      if (!acc[entry.date]) {
        acc[entry.date] = 0;
      }
      acc[entry.date] += entry.duration || 0;
      return acc;
    }, {} as Record<string, number>);
  }, [data.timeEntries]);

  // Get tasks for each date
  const tasksByDate = useMemo(() => {
    return data.timeEntries.reduce((acc, entry) => {
      if (!acc[entry.date]) {
        acc[entry.date] = new Set<string>();
      }
      acc[entry.date].add(entry.taskId);
      return acc;
    }, {} as Record<string, Set<string>>);
  }, [data.timeEntries]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDateKey = useCallback((day: number) => {
    const date = new Date(year, month, day);
    return date.toISOString().split('T')[0];
  }, [year, month]);

  const getDayTime = (day: number) => {
    const dateKey = getDateKey(day);
    return timeByDate[dateKey] || 0;
  };

  const getDayTasks = (day: number) => {
    const dateKey = getDateKey(day);
    return tasksByDate[dateKey]?.size || 0;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return month === today.getMonth() && year === today.getFullYear();
  };

  // Calculate month totals
  const monthTotal = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const dateKey = getDateKey(i + 1);
      return timeByDate[dateKey] || 0;
    }).reduce((sum, minutes) => sum + minutes, 0);
  }, [timeByDate, daysInMonth, getDateKey]);

  const monthTaskCount = useMemo(() => {
    const uniqueTasks = new Set<string>();
    Array.from({ length: daysInMonth }, (_, i) => {
      const dateKey = getDateKey(i + 1);
      if (tasksByDate[dateKey]) {
        tasksByDate[dateKey].forEach(taskId => uniqueTasks.add(taskId));
      }
    });
    return uniqueTasks.size;
  }, [tasksByDate, daysInMonth, getDateKey]);

  // Get detailed entries for selected date
  const selectedDateEntries = useMemo(() => {
    if (!selectedDate) return [];
    return data.timeEntries
      .filter(te => te.date === selectedDate)
      .sort((a, b) => {
        const timeA = a.startTime ? new Date(a.startTime).getTime() : 0;
        const timeB = b.startTime ? new Date(b.startTime).getTime() : 0;
        return timeB - timeA;
      });
  }, [data.timeEntries, selectedDate]);

  const selectedDateTotal = useMemo(() => {
    return selectedDateEntries.reduce((sum, e) => sum + (e.duration || 0), 0);
  }, [selectedDateEntries]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDayClick = (day: number) => {
    const dateKey = getDateKey(day);
    const dayTime = getDayTime(day);
    if (dayTime > 0) {
      setSelectedDate(dateKey);
    }
  };

  return (
    <>
      <div className="bg-gray-800 shadow-xl rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Time Activity Calendar</h3>
                <p className="text-xs text-gray-400 mt-1">Click on a day with logged time to see details</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs text-gray-400">This Month</p>
                <p className="text-sm font-bold text-white">{formatDuration(monthTotal)}</p>
                <p className="text-xs text-gray-400">{monthTaskCount} tasks</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
                <div className="text-center min-w-[140px]">
                  <p className="text-sm font-semibold text-white">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                {!isCurrentMonth() && (
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-1 text-xs font-semibold text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors border border-blue-500/30"
                  >
                    Today
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

      <div className="p-6">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square"></div>
          ))}

          {/* Calendar days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const minutes = getDayTime(day);
            const taskCount = getDayTasks(day);
            const hours = minutes / 60;
            const intensity = Math.min(hours / 8, 1); // Max intensity at 8 hours

            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                  minutes > 0 ? 'cursor-pointer' : 'cursor-default'
                } ${
                  isToday(day)
                    ? 'border-blue-500 bg-blue-500/20'
                    : minutes > 0
                    ? 'border-gray-600 hover:border-blue-500/50'
                    : 'border-gray-700'
                }`}
                style={{
                  backgroundColor: minutes > 0
                    ? `rgba(59, 130, 246, ${0.15 + intensity * 0.35})`
                    : 'transparent',
                }}
                title={minutes > 0 ? `Click to see details for ${formatDuration(minutes)}` : 'No time logged'}
              >
                <div className="p-1.5 h-full flex flex-col">
                  <div className={`text-xs font-semibold mb-1 ${
                    isToday(day) ? 'text-blue-300' : minutes > 0 ? 'text-white' : 'text-gray-400'
                  }`}>
                    {day}
                  </div>
                  {minutes > 0 && (
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="text-[10px] font-bold text-white leading-tight">
                        {formatDuration(minutes)}
                      </div>
                      {taskCount > 0 && (
                        <div className="text-[9px] text-blue-200 mt-0.5">
                          {taskCount} task{taskCount !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded border-2 border-gray-700 bg-gray-800"></div>
              <span className="text-gray-400">No time logged</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded border-2 border-gray-600" style={{ backgroundColor: 'rgba(59, 130, 246, 0.3)' }}></div>
              <span className="text-gray-400">Some time</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded border-2 border-gray-600" style={{ backgroundColor: 'rgba(59, 130, 246, 0.6)' }}></div>
              <span className="text-gray-400">Full day (8h+)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Day Detail Modal */}
    {selectedDate && selectedDateEntries.length > 0 && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDate(null)}>
        <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Total: <span className="font-bold text-blue-400">{formatDuration(selectedDateTotal)}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              {selectedDateEntries.map(entry => {
                const task = data.tasks.find(t => t.id === entry.taskId);
                const startTime = entry.startTime ? new Date(entry.startTime) : null;
                const endTime = entry.endTime ? new Date(entry.endTime) : null;
                const durationSeconds = startTime && endTime 
                  ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
                  : (entry.duration || 0) * 60;

                return (
                  <div key={entry.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-blue-500/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <h4 className="text-base font-semibold text-white">
                            {task?.title || 'Unknown Task'}
                          </h4>
                        </div>
                        {startTime && endTime && (
                          <p className="text-sm text-gray-400 mb-2">
                            {startTime.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true
                            })} - {endTime.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true
                            })}
                          </p>
                        )}
                        {task?.description && (
                          <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
                        )}
                      </div>
                      <div className="ml-4 text-right">
                        <p className="text-lg font-bold text-blue-400 font-mono">
                          {formatTimerTime(durationSeconds)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDuration(entry.duration || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
