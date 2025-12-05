import { TimerCombination, TimerStatus } from '../models/TimerCombination';

/**
 * TimerService - CRUD operations for timer combinations
 * Using local state only (no persistence)
 */

class TimerServiceClass {
  public timers: Map<string, TimerCombination> = new Map();
  private listeners: Set<() => void> = new Set();
  private tickInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadTimersFromLocalStorage();

    // Save state precisely when the user leaves/reloads the page
    // to ensure 'updatedAt' is as accurate as possible.
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.saveTimersToLocalStorage();
      });
    }
  }

  /**
   * Save timers to local storage
   */
  private saveTimersToLocalStorage(): void {
    const timersArray = Array.from(this.timers.entries());
    localStorage.setItem('timers', JSON.stringify(timersArray));
  }

  /**
   * Load timers from local storage and account for elapsed time
   */
  private loadTimersFromLocalStorage(): void {
    const storedTimers = localStorage.getItem('timers');
    if (storedTimers) {
      try {
        const timersArray = JSON.parse(storedTimers);
        const hydratedTimers = new Map<string, TimerCombination>();
        const now = new Date().getTime();

        timersArray.forEach(([id, timer]: [string, TimerCombination]) => {
          // Clone to avoid side-effects
          const hydratedTimer = { ...timer };

          switch (hydratedTimer.status) {
            case TimerStatus.RUNNING: {
              // When a running timer is loaded after a refresh, calculate elapsed time
              // and update remainingTime accordingly so the timer resumes from the correct position
              const lastUpdatedAt = new Date(hydratedTimer.updatedAt).getTime();
              const elapsedSeconds = Math.floor((now - lastUpdatedAt) / 1000);

              // Subtract the elapsed time from remaining time
              const newRemainingTime = Math.max(0, hydratedTimer.remainingTime - elapsedSeconds);
              hydratedTimer.remainingTime = newRemainingTime;

              // Add elapsed time to total elapsed time
              hydratedTimer.totalElapsedTime = (hydratedTimer.totalElapsedTime || 0) + elapsedSeconds;

              // If the segment completed during the reload, we need to handle segment transitions
              if (newRemainingTime === 0) {
                // Move to next segment/repeat or mark as completed
                let nextIndex = hydratedTimer.currentSegmentIndex + 1;
                let nextRepeat = hydratedTimer.currentRepeat;

                if (nextIndex >= hydratedTimer.segments.length) {
                  nextRepeat += 1;
                  if (nextRepeat > hydratedTimer.repeatCount) {
                    // Timer completed all segments and repeats
                    hydratedTimer.status = TimerStatus.COMPLETED;
                  } else {
                    // Start next repeat
                    nextIndex = 0;
                    hydratedTimer.currentSegmentIndex = nextIndex;
                    hydratedTimer.currentRepeat = nextRepeat;
                    hydratedTimer.remainingTime = hydratedTimer.segments[nextIndex]?.duration || 0;
                  }
                } else {
                  // Move to next segment in current repeat
                  hydratedTimer.currentSegmentIndex = nextIndex;
                  hydratedTimer.remainingTime = hydratedTimer.segments[nextIndex]?.duration || 0;
                }
              }

              // Keep the timer running
              break;
            }
            case TimerStatus.PAUSED:
              // When a timer is paused, its state should be restored exactly as it was.
              // The remainingTime does not change. Any elapsed time while paused
              // is calculated when the timer is resumed in the `start()` method.
              break;

            case TimerStatus.IDLE:
            case TimerStatus.COMPLETED:
              // These are inactive states, no special handling needed on load.
              break;
          }

          hydratedTimers.set(id, hydratedTimer);
        });

        this.timers = hydratedTimers;

        if (this.getAll().some(t => t.status === TimerStatus.RUNNING)) {
          this.startTicking();
        }
      } catch (error) {
        console.error('Failed to parse timers from local storage', error);
      }
    }
  }

  /**
   * Start ticking all running timers
   */
  private startTicking(): void {
    if (this.tickInterval) {
      return;
    }
    this.tickInterval = setInterval(() => {
      this.tickAll();
    }, 1000);
  }

  /**
   * Stop ticking all running timers
   */
  private stopTicking(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

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
    this.saveTimersToLocalStorage();
    this.listeners.forEach((callback) => callback());
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
  create(
    data: Partial<TimerCombination>
  ): TimerCombination {
    const id = data.id || this.generateId();
    const now = new Date();

    const timer: TimerCombination = {
      ...data,
      id,
      currentSegmentIndex: data.currentSegmentIndex || 0,
      currentRepeat: data.currentRepeat || 1,
      status: data.status || TimerStatus.IDLE,
      remainingTime: data.remainingTime || data.segments?.[0]?.duration || 0,
      totalElapsedTime: data.totalElapsedTime || 0,
      createdAt: data.createdAt || now,
      updatedAt: now,
      name: data.name || 'New Timer',
      segments: data.segments || [],
      repeatCount: data.repeatCount || 1,
    } as TimerCombination;

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
  update(
    id: string,
    data: Partial<Omit<TimerCombination, 'id' | 'createdAt'>>
  ): TimerCombination | undefined {
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

    if (!this.getAll().some(t => t.status === TimerStatus.RUNNING)) {
      this.stopTicking();
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

    this.startTicking();

    const updateData: Partial<TimerCombination> = {
      status: TimerStatus.RUNNING,
    };

    if (timer.pausedAt) {
      const pausedDuration = (new Date().getTime() - new Date(timer.pausedAt).getTime()) / 1000;
      updateData.totalElapsedTime = timer.totalElapsedTime + Math.round(pausedDuration);
      updateData.pausedAt = undefined;
    }

    return this.update(id, updateData);
  }

  /**
   * Pause a timer
   */
  pause(id: string): TimerCombination | undefined {
    const timerToPause = this.timers.get(id);
    if (!timerToPause || timerToPause.status !== 'RUNNING') {
      return undefined;
    }

    // Explicitly check how many are running *before* the update.
    const runningTimers = this.getAll().filter(t => t.status === TimerStatus.RUNNING);

    const updatedTimer = this.update(id, {
      status: TimerStatus.PAUSED,
      pausedAt: new Date(),
    });

    // If there was only 1 running timer (the one we just paused), stop ticking.
    if (runningTimers.length === 1 && runningTimers[0].id === id) {
      this.stopTicking();
    }

    return updatedTimer;
  }

  /**
   * Reset a timer to initial state
   */
  reset(id: string): TimerCombination | undefined {
    const timer = this.timers.get(id);
    if (!timer) {
      return undefined;
    }

    const updatedTimer = this.update(id, {
      currentSegmentIndex: 0,
      currentRepeat: 1,
      status: TimerStatus.IDLE,
      remainingTime: timer.segments[0]?.duration || 0,
      totalElapsedTime: 0,
    });

    if (!this.getAll().some(t => t.status === TimerStatus.RUNNING)) {
      this.stopTicking();
    }
    return updatedTimer;
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

    // If timer is already at 0, perform transition logic
    if (timer.remainingTime === 0) {
      // Vibrate for 2 seconds
      if (navigator.vibrate) {
        navigator.vibrate(2000);
      }

      // Play a beep sound for 2 seconds
      try {
        const AudioContext = window.AudioContext || (window as { webkitAudioContext?: new () => AudioContext }).webkitAudioContext;
        if (AudioContext) {
          const audioContext = new AudioContext();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note

          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Lower volume

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.start();
          setTimeout(() => {
            oscillator.stop();
            audioContext.close();
          }, 2000);
        }
      } catch (e) {
        console.warn("Audio play failed", e);
      }

      const nextTimer = this.nextSegment(id);
      if (nextTimer?.status === TimerStatus.COMPLETED && !this.getAll().some(t => t.status === TimerStatus.RUNNING)) {
        this.stopTicking();
      }
      return nextTimer;
    }

    // Otherwise decrement
    const newRemainingTime = Math.max(0, timer.remainingTime - 1);
    const newTotalElapsedTime = timer.totalElapsedTime + 1;

    return this.update(id, {
      remainingTime: newRemainingTime,
      totalElapsedTime: newTotalElapsedTime,
    });
  }

  /**
   * Tick all running timers
   */
  tickAll(): TimerCombination[] {
    const updatedTimers: TimerCombination[] = [];
    this.timers.forEach((timer) => {
      if (timer.status === TimerStatus.RUNNING) {
        const updated = this.tick(timer.id);
        if (updated) {
          updatedTimers.push(updated);
        }
      }
    });
    return updatedTimers;
  }
}

// Export singleton instance
export const TimerService = new TimerServiceClass();
