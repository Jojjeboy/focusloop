import { createContext, useContext } from 'react';
import { TimerCombination } from '../models/TimerCombination';

/**
 * TimerContext - React Context for managing timer state across the app
 */

export interface TimerContextValue {
  timers: TimerCombination[];
  activeTimer: TimerCombination | null;
  setActiveTimer: (timer: TimerCombination | null) => void;
  createTimer: (
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
  ) => Promise<TimerCombination>;
  updateTimer: (id: string, data: Partial<TimerCombination>) => Promise<void>;
  deleteTimer: (id: string) => Promise<void>;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  resetTimer: (id: string) => void;
  archiveTimer: (id: string) => Promise<void>;
  refreshTimers: () => Promise<void>;
}

export const TimerContext = createContext<TimerContextValue | undefined>(undefined);

/**
 * Hook to use TimerContext
 */
export const useTimers = (): TimerContextValue => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimers must be used within a TimerProvider');
  }
  return context;
};
