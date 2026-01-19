'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { useTimer } from '@/lib/timerContext';
import { Play, Square, Clock } from 'lucide-react';

interface TaskTimerProps {
  task: Task;
  onTimeUpdate?: () => void;
}

export default function TaskTimer({ task, onTimeUpdate }: TaskTimerProps) {
  const { activeTimer, startTimer, stopTimer, getElapsedTime, formatTime } = useTimer();
  const [elapsed, setElapsed] = useState(0);
  const [isStopping, setIsStopping] = useState(false);
  const isActive = activeTimer?.taskId === task.id;

  // Update elapsed time display
  useEffect(() => {
    if (!isActive) {
      setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsed(getElapsedTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, getElapsedTime]);

  const handleStart = () => {
    startTimer(task.id);
  };

  const handleStop = async () => {
    setIsStopping(true);
    try {
      await stopTimer(task.id);
      if (onTimeUpdate) {
        onTimeUpdate();
      }
    } catch (error) {
      console.error('Failed to stop timer:', error);
    } finally {
      setIsStopping(false);
    }
  };

  const totalHours = task.actualHours || 0;
  const estimatedHours = task.estimatedHours || 0;

  return (
    <div className="space-y-3">
      {/* Timer Controls */}
      <div className="flex items-center gap-3">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
            Start Timer
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg">
              <Clock className="w-4 h-4 animate-pulse" />
              <span className="font-mono">{formatTime(elapsed)}</span>
            </div>
            <button
              onClick={handleStop}
              disabled={isStopping}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <Square className="w-4 h-4" />
              {isStopping ? 'Stopping...' : 'Stop'}
            </button>
          </div>
        )}
      </div>

      {/* Time Summary */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-400 mb-1">Time Logged</div>
          <div className="text-white font-semibold">
            {totalHours.toFixed(1)} {totalHours === 1 ? 'hour' : 'hours'}
          </div>
        </div>
        {estimatedHours > 0 && (
          <div>
            <div className="text-gray-400 mb-1">Estimated</div>
            <div className="text-white font-semibold">
              {estimatedHours.toFixed(1)} {estimatedHours === 1 ? 'hour' : 'hours'}
            </div>
            {totalHours > 0 && (
              <div className="text-xs text-gray-400 mt-1">
                {((totalHours / estimatedHours) * 100).toFixed(0)}% complete
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
