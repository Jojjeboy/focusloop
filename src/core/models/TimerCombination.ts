/**
 * TimerCombination Model
 * Represents a combination of timers with focus and break periods
 */

export enum TimerType {
  FOCUS = 'FOCUS',
  SHORT_BREAK = 'SHORT_BREAK',
  LONG_BREAK = 'LONG_BREAK',
}

export enum TimerStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export interface TimerSegment {
  id: string;
  type: TimerType;
  duration: number; // in seconds
  label: string;
  color?: string;
}

export interface TimerCombination {
  id: string;
  name: string;
  description?: string;
  segments: TimerSegment[];
  repeatCount: number; // Number of times to repeat the combination
  currentSegmentIndex: number;
  currentRepeat: number;
  status: TimerStatus;
  remainingTime: number; // Remaining time for current segment
  totalElapsedTime: number; // Total elapsed time for all segments
  createdAt: Date;
  updatedAt: Date;
  pausedAt?: Date | null; // NU TILLÅTS NULL
}

export interface CreateTimerCombinationDto {
  name: string;
  description?: string;
  segments: Omit<TimerSegment, 'id'>[];
  repeatCount: number;
}

export interface UpdateTimerCombinationDto {
  name?: string;
  description?: string;
  segments?: Omit<TimerSegment, 'id'>[];
  repeatCount?: number;
}

// Default timer presets
export const DEFAULT_TIMER_PRESETS = {
  POMODORO: {
    name: 'Pomodoro',
    description: 'Classic 25-5 minute intervals',
    segments: [
      { type: TimerType.FOCUS, duration: 25 * 60, label: 'Focus', color: '#ef4444' },
      { type: TimerType.SHORT_BREAK, duration: 5 * 60, label: 'Short Break', color: '#10b981' },
    ],
    repeatCount: 4,
  },
  LONG_POMODORO: {
    name: 'Long Pomodoro',
    description: '50-10 minute intervals',
    segments: [
      { type: TimerType.FOCUS, duration: 50 * 60, label: 'Deep Focus', color: '#ef4444' },
      { type: TimerType.SHORT_BREAK, duration: 10 * 60, label: 'Break', color: '#10b981' },
    ],
    repeatCount: 3,
  },
  CUSTOM_CYCLE: {
    name: 'Work Cycle',
    description: 'Work with varied breaks',
    segments: [
      { type: TimerType.FOCUS, duration: 45 * 60, label: 'Work', color: '#ef4444' },
      { type: TimerType.SHORT_BREAK, duration: 10 * 60, label: 'Short Break', color: '#10b981' },
      { type: TimerType.FOCUS, duration: 45 * 60, label: 'Work', color: '#ef4444' },
      { type: TimerType.LONG_BREAK, duration: 20 * 60, label: 'Long Break', color: '#3b82f6' },
    ],
    repeatCount: 2,
  },
};
