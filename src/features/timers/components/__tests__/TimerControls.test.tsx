import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import TimerControls from '../TimerControls';
import { TimerCombination, TimerStatus, TimerType } from '../../../../core/models/TimerCombination';

/**
 * Component tests for TimerControls
 * Tests UI rendering and user interactions with timer control buttons
 */
describe('TimerControls', () => {
  // Helper function to create a mock timer for testing
  const createMockTimer = (status: TimerStatus = TimerStatus.IDLE): TimerCombination => ({
    id: 'test-timer-1',
    name: 'Test Timer',
    description: 'A test timer',
    segments: [
      {
        id: 'seg1',
        type: TimerType.FOCUS,
        duration: 1500,
        label: 'Focus',
        color: '#ef4444',
      },
    ],
    repeatCount: 1,
    currentSegmentIndex: 0,
    currentRepeat: 1,
    status,
    remainingTime: 1500,
    totalElapsedTime: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  describe('Button Rendering', () => {
    it('should render play button when timer is idle', () => {
      const mockTimer = createMockTimer(TimerStatus.IDLE);
      const mockHandlers = {
        onStart: vi.fn(),
        onPause: vi.fn(),
        onReset: vi.fn(),
      };

      render(<TimerControls timer={mockTimer} {...mockHandlers} />);

      // Play button should be visible
      const playButton = screen.getByRole('button', { name: /start/i });
      expect(playButton).toBeInTheDocument();

      // Reset button should not be visible when timer is idle
      const resetButton = screen.queryByRole('button', { name: /reset/i });
      expect(resetButton).not.toBeInTheDocument();
    });

    it('should render pause button when timer is running', () => {
      const mockTimer = createMockTimer(TimerStatus.RUNNING);
      const mockHandlers = {
        onStart: vi.fn(),
        onPause: vi.fn(),
        onReset: vi.fn(),
      };

      render(<TimerControls timer={mockTimer} {...mockHandlers} />);

      // Pause button should be visible
      const pauseButton = screen.getByRole('button', { name: /pause/i });
      expect(pauseButton).toBeInTheDocument();

      // Reset button should be visible when timer is running
      const resetButton = screen.getByRole('button', { name: /reset/i });
      expect(resetButton).toBeInTheDocument();
    });

    it('should render reset button when timer is paused', () => {
      const mockTimer = createMockTimer(TimerStatus.PAUSED);
      const mockHandlers = {
        onStart: vi.fn(),
        onPause: vi.fn(),
        onReset: vi.fn(),
      };

      render(<TimerControls timer={mockTimer} {...mockHandlers} />);

      // Play button should be visible (to resume)
      const playButton = screen.getByRole('button', { name: /start/i });
      expect(playButton).toBeInTheDocument();

      // Reset button should be visible when timer is paused
      const resetButton = screen.getByRole('button', { name: /reset/i });
      expect(resetButton).toBeInTheDocument();
    });

    it('should render next segment button when onNext prop is provided', () => {
      const mockTimer = createMockTimer(TimerStatus.RUNNING);
      const mockHandlers = {
        onStart: vi.fn(),
        onPause: vi.fn(),
        onReset: vi.fn(),
        onNext: vi.fn(),
      };

      render(<TimerControls timer={mockTimer} {...mockHandlers} />);

      const nextButton = screen.getByRole('button', { name: /next segment/i });
      expect(nextButton).toBeInTheDocument();
    });

    it('should render stop button when onStop prop is provided', () => {
      const mockTimer = createMockTimer(TimerStatus.RUNNING);
      const mockHandlers = {
        onStart: vi.fn(),
        onPause: vi.fn(),
        onReset: vi.fn(),
        onStop: vi.fn(),
      };

      render(<TimerControls timer={mockTimer} {...mockHandlers} />);

      const stopButton = screen.getByRole('button', { name: /stop/i });
      expect(stopButton).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onStart when play button is clicked', async () => {
      const user = userEvent.setup();
      const mockTimer = createMockTimer(TimerStatus.IDLE);
      const mockHandlers = {
        onStart: vi.fn(),
        onPause: vi.fn(),
        onReset: vi.fn(),
      };

      render(<TimerControls timer={mockTimer} {...mockHandlers} />);

      const playButton = screen.getByRole('button', { name: /start/i });
      await user.click(playButton);

      expect(mockHandlers.onStart).toHaveBeenCalledTimes(1);
    });

    it('should call onPause when pause button is clicked', async () => {
      const user = userEvent.setup();
      const mockTimer = createMockTimer(TimerStatus.RUNNING);
      const mockHandlers = {
        onStart: vi.fn(),
        onPause: vi.fn(),
        onReset: vi.fn(),
      };

      render(<TimerControls timer={mockTimer} {...mockHandlers} />);

      const pauseButton = screen.getByRole('button', { name: /pause/i });
      await user.click(pauseButton);

      expect(mockHandlers.onPause).toHaveBeenCalledTimes(1);
    });

    it('should call onReset when reset button is clicked', async () => {
      const user = userEvent.setup();
      const mockTimer = createMockTimer(TimerStatus.PAUSED);
      const mockHandlers = {
        onStart: vi.fn(),
        onPause: vi.fn(),
        onReset: vi.fn(),
      };

      render(<TimerControls timer={mockTimer} {...mockHandlers} />);

      const resetButton = screen.getByRole('button', { name: /reset/i });
      await user.click(resetButton);

      expect(mockHandlers.onReset).toHaveBeenCalledTimes(1);
    });

    it('should call onNext when next segment button is clicked', async () => {
      const user = userEvent.setup();
      const mockTimer = createMockTimer(TimerStatus.RUNNING);
      const mockHandlers = {
        onStart: vi.fn(),
        onPause: vi.fn(),
        onReset: vi.fn(),
        onNext: vi.fn(),
      };

      render(<TimerControls timer={mockTimer} {...mockHandlers} />);

      const nextButton = screen.getByRole('button', { name: /next segment/i });
      await user.click(nextButton);

      expect(mockHandlers.onNext).toHaveBeenCalledTimes(1);
    });

    it('should call onStop when stop button is clicked', async () => {
      const user = userEvent.setup();
      const mockTimer = createMockTimer(TimerStatus.RUNNING);
      const mockHandlers = {
        onStart: vi.fn(),
        onPause: vi.fn(),
        onReset: vi.fn(),
        onStop: vi.fn(),
      };

      render(<TimerControls timer={mockTimer} {...mockHandlers} />);

      const stopButton = screen.getByRole('button', { name: /stop/i });
      await user.click(stopButton);

      expect(mockHandlers.onStop).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper tooltips for all buttons', () => {
      const mockTimer = createMockTimer(TimerStatus.RUNNING);
      const mockHandlers = {
        onStart: vi.fn(),
        onPause: vi.fn(),
        onReset: vi.fn(),
        onNext: vi.fn(),
        onStop: vi.fn(),
      };

      render(<TimerControls timer={mockTimer} {...mockHandlers} />);

      // Check that buttons have accessible names via tooltips
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next segment/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument();
    });
  });
});
