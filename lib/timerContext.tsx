'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Timer context - no imports needed here

interface TimerState {
  taskId: string | null;
  startTime: Date | null;
  elapsedSeconds: number;
}

interface TimerContextType {
  timer: TimerState;
  startTimer: (taskId: string) => void;
  stopTimer: () => void;
  isActive: (taskId: string) => boolean;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [timer, setTimer] = useState<TimerState>(() => {
    // Load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('activeTimer');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const startTime = new Date(parsed.startTime);
          const elapsedSeconds = Math.floor((Date.now() - startTime.getTime()) / 1000);
          return {
            taskId: parsed.taskId,
            startTime: startTime,
            elapsedSeconds: elapsedSeconds,
          };
        } catch {
          return { taskId: null, startTime: null, elapsedSeconds: 0 };
        }
      }
    }
    return { taskId: null, startTime: null, elapsedSeconds: 0 };
  });

  // Update elapsed time every second
  useEffect(() => {
    if (!timer.startTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - timer.startTime!.getTime()) / 1000);
      setTimer(prev => ({ ...prev, elapsedSeconds: elapsed }));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.startTime]);

  // Save to localStorage when timer changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (timer.taskId && timer.startTime) {
        localStorage.setItem('activeTimer', JSON.stringify({
          taskId: timer.taskId,
          startTime: timer.startTime.toISOString(),
        }));
      } else {
        localStorage.removeItem('activeTimer');
      }
    }
  }, [timer.taskId, timer.startTime]);

  const startTimer = (taskId: string) => {
    setTimer({
      taskId,
      startTime: new Date(),
      elapsedSeconds: 0,
    });
  };

  const stopTimer = () => {
    setTimer({ taskId: null, startTime: null, elapsedSeconds: 0 });
  };

  const isActive = (taskId: string) => {
    return timer.taskId === taskId;
  };

  return (
    <TimerContext.Provider value={{ timer, startTimer, stopTimer, isActive }}>
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
