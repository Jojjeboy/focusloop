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

      // Smart merge: prefer local active timers over stale Firestore data
      firestoreTimers.forEach(firestoreTimer => {
        const localTimer = TimerService.getById(firestoreTimer.id);

        if (localTimer) {
          // Check if local timer is in an active state (RUNNING or PAUSED)
          const isLocalActive = localTimer.status === TimerStatus.RUNNING ||
            localTimer.status === TimerStatus.PAUSED;

          // Compare timestamps to determine which version is more recent
          const localUpdatedAt = new Date(localTimer.updatedAt).getTime();
          const firestoreUpdatedAt = new Date(firestoreTimer.updatedAt).getTime();
          const isLocalNewer = localUpdatedAt > firestoreUpdatedAt;

          if (isLocalActive || isLocalNewer) {
            // Local timer is active or newer - push to Firestore instead of pulling
            FirestoreService.updateTimer(firestoreTimer.id, {
              status: localTimer.status,
              currentSegmentIndex: localTimer.currentSegmentIndex,
              currentRepeat: localTimer.currentRepeat,
              remainingTime: localTimer.remainingTime,
              totalElapsedTime: localTimer.totalElapsedTime,
              pausedAt: localTimer.pausedAt,
            }).catch(err => console.error('Error syncing local timer to Firestore:', err));
            // Keep local timer as-is (don't overwrite with Firestore data)
          } else {
            // Firestore is newer and timer is idle - update local from Firestore
            TimerService.update(firestoreTimer.id, firestoreTimer);
          }
        } else {
          // Timer doesn't exist locally - create it from Firestore
          TimerService.create(firestoreTimer);
        }
      });

      setTimers(TimerService.getAll());
    } catch (error) {
      console.error('Error loading timers from Firestore:', error);
      // Fall back to local storage
      setTimers(TimerService.getAll());
    }
  }, [user, syncEnabled]);

  // Subscribe to service changes and load timers on mount
  useEffect(() => {
    // Load timers from local storage first
    setTimers(TimerService.getAll());

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
    data: Partial<TimerCombination>
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

  const pauseTimer = useCallback(
    async (id: string) => {
      const timer = TimerService.pause(id);
      if (timer) {
        // Sync to Firestore
        if (user && syncEnabled) {
          try {
            await FirestoreService.updateTimer(id, {
              status: TimerStatus.PAUSED,
            });
          } catch (error) {
            console.error('Error syncing pause timer:', error);
          }
        }
      }
    },
    [user, syncEnabled]
  );

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
