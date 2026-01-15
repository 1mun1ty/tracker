'use client';

import React, { useMemo } from 'react';
import { useTimer } from '@/lib/timerContext';
import { DataManager } from '@/lib/data';
import { formatTimerTime } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { ProjectData } from '@/types';

interface TimerBannerProps {
  data: ProjectData;
  onStop: () => void;
}

export default function TimerBanner({ data, onStop }: TimerBannerProps) {
  const { timer, stopTimer } = useTimer();
  const manager = DataManager.getInstance();
  const [isSaving, setIsSaving] = React.useState(false);

  const task = useMemo(() => {
    return data.tasks.find(t => t.id === timer.taskId);
  }, [data.tasks, timer.taskId]);

  if (!timer.taskId || !timer.startTime) return null;

  const handleStop = () => {
    if (!timer.taskId || !timer.startTime || isSaving) return;
    
    setIsSaving(true);

    const endTime = new Date();
    const taskIdToSave = timer.taskId;
    const startTimeToSave = timer.startTime;
    
    // Calculate duration in seconds first, then convert to minutes (as decimal for precision)
    const durationSeconds = Math.floor((endTime.getTime() - startTimeToSave.getTime()) / 1000);
    const durationMinutes = durationSeconds / 60; // Store as decimal to preserve seconds
    const today = new Date().toISOString().split('T')[0];

    // Check for duplicate entry (same task, same start time within 2 seconds)
    const existingEntry = data.timeEntries.find(te => 
      te.taskId === taskIdToSave && 
      te.startTime === startTimeToSave.toISOString()
    );

    if (!existingEntry) {
      // Save time entry with precise duration
      manager.addTimeEntry({
        taskId: taskIdToSave,
        startTime: startTimeToSave.toISOString(),
        endTime: endTime.toISOString(),
        duration: durationMinutes, // Store as decimal minutes (e.g., 0.45 for 27 seconds)
        date: today,
      });

      // Update task's actual hours
      const currentTask = data.tasks.find(t => t.id === taskIdToSave);
      if (currentTask) {
        const newActualHours = (currentTask.actualHours || 0) + (durationMinutes / 60);
        manager.updateTask(taskIdToSave, { actualHours: newActualHours });
      }
    }

    stopTimer();
    setTimeout(() => setIsSaving(false), 1000); // Prevent double-clicks
    onStop();
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl shadow-2xl p-4 mb-6 border border-blue-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center animate-pulse backdrop-blur-sm">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-100">Currently Tracking</p>
            <p className="text-lg font-bold">
              {task?.title || 'Unknown Task'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-blue-100">Time Elapsed</p>
            <p className="text-2xl font-bold font-mono">{formatTimerTime(timer.elapsedSeconds)}</p>
          </div>
          <button
            onClick={handleStop}
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg font-semibold transition-all backdrop-blur-sm border border-white/20"
          >
            Stop Timer
          </button>
        </div>
      </div>
    </div>
  );
}
