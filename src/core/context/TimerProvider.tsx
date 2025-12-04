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

  // FIX 1: Initialisera timers direkt med data frÃ¥n TimerService fÃ¶r att undvika setState i useEffect.
  const [timers, setTimers] = useState<TimerCombination[]>(() => TimerService.getAll());

  // FIX 2: Lagra endast ID fÃ¶r den aktiva timern i tillstÃ¥ndet.
  const [activeTimerId, setActiveTimerId] = useState<string | null>(null);
  const [syncEnabled] = useState(true);

  // Derivera det kompletta aktiva timer-objektet frÃ¥n timers-listan.
  // Detta ersÃ¤tter den felaktiga synkroniserings-useEffect.
  const activeTimer = React.useMemo(() => {
    if (!activeTimerId) return null;
    return timers.find(t => t.id === activeTimerId) || null;
  }, [activeTimerId, timers]);


  // Load timers from Firestore when user authenticates
  const refreshTimers = useCallback(async () => {
    // FIX: Ta bort den synkrona setState-anropet hÃ¤rifrÃ¥n.
    // Vi fÃ¶rlitar oss pÃ¥ useState-initialiseringen och TimerService.subscribe fÃ¶r att ladda lokalt.
    if (!user || !syncEnabled) {
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

      // Uppdatera React-tillstÃ¥ndet efter att sammanslagningen har skett i TimerService
      setTimers(TimerService.getAll());
    } catch (error) {
      console.error('Error loading timers from Firestore:', error);
      // Ã„ven vid fel, se till att React-tillstÃ¥ndet Ã¥terspeglar TimerService (som kan ha Ã¤ndrats lokalt)
      setTimers(TimerService.getAll());
    }
  }, [user, syncEnabled]);

  // Initial/Auth-klar synkronisering (kör endast om user/sync är aktiva)
  // Moving this outside of useEffect to avoid cascading renders
  React.useLayoutEffect(() => {
    if (!authLoading && user && syncEnabled) {
      void refreshTimers();
    }
  }, [authLoading, user, syncEnabled, refreshTimers]);

  // Kontinuerlig prenumeration på lokala ändringar (ticking, CRUD)
  useEffect(() => {
    const unsubscribe = TimerService.subscribe(() => {
      // Always update local state to reflect ticking
      setTimers(TimerService.getAll());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Borttagen: Den gamla useEffect som synkroniserade activeTimer, eftersom den nu Ã¤r en useMemo-derivering.

  const setActiveTimer = useCallback((timer: TimerCombination | null) => {
    // Uppdatera endast ID
    setActiveTimerId(timer ? timer.id : null);
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
    setActiveTimerId((currentId) => {
      if (currentId === id) {
        return null;
      }
      return currentId;
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
      // setActiveTimerState(timer) ersÃ¤tts av att TimerService.subscribe anropas,
      // som uppdaterar 'timers', vilket i sin tur triggar 'useMemo' fÃ¶r att uppdatera 'activeTimer'.

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
    activeTimer, // Detta Ã¤r nu den deriverade (computed) variabeln
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
    activeTimer, // Inkludera den deriverade variabeln hÃ¤r
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
