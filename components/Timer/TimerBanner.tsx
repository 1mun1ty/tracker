'use client';

import { useTimer } from '@/lib/timerContext';
import { Task } from '@/types';
import { Clock, Square } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TimerBannerProps {
  tasks: Task[];
  onStop: () => void;
}

export default function TimerBanner({ tasks, onStop }: TimerBannerProps) {
  const { activeTimer, stopTimer, getElapsedTime, formatTime } = useTimer();
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (activeTimer) {
      const task = tasks.find(t => t.id === activeTimer.taskId);
      setCurrentTask(task || null);
    } else {
      setCurrentTask(null);
    }
  }, [activeTimer, tasks]);

  useEffect(() => {
    if (!activeTimer) {
      setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsed(getElapsedTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer, getElapsedTime]);

  if (!activeTimer || !currentTask) {
    return null;
  }

  const handleStop = async () => {
    try {
      await stopTimer(activeTimer.taskId);
      onStop();
    } catch (error) {
      console.error('Failed to stop timer:', error);
    }
  };

  return (
    <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 animate-pulse" />
        <div>
          <span className="font-medium">Tracking time for:</span>
          <span className="ml-2">{currentTask.title}</span>
        </div>
        <div className="ml-4 flex items-center gap-2">
          <span className="font-mono text-lg">{formatTime(elapsed)}</span>
        </div>
      </div>
      <button
        onClick={handleStop}
        className="flex items-center gap-2 px-4 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
      >
        <Square className="w-4 h-4" />
        Stop Timer
      </button>
    </div>
  );
}
