import { describe, it, expect, beforeEach } from 'vitest';
import { TimerService } from '../TimerService';
import { TimerType, TimerStatus } from '../../models/TimerCombination';

/**
 * Unit tests for TimerService
 * Tests CRUD operations, timer state management, and timer progression
 */
describe('TimerService', () => {
  // Clear all timers before each test to ensure isolation
  beforeEach(() => {
    TimerService.clear();
  });

  describe('CRUD Operations', () => {
    it('should create a new timer with correct initial state', () => {
      const timer = TimerService.create({
        name: 'Test Timer',
        description: 'A test timer',
        segments: [
          {
            id: 'seg1',
            type: TimerType.FOCUS,
            duration: 1500,
            label: 'Focus',
          },
        ],
        repeatCount: 1,
      });

      expect(timer).toBeDefined();
      expect(timer.name).toBe('Test Timer');
      expect(timer.status).toBe(TimerStatus.IDLE);
      expect(timer.currentSegmentIndex).toBe(0);
      expect(timer.currentRepeat).toBe(1);
      expect(timer.remainingTime).toBe(1500);
      expect(timer.totalElapsedTime).toBe(0);
    });

    it('should retrieve a timer by ID', () => {
      const created = TimerService.create({
        name: 'Findable Timer',
        segments: [
          {
            id: 'seg1',
            type: TimerType.FOCUS,
            duration: 1000,
            label: 'Focus',
          },
        ],
        repeatCount: 1,
      });

      const found = TimerService.getById(created.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.name).toBe('Findable Timer');
    });

    it('should return undefined for non-existent timer ID', () => {
      const timer = TimerService.getById('non-existent-id');
      expect(timer).toBeUndefined();
    });

    it('should retrieve all timers', () => {
      TimerService.create({
        name: 'Timer 1',
        segments: [{ id: '1', type: TimerType.FOCUS, duration: 1000, label: 'Focus' }],
        repeatCount: 1,
      });

      TimerService.create({
        name: 'Timer 2',
        segments: [{ id: '2', type: TimerType.SHORT_BREAK, duration: 300, label: 'Break' }],
        repeatCount: 1,
      });

      const allTimers = TimerService.getAll();
      expect(allTimers).toHaveLength(2);
      expect(allTimers[0].name).toBe('Timer 1');
      expect(allTimers[1].name).toBe('Timer 2');
    });

    it('should update a timer', () => {
      const timer = TimerService.create({
        name: 'Original Name',
        segments: [{ id: '1', type: TimerType.FOCUS, duration: 1000, label: 'Focus' }],
        repeatCount: 1,
      });

      const updated = TimerService.update(timer.id, {
        name: 'Updated Name',
        description: 'New description',
      });

      expect(updated).toBeDefined();
      expect(updated?.name).toBe('Updated Name');
      expect(updated?.description).toBe('New description');
      expect(updated?.id).toBe(timer.id); // ID should not change
    });

    it('should delete a timer', () => {
      const timer = TimerService.create({
        name: 'To Delete',
        segments: [{ id: '1', type: TimerType.FOCUS, duration: 1000, label: 'Focus' }],
        repeatCount: 1,
      });

      const deleted = TimerService.delete(timer.id);
      expect(deleted).toBe(true);

      const found = TimerService.getById(timer.id);
      expect(found).toBeUndefined();
    });

    it('should return false when deleting non-existent timer', () => {
      const deleted = TimerService.delete('non-existent-id');
      expect(deleted).toBe(false);
    });
  });

  describe('Timer State Management', () => {
    it('should start a timer', () => {
      const timer = TimerService.create({
        name: 'Start Test',
        segments: [{ id: '1', type: TimerType.FOCUS, duration: 1000, label: 'Focus' }],
        repeatCount: 1,
      });

      const started = TimerService.start(timer.id);
      expect(started).toBeDefined();
      expect(started?.status).toBe(TimerStatus.RUNNING);
    });

    it('should pause a running timer', () => {
      const timer = TimerService.create({
        name: 'Pause Test',
        segments: [{ id: '1', type: TimerType.FOCUS, duration: 1000, label: 'Focus' }],
        repeatCount: 1,
      });

      TimerService.start(timer.id);
      const paused = TimerService.pause(timer.id);

      expect(paused).toBeDefined();
      expect(paused?.status).toBe(TimerStatus.PAUSED);
    });

    it('should not pause a timer that is not running', () => {
      const timer = TimerService.create({
        name: 'Not Running',
        segments: [{ id: '1', type: TimerType.FOCUS, duration: 1000, label: 'Focus' }],
        repeatCount: 1,
      });

      const paused = TimerService.pause(timer.id);
      expect(paused).toBeUndefined();
    });

    it('should reset a timer to initial state', () => {
      const timer = TimerService.create({
        name: 'Reset Test',
        segments: [
          { id: '1', type: TimerType.FOCUS, duration: 1000, label: 'Focus' },
          { id: '2', type: TimerType.SHORT_BREAK, duration: 300, label: 'Break' },
        ],
        repeatCount: 2,
      });

      // Modify the timer state
      TimerService.start(timer.id);
      TimerService.update(timer.id, {
        currentSegmentIndex: 1,
        currentRepeat: 2,
        remainingTime: 100,
        totalElapsedTime: 500,
      });

      // Reset timer
      const reset = TimerService.reset(timer.id);

      expect(reset).toBeDefined();
      expect(reset?.status).toBe(TimerStatus.IDLE);
      expect(reset?.currentSegmentIndex).toBe(0);
      expect(reset?.currentRepeat).toBe(1);
      expect(reset?.remainingTime).toBe(1000);
      expect(reset?.totalElapsedTime).toBe(0);
    });
  });

  describe('Timer Progression', () => {
    it('should tick down remaining time when running', () => {
      const timer = TimerService.create({
        name: 'Tick Test',
        segments: [{ id: '1', type: TimerType.FOCUS, duration: 10, label: 'Focus' }],
        repeatCount: 1,
      });

      TimerService.start(timer.id);
      const ticked = TimerService.tick(timer.id);

      expect(ticked).toBeDefined();
      expect(ticked?.remainingTime).toBe(9);
      expect(ticked?.totalElapsedTime).toBe(1);
    });

    it('should move to next segment when current segment completes', () => {
      const timer = TimerService.create({
        name: 'Next Segment Test',
        segments: [
          { id: '1', type: TimerType.FOCUS, duration: 1, label: 'Focus' },
          { id: '2', type: TimerType.SHORT_BREAK, duration: 5, label: 'Break' },
        ],
        repeatCount: 1,
      });

      TimerService.start(timer.id);
      TimerService.tick(timer.id); // Tick to 0
      const ticked = TimerService.tick(timer.id); // Tick to transition

      expect(ticked).toBeDefined();
      expect(ticked?.currentSegmentIndex).toBe(1);
      expect(ticked?.remainingTime).toBe(5);
    });

    it('should complete timer when all segments and repeats are done', () => {
      const timer = TimerService.create({
        name: 'Complete Test',
        segments: [{ id: '1', type: TimerType.FOCUS, duration: 1, label: 'Focus' }],
        repeatCount: 1,
      });

      TimerService.start(timer.id);
      TimerService.tick(timer.id); // Tick to 0
      const completed = TimerService.tick(timer.id); // Tick to complete

      expect(completed).toBeDefined();
      expect(completed?.status).toBe(TimerStatus.COMPLETED);
    });

    it('should move to next repeat when all segments in current repeat complete', () => {
      const timer = TimerService.create({
        name: 'Repeat Test',
        segments: [{ id: '1', type: TimerType.FOCUS, duration: 1, label: 'Focus' }],
        repeatCount: 2,
      });

      TimerService.start(timer.id);
      TimerService.tick(timer.id); // Tick to 0
      const nextRepeat = TimerService.tick(timer.id); // Tick to next repeat

      expect(nextRepeat).toBeDefined();
      expect(nextRepeat?.currentRepeat).toBe(2);
      expect(nextRepeat?.currentSegmentIndex).toBe(0);
      expect(nextRepeat?.remainingTime).toBe(1);
    });
  });

  describe('Subscription System', () => {
    it('should notify subscribers when timer is created', () => {
      let notificationCount = 0;
      const unsubscribe = TimerService.subscribe(() => {
        notificationCount++;
      });

      TimerService.create({
        name: 'Notification Test',
        segments: [{ id: '1', type: TimerType.FOCUS, duration: 1000, label: 'Focus' }],
        repeatCount: 1,
      });

      expect(notificationCount).toBe(1);
      unsubscribe();
    });

    it('should allow unsubscribing from notifications', () => {
      let notificationCount = 0;
      const unsubscribe = TimerService.subscribe(() => {
        notificationCount++;
      });

      TimerService.create({
        name: 'Unsubscribe Test 1',
        segments: [{ id: '1', type: TimerType.FOCUS, duration: 1000, label: 'Focus' }],
        repeatCount: 1,
      });

      unsubscribe();

      TimerService.create({
        name: 'Unsubscribe Test 2',
        segments: [{ id: '2', type: TimerType.FOCUS, duration: 1000, label: 'Focus' }],
        repeatCount: 1,
      });

      expect(notificationCount).toBe(1); // Only first creation should notify
    });
  });
});
