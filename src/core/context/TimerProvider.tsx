import React, { useEffect, useState, useCallback, ReactNode } from 'react';
import { TimerCombination } from '../models/TimerCombination';
import { TimerService } from '../services/TimerService';
import { TimerContext, TimerContextValue } from './TimerContext';

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [timers, setTimers] = useState<TimerCombination[]>([]);
  const [activeTimer, setActiveTimerState] = useState<TimerCombination | null>(null);
  const [tickInterval, setTickInterval] = useState<NodeJS.Timeout | null>(null);

  // Load timers from service
  const refreshTimers = useCallback(() => {
    setTimers(TimerService.getAll());
  }, []);

  // Subscribe to service changes
  useEffect(() => {
    refreshTimers();
    const unsubscribe = TimerService.subscribe(() => {
      refreshTimers();
    });

    return () => {
      unsubscribe();
    };
  }, [refreshTimers]);

  // Set up timer tick interval for active timer
  useEffect(() => {
    // Clear existing interval
    if (tickInterval) {
      clearInterval(tickInterval);
      setTickInterval(null);
    }

    // If there's an active running timer, start interval
    if (activeTimer && activeTimer.status === 'RUNNING') {
      const interval = setInterval(() => {
        const updatedTimer = TimerService.tick(activeTimer.id);
        if (updatedTimer) {
          setActiveTimerState(updatedTimer);

          // If timer completed, clear interval
          if (updatedTimer.status === 'COMPLETED') {
            clearInterval(interval);
            setTickInterval(null);
          }
        }
      }, 1000);

      setTickInterval(interval);
    }

    return () => {
      if (tickInterval) {
        clearInterval(tickInterval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTimer?.id, activeTimer?.status]);

  // Keep active timer in sync with timers list
  useEffect(() => {
    if (activeTimer) {
      const updatedActiveTimer = timers.find((t) => t.id === activeTimer.id);
      if (updatedActiveTimer) {
        setActiveTimerState(updatedActiveTimer);
      }
    }
  }, [timers, activeTimer]);

  const setActiveTimer = useCallback((timer: TimerCombination | null) => {
    setActiveTimerState(timer);
  }, []);

  const createTimer = useCallback((
    data: Omit<
      TimerCombination,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'currentSegmentIndex'
      | 'currentRepeat'
      | 'status'
      | 'remainingTime'
      | 'totalElapsedTime'
    >
  ): TimerCombination => {
    return TimerService.create(data);
  }, []);

  const updateTimer = useCallback((id: string, data: Partial<TimerCombination>) => {
    TimerService.update(id, data);
  }, []);

  const deleteTimer = useCallback((id: string) => {
    setActiveTimerState((current) => {
      if (current && current.id === id) {
        return null;
      }
      return current;
    });
    TimerService.delete(id);
  }, []);

  const startTimer = useCallback((id: string) => {
    const timer = TimerService.start(id);
    if (timer) {
      setActiveTimerState(timer);
    }
  }, []);

  const pauseTimer = useCallback((id: string) => {
    TimerService.pause(id);
  }, []);

  const resetTimer = useCallback((id: string) => {
    TimerService.reset(id);
  }, []);

  const value: TimerContextValue = React.useMemo(() => ({
    timers,
    activeTimer,
    setActiveTimer,
    createTimer,
    updateTimer,
    deleteTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    refreshTimers,
  }), [
    timers,
    activeTimer,
    setActiveTimer,
    createTimer,
    updateTimer,
    deleteTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    refreshTimers,
  ]);

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};
