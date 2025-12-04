import React, { useEffect, useState, useCallback, ReactNode } from 'react';
import { TimerCombination, TimerStatus } from '../models/TimerCombination';
import { TimerService } from '../services/TimerService';
import { TimerContext, TimerContextValue } from './TimerContext';
import { useAuth } from './AuthContext';
import { FirestoreService } from '../../services/FirestoreService';

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [timers, setTimers] = useState<TimerCombination[]>([]);
  const [activeTimer, setActiveTimerState] = useState<TimerCombination | null>(null);
  const [tickInterval, setTickInterval] = useState<NodeJS.Timeout | null>(null);
  const [syncEnabled] = useState(true);

  // Load timers from Firestore when user authenticates
  const refreshTimers = useCallback(async () => {
    if (!user || !syncEnabled) {
      // Fall back to local TimerService
      setTimers(TimerService.getAll());
      return;
    }

    try {
      const firestoreTimers = await FirestoreService.getUserTimers(user.uid);
      setTimers(firestoreTimers);

      // Also update local TimerService with Firestore data
      TimerService.load(firestoreTimers);
    } catch (error) {
      console.error('Error loading timers from Firestore:', error);
      // Fall back to local storage
      setTimers(TimerService.getAll());
    }
  }, [user, syncEnabled]);

  // Subscribe to service changes and load timers on mount
  useEffect(() => {
    if (!authLoading) {
      refreshTimers();
    }

    const unsubscribe = TimerService.subscribe(() => {
      // Always update local state to reflect ticking
      setTimers(TimerService.getAll());
    });

    return () => {
      unsubscribe();
    };
  }, [authLoading, refreshTimers]);

  // Set up timer tick interval
  useEffect(() => {
    // Clear existing interval
    if (tickInterval) {
      clearInterval(tickInterval);
      setTickInterval(null);
    }

    // Start global tick interval
    const interval = setInterval(() => {
      TimerService.tickAll();
    }, 1000);

    setTickInterval(interval);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const createTimer = useCallback(async (
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
  ): Promise<TimerCombination> => {
    // Create locally first
    const timer = TimerService.create(data);

    // Sync to Firestore if user is authenticated
    if (user && syncEnabled) {
      try {
        // Pass timer data without id, createdAt, updatedAt (Firestore handles these)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...timerData } = timer;
        await FirestoreService.createTimer(user.uid, timerData);
      } catch (error) {
        console.error('Error creating timer in Firestore:', error);
      }
    }

    return timer;
  }, [user, syncEnabled]);

  const updateTimer = useCallback(async (id: string, data: Partial<TimerCombination>) => {
    // Update locally first
    TimerService.update(id, data);

    // Sync to Firestore if user is authenticated
    if (user && syncEnabled) {
      try {
        await FirestoreService.updateTimer(id, data);
      } catch (error) {
        console.error('Error updating timer in Firestore:', error);
      }
    }
  }, [user, syncEnabled]);

  const deleteTimer = useCallback(async (id: string) => {
    setActiveTimerState((current) => {
      if (current && current.id === id) {
        return null;
      }
      return current;
    });

    // Delete locally first
    TimerService.delete(id);

    // Sync to Firestore if user is authenticated
    if (user && syncEnabled) {
      try {
        await FirestoreService.deleteTimer(id);
      } catch (error) {
        console.error('Error deleting timer from Firestore:', error);
      }
    }
  }, [user, syncEnabled]);

  const startTimer = useCallback(async (id: string) => {
    const timer = TimerService.start(id);
    if (timer) {
      setActiveTimerState(timer);

      // Sync to Firestore
      if (user && syncEnabled) {
        try {
          await FirestoreService.updateTimer(id, { status: TimerStatus.RUNNING });
        } catch (error) {
          console.error('Error syncing start timer:', error);
        }
      }
    }
  }, [user, syncEnabled]);

  const pauseTimer = useCallback(async (id: string) => {
    const timer = TimerService.pause(id);
    if (timer) {
      // Sync to Firestore
      if (user && syncEnabled) {
        try {
          await FirestoreService.updateTimer(id, { status: TimerStatus.PAUSED });
        } catch (error) {
          console.error('Error syncing pause timer:', error);
        }
      }
    }
  }, [user, syncEnabled]);

  const resetTimer = useCallback(async (id: string) => {
    const timer = TimerService.reset(id);
    if (timer) {
      // Sync to Firestore
      if (user && syncEnabled) {
        try {
          await FirestoreService.updateTimer(id, {
            status: TimerStatus.IDLE,
            currentSegmentIndex: 0,
            currentRepeat: 1,
            remainingTime: timer.remainingTime,
            totalElapsedTime: 0
          });
        } catch (error) {
          console.error('Error syncing reset timer:', error);
        }
      }
    }
  }, [user, syncEnabled]);

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
