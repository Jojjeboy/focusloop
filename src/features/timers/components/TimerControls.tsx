import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
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
      {!isRunning ? (
        <Tooltip title="Start">
          <IconButton
            onClick={onStart}
            color="primary"
            size="large"
            sx={{
              width: 64,
              height: 64,
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Pause">
          <IconButton
            onClick={onPause}
            color="warning"
            size="large"
            sx={{
              width: 64,
              height: 64,
              backgroundColor: 'warning.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'warning.dark',
              },
            }}
          >
            <PauseIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Tooltip>
      )}

      {/* Reset Button */}
      {!isIdle && (
        <Tooltip title="Reset">
          <IconButton
            onClick={onReset}
            color="secondary"
            size="large"
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
