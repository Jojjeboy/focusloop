import React, { useState } from 'react';
import { Container, Box, Grid, Typography, Fab, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTimers } from '../../../core/context/TimerContext';
import { TimerDisplay, TimerControls, TimerList } from '../components';
import { AppButton, AppDialog } from '../../../shared/components';
import { DEFAULT_TIMER_PRESETS, TimerCombination } from '../../../core/models/TimerCombination';
import { TimerService } from '../../../core/services/TimerService';

export const TimersPage: React.FC = () => {
  const {
    timers,
    activeTimer,
    setActiveTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    deleteTimer,
    createTimer,
  } = useTimers();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleSelectTimer = (timer: TimerCombination) => {
    setActiveTimer(timer);
  };

  const handleStart = () => {
    if (activeTimer) {
      startTimer(activeTimer.id);
    }
  };

  const handlePause = () => {
    if (activeTimer) {
      pauseTimer(activeTimer.id);
    }
  };

  const handleReset = () => {
    if (activeTimer) {
      resetTimer(activeTimer.id);
    }
  };

  const handleNext = () => {
    if (activeTimer) {
      TimerService.nextSegment(activeTimer.id);
    }
  };

  const handleStop = () => {
    if (activeTimer) {
      resetTimer(activeTimer.id);
      setActiveTimer(null);
    }
  };

  const handleCreatePomodoro = () => {
    const preset = DEFAULT_TIMER_PRESETS.POMODORO;
    const newTimer = createTimer({
      name: preset.name,
      description: preset.description,
      segments: preset.segments.map((seg) => ({ ...seg, id: '' })),
      repeatCount: preset.repeatCount,
    });
    setActiveTimer(newTimer);
    setCreateDialogOpen(false);
  };

  const handleCreateLongPomodoro = () => {
    const preset = DEFAULT_TIMER_PRESETS.LONG_POMODORO;
    const newTimer = createTimer({
      name: preset.name,
      description: preset.description,
      segments: preset.segments.map((seg) => ({ ...seg, id: '' })),
      repeatCount: preset.repeatCount,
    });
    setActiveTimer(newTimer);
    setCreateDialogOpen(false);
  };

  const handleCreateCustom = () => {
    const preset = DEFAULT_TIMER_PRESETS.CUSTOM_CYCLE;
    const newTimer = createTimer({
      name: preset.name,
      description: preset.description,
      segments: preset.segments.map((seg) => ({ ...seg, id: '' })),
      repeatCount: preset.repeatCount,
    });
    setActiveTimer(newTimer);
    setCreateDialogOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Focus Timers
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your productivity with customizable timer combinations
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Active Timer Display */}
        <Grid item xs={12} md={8}>
          {activeTimer ? (
            <>
              <TimerDisplay timer={activeTimer} />
              <TimerControls
                timer={activeTimer}
                onStart={handleStart}
                onPause={handlePause}
                onReset={handleReset}
                onNext={handleNext}
                onStop={handleStop}
              />
            </>
          ) : (
            <Box
              sx={{
                p: 6,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                backgroundColor: 'background.paper',
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Active Timer
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select a timer from the list or create a new one
              </Typography>
              <AppButton
                variant="contained"
                color="primary"
                onClick={() => setCreateDialogOpen(true)}
                startIcon={<AddIcon />}
              >
                Create Timer
              </AppButton>
            </Box>
          )}
        </Grid>

        {/* Timer List */}
        <Grid item xs={12} md={4}>
          <TimerList
            timers={timers}
            onSelect={handleSelectTimer}
            onDelete={deleteTimer}
            selectedTimerId={activeTimer?.id}
          />
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add timer"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => setCreateDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* Create Timer Dialog */}
      <AppDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        title="Create Timer"
        maxWidth="sm"
      >
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Choose a preset to get started:
          </Typography>

          <AppButton fullWidth variant="outlined" onClick={handleCreatePomodoro}>
            <Box sx={{ textAlign: 'left', width: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Pomodoro
              </Typography>
              <Typography variant="caption" color="text.secondary">
                25 min focus + 5 min break • 4 cycles
              </Typography>
            </Box>
          </AppButton>

          <AppButton fullWidth variant="outlined" onClick={handleCreateLongPomodoro}>
            <Box sx={{ textAlign: 'left', width: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Long Pomodoro
              </Typography>
              <Typography variant="caption" color="text.secondary">
                50 min focus + 10 min break • 3 cycles
              </Typography>
            </Box>
          </AppButton>

          <AppButton fullWidth variant="outlined" onClick={handleCreateCustom}>
            <Box sx={{ textAlign: 'left', width: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Work Cycle
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Mixed intervals with long breaks • 2 cycles
              </Typography>
            </Box>
          </AppButton>
        </Stack>
      </AppDialog>
    </Container>
  );
};

export default TimersPage;
