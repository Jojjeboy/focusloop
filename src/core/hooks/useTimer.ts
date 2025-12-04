import { useEffect, useState } from 'react';
import { TimerCombination } from '../models/TimerCombination';

/**
 * Custom hook for timer countdown logic
 */
export const useTimerCountdown = (timer: TimerCombination | null) => {
    const [formattedTime, setFormattedTime] = useState<string>('00:00');

    useEffect(() => {
        if (!timer) {
            setFormattedTime('00:00');
            return;
        }

        const minutes = Math.floor(timer.remainingTime / 60);
        const seconds = timer.remainingTime % 60;
        setFormattedTime(
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
    }, [timer?.remainingTime]);

    return formattedTime;
};

/**
 * Custom hook for calculating timer progress
 */
export const useTimerProgress = (timer: TimerCombination | null) => {
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        if (!timer || !timer.segments[timer.currentSegmentIndex]) {
            setProgress(0);
            return;
        }

        const currentSegment = timer.segments[timer.currentSegmentIndex];
        const elapsed = currentSegment.duration - timer.remainingTime;
        const percentage = (elapsed / currentSegment.duration) * 100;
        setProgress(Math.min(100, Math.max(0, percentage)));
    }, [timer?.remainingTime, timer?.currentSegmentIndex]);

    return progress;
};
