'use client';

import { useTimer } from '@/lib/timerContext';
import { Task, Project } from '@/types';
import { Play, Square, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ActiveTimerProps {
  tasks: Task[];
  onStop: () => void;
}

export default function ActiveTimer({ tasks, onStop }: ActiveTimerProps) {
  const { activeTimer, startTimer, stopTimer, getElapsedTime, formatTime } = useTimer();
  const [elapsed, setElapsed] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [isStopping, setIsStopping] = useState(false);

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

  const currentTask = activeTimer ? tasks.find(t => t.id === activeTimer.taskId) : null;

  const handleStart = () => {
    if (selectedTaskId) {
      startTimer(selectedTaskId);
      setSelectedTaskId('');
    }
  };

  const handleStop = async () => {
    if (!activeTimer) return;
    
    setIsStopping(true);
    try {
      await stopTimer(activeTimer.taskId);
      onStop();
    } catch (error) {
      console.error('Failed to stop timer:', error);
    } finally {
      setIsStopping(false);
    }
  };

  if (activeTimer && currentTask) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg border border-blue-500 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="text-white/80 text-sm mb-1">Currently Tracking</div>
              <div className="text-white text-xl font-bold">{currentTask.title}</div>
            </div>
            <div className="ml-4 px-4 py-2 bg-white/20 rounded-lg">
              <div className="text-white font-mono text-2xl font-bold">
                {formatTime(elapsed)}
              </div>
            </div>
          </div>
          <button
            onClick={handleStop}
            disabled={isStopping}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 font-semibold"
          >
            <Square className="w-5 h-5" />
            {isStopping ? 'Stopping...' : 'Stop Timer'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Start Time Tracking</h3>
          <p className="text-gray-400 text-sm">Select a task and start tracking your time</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
          >
            <option value="">Select a task...</option>
            {tasks.map(task => (
              <option key={task.id} value={task.id}>{task.title}</option>
            ))}
          </select>
          <button
            onClick={handleStart}
            disabled={!selectedTaskId}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            <Play className="w-5 h-5" />
            Start Timer
          </button>
        </div>
      </div>
    </div>
  );
}
