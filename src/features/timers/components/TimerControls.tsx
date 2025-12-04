import React from 'react';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import StopIcon from '@mui/icons-material/Stop';
import { TimerCombination } from '../../../core/models/TimerCombination';

interface TimerControlsProps {
  timer: TimerCombination;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onNext?: () => void;
  onStop?: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  timer,
  onStart,
  onPause,
  onReset,
  onNext,
  onStop,
}) => {
  const isRunning = timer.status === 'RUNNING';
  const isIdle = timer.status === 'IDLE';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        mt: 3,
      }}
    >
      {/* Play/Pause Button */}
      <Button
        onClick={isRunning ? onPause : onStart}
        variant="contained"
        color={isRunning ? 'warning' : 'primary'}
        size="large"
        aria-label={isRunning ? 'Pause' : 'Start'}
        sx={{
          width: 120,
          height: 56,
        }}
      >
        {isRunning ? 'Pausa' : 'Starta'}
      </Button>

      {/* Reset Button */}
      {!isIdle && (
        <Tooltip title="Reset">
          <IconButton
            onClick={onReset}
            color="secondary"
            size="large"
            aria-label="Reset"
            sx={{
              width: 56,
              height: 56,
            }}
          >
            <RestartAltIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>
      )}

      {/* Next Segment Button */}
      {onNext && !isIdle && (
        <Tooltip title="Next Segment">
          <IconButton
            onClick={onNext}
            color="info"
            size="large"
            aria-label="Next Segment"
            sx={{
              width: 56,
              height: 56,
            }}
          >
            <SkipNextIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>
      )}

      {/* Stop Button */}
      {onStop && !isIdle && (
        <Tooltip title="Stop">
          <IconButton
            onClick={onStop}
            color="error"
            size="large"
            aria-label="Stop"
            sx={{
              width: 56,
              height: 56,
            }}
          >
            <StopIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default TimerControls;
