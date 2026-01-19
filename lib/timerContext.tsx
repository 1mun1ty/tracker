'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TimeEntry } from '@/types';

interface TimerContextType {
  activeTimer: {
    taskId: string;
    startTime: Date;
  } | null;
  startTimer: (taskId: string) => void;
  stopTimer: (taskId: string, description?: string) => Promise<void>;
  getElapsedTime: () => number; // in seconds
  formatTime: (seconds: number) => string;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [activeTimer, setActiveTimer] = useState<{ taskId: string; startTime: Date } | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Update elapsed time every second
  useEffect(() => {
    if (!activeTimer) {
      setElapsedSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - activeTimer.startTime.getTime()) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  // Load active timer from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('activeTimer');
    if (stored) {
      try {
        const timer = JSON.parse(stored);
        setActiveTimer({
          taskId: timer.taskId,
          startTime: new Date(timer.startTime),
        });
      } catch (error) {
        console.error('Failed to load active timer:', error);
      }
    }
  }, []);

  const startTimer = (taskId: string) => {
    const startTime = new Date();
    const timer = { taskId, startTime };
    setActiveTimer(timer);
    localStorage.setItem('activeTimer', JSON.stringify({
      taskId,
      startTime: startTime.toISOString(),
    }));
  };

  const stopTimer = async (taskId: string, description?: string) => {
    if (!activeTimer || activeTimer.taskId !== taskId) {
      return;
    }

    const endTime = new Date();
    const startTime = activeTimer.startTime;
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60); // minutes

    // Save time entry
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          duration,
          description,
          date: today,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save time entry');
      }
    } catch (error) {
      console.error('Failed to save time entry:', error);
      throw error;
    }

    // Clear timer
    setActiveTimer(null);
    localStorage.removeItem('activeTimer');
    setElapsedSeconds(0);
  };

  const getElapsedTime = (): number => {
    if (!activeTimer) return 0;
    return elapsedSeconds;
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TimerContext.Provider
      value={{
        activeTimer,
        startTimer,
        stopTimer,
        getElapsedTime,
        formatTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
