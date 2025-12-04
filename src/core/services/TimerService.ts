import { TimerCombination, TimerStatus } from '../models/TimerCombination';

/**
 * TimerService - CRUD operations for timer combinations
 * Using local state only (no persistence)
 */

class TimerServiceClass {
    private timers: Map<string, TimerCombination> = new Map();
    private listeners: Set<() => void> = new Set();

    /**
     * Subscribe to timer changes
     */
    subscribe(callback: () => void): () => void {
        this.listeners.add(callback);
        return () => {
            this.listeners.delete(callback);
        };
    }

    /**
     * Notify all subscribers of changes
     */
    private notifyListeners(): void {
        this.listeners.forEach(callback => callback());
    }

    /**
     * Generate a unique ID
     */
    private generateId(): string {
        return `timer_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }

    /**
     * Create a new timer combination
     */
    create(data: Omit<TimerCombination, 'id' | 'createdAt' | 'updatedAt' | 'currentSegmentIndex' | 'currentRepeat' | 'status' | 'remainingTime' | 'totalElapsedTime'>): TimerCombination {
        const id = this.generateId();
        const now = new Date();

        const timer: TimerCombination = {
            ...data,
            id,
            currentSegmentIndex: 0,
            currentRepeat: 1,
            status: TimerStatus.IDLE,
            remainingTime: data.segments[0]?.duration || 0,
            totalElapsedTime: 0,
            createdAt: now,
            updatedAt: now,
        };

        this.timers.set(id, timer);
        this.notifyListeners();
        return timer;
    }

    /**
     * Get a timer by ID
     */
    getById(id: string): TimerCombination | undefined {
        return this.timers.get(id);
    }

    /**
     * Get all timers
     */
    getAll(): TimerCombination[] {
        return Array.from(this.timers.values());
    }

    /**
     * Update a timer combination
     */
    update(id: string, data: Partial<Omit<TimerCombination, 'id' | 'createdAt'>>): TimerCombination | undefined {
        const timer = this.timers.get(id);
        if (!timer) {
            return undefined;
        }

        const updatedTimer: TimerCombination = {
            ...timer,
            ...data,
            id: timer.id, // Ensure ID doesn't change
            createdAt: timer.createdAt, // Preserve creation date
            updatedAt: new Date(),
        };

        this.timers.set(id, updatedTimer);
        this.notifyListeners();
        return updatedTimer;
    }

    /**
     * Delete a timer combination
     */
    delete(id: string): boolean {
        const result = this.timers.delete(id);
        if (result) {
            this.notifyListeners();
        }
        return result;
    }

    /**
     * Clear all timers
     */
    clear(): void {
        this.timers.clear();
        this.notifyListeners();
    }

    /**
     * Get timer count
     */
    count(): number {
        return this.timers.size;
    }

    /**
     * Start a timer
     */
    start(id: string): TimerCombination | undefined {
        const timer = this.timers.get(id);
        if (!timer) {
            return undefined;
        }

        return this.update(id, {
            status: TimerStatus.RUNNING,
        });
    }

    /**
     * Pause a timer
     */
    pause(id: string): TimerCombination | undefined {
        const timer = this.timers.get(id);
        if (!timer || timer.status !== 'RUNNING') {
            return undefined;
        }

        return this.update(id, {
            status: TimerStatus.PAUSED,
        });
    }

    /**
     * Reset a timer to initial state
     */
    reset(id: string): TimerCombination | undefined {
        const timer = this.timers.get(id);
        if (!timer) {
            return undefined;
        }

        return this.update(id, {
            currentSegmentIndex: 0,
            currentRepeat: 1,
            status: TimerStatus.IDLE,
            remainingTime: timer.segments[0]?.duration || 0,
            totalElapsedTime: 0,
        });
    }

    /**
     * Move to next segment
     */
    nextSegment(id: string): TimerCombination | undefined {
        const timer = this.timers.get(id);
        if (!timer) {
            return undefined;
        }

        let nextIndex = timer.currentSegmentIndex + 1;
        let nextRepeat = timer.currentRepeat;

        // Check if we've completed all segments in current repeat
        if (nextIndex >= timer.segments.length) {
            nextRepeat += 1;

            // Check if we've completed all repeats
            if (nextRepeat > timer.repeatCount) {
                return this.update(id, {
                    status: TimerStatus.COMPLETED,
                });
            }

            nextIndex = 0; // Start from first segment again
        }

        return this.update(id, {
            currentSegmentIndex: nextIndex,
            currentRepeat: nextRepeat,
            remainingTime: timer.segments[nextIndex]?.duration || 0,
        });
    }

    /**
     * Update remaining time
     */
    tick(id: string): TimerCombination | undefined {
        const timer = this.timers.get(id);
        if (!timer || timer.status !== 'RUNNING') {
            return undefined;
        }

        const newRemainingTime = Math.max(0, timer.remainingTime - 1);
        const newTotalElapsedTime = timer.totalElapsedTime + 1;

        // If current segment is complete, move to next
        if (newRemainingTime === 0) {
            return this.nextSegment(id);
        }

        return this.update(id, {
            remainingTime: newRemainingTime,
            totalElapsedTime: newTotalElapsedTime,
        });
    }
}

// Export singleton instance
export const TimerService = new TimerServiceClass();
