import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { TimerCombination } from '../models/TimerCombination';
import { TimerService } from '../services/TimerService';

/**
 * TimerContext - React Context for managing timer state across the app
 */

interface TimerContextValue {
    timers: TimerCombination[];
    activeTimer: TimerCombination | null;
    setActiveTimer: (timer: TimerCombination | null) => void;
    createTimer: (data: Omit<TimerCombination, 'id' | 'createdAt' | 'updatedAt' | 'currentSegmentIndex' | 'currentRepeat' | 'status' | 'remainingTime' | 'totalElapsedTime'>) => TimerCombination;
    updateTimer: (id: string, data: Partial<TimerCombination>) => void;
    deleteTimer: (id: string) => void;
    startTimer: (id: string) => void;
    pauseTimer: (id: string) => void;
    resetTimer: (id: string) => void;
    refreshTimers: () => void;
}

const TimerContext = createContext<TimerContextValue | undefined>(undefined);

interface TimerProviderProps {
    children: ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
    const [timers, setTimers] = useState<TimerCombination[]>([]);
    const [activeTimer, setActiveTimerState] = useState<TimerCombination | null>(null);
    const [tickInterval, setTickInterval] = useState<NodeJS.Timeout | null>(null);

    // Load timers from service
    const refreshTimers = () => {
        setTimers(TimerService.getAll());
    };

    // Subscribe to service changes
    useEffect(() => {
        refreshTimers();
        const unsubscribe = TimerService.subscribe(() => {
            refreshTimers();
        });

        return () => {
            unsubscribe();
        };
    }, []);

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
    }, [activeTimer?.id, activeTimer?.status]);

    // Keep active timer in sync with timers list
    useEffect(() => {
        if (activeTimer) {
            const updatedActiveTimer = timers.find(t => t.id === activeTimer.id);
            if (updatedActiveTimer) {
                setActiveTimerState(updatedActiveTimer);
            }
        }
    }, [timers]);

    const setActiveTimer = (timer: TimerCombination | null) => {
        setActiveTimerState(timer);
    };

    const createTimer = (data: Omit<TimerCombination, 'id' | 'createdAt' | 'updatedAt' | 'currentSegmentIndex' | 'currentRepeat' | 'status' | 'remainingTime' | 'totalElapsedTime'>): TimerCombination => {
        return TimerService.create(data);
    };

    const updateTimer = (id: string, data: Partial<TimerCombination>) => {
        TimerService.update(id, data);
    };

    const deleteTimer = (id: string) => {
        if (activeTimer && activeTimer.id === id) {
            setActiveTimerState(null);
        }
        TimerService.delete(id);
    };

    const startTimer = (id: string) => {
        const timer = TimerService.start(id);
        if (timer) {
            setActiveTimerState(timer);
        }
    };

    const pauseTimer = (id: string) => {
        TimerService.pause(id);
    };

    const resetTimer = (id: string) => {
        TimerService.reset(id);
    };

    const value: TimerContextValue = {
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
    };

    return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};

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

export default TimerContext;
