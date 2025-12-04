import { useMemo } from 'react';
import { TimerCombination } from '../models/TimerCombination';

/**
 * Custom hook for timer countdown logic
 */
export const useTimerCountdown = (timer: TimerCombination | null) => {
  const formattedTime = useMemo(() => {
    if (!timer) {
      return '00:00';
    }

    const minutes = Math.floor(timer.remainingTime / 60);
    const seconds = timer.remainingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timer]);

  return formattedTime;
};

/**
 * Custom hook for calculating timer progress
 */
export const useTimerProgress = (timer: TimerCombination | null) => {
  const progress = useMemo(() => {
    if (!timer || !timer.segments[timer.currentSegmentIndex]) {
      return 0;
    }

    const currentSegment = timer.segments[timer.currentSegmentIndex];
    const elapsed = currentSegment.duration - timer.remainingTime;
    const percentage = (elapsed / currentSegment.duration) * 100;
    return Math.min(100, Math.max(0, percentage));
  }, [timer]);

  return progress;
};
