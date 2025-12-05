import React, { useState } from 'react';
import { Box, Container, Typography, IconButton, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTimers } from '../../../core/context/TimerContext';
import { TimerCard, CreateTimerWizard } from '../components';
import { TimerType, TimerCombination, TimerStatus } from '../../../core/models/TimerCombination';

// Definiera strukturen för datat som kommer från formuläret/wizard
interface TimerFormData {
  name: string;
  category: string;
  workDuration: number;
  restDuration: number;
  rounds: number;
}

export const TimersPage: React.FC = () => {
  const {
    timers,
    startTimer,
    pauseTimer,
    resetTimer,
    createTimer,
    updateTimer,
    deleteTimer,
    archiveTimer,
  } = useTimers();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTimer, setEditingTimer] = useState<TimerCombination | null>(null);

  // Color scheme for different timer types
  const timerColors = ['#9333EA', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'];

  const handleCreateOrUpdateTimer = async (timerData: TimerFormData) => {
    const commonData = {
      name: timerData.name,
      description: `${timerData.category} timer`,
      segments: [
        {
          id: '1',
          type: TimerType.FOCUS,
          duration: timerData.workDuration,
          label: 'Work',
        },
        {
          id: '2',
          type: TimerType.SHORT_BREAK,
          duration: timerData.restDuration,
          label: 'Rest',
        },
      ],
      repeatCount: timerData.rounds,
    };

    if (editingTimer) {
      // Använd Partial<TimerCombination> istället för any
      // Detta tillåter oss att skicka in enbart de fält vi vill uppdatera
      const updates: Partial<TimerCombination> = { ...commonData };

      // If timer is IDLE and at the start, update remainingTime to new duration
      if (editingTimer.status === 'IDLE' && editingTimer.currentSegmentIndex === 0 && editingTimer.remainingTime === editingTimer.segments[0].duration) {
        updates.remainingTime = commonData.segments[0].duration;
      } else if (editingTimer.status === 'IDLE' && editingTimer.currentSegmentIndex === 0) {
        // Also update if it was just IDLE, even if remainingTime didn't match exactly (e.g. if it was reset)
        updates.remainingTime = commonData.segments[0].duration;
      }

      await updateTimer(editingTimer.id, updates);
      setEditingTimer(null);
    } else {
      await createTimer(commonData);
    }
  };

  const handleEditTimer = (timer: TimerCombination) => {
    setEditingTimer(timer);
    setCreateDialogOpen(true);
  };

  const handleDeleteTimer = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this timer?')) {
      await deleteTimer(id);
    }
  };

  const handleArchiveTimer = async (id: string) => {
    await archiveTimer(id);
  };

  const handleCloseDialog = () => {
    setCreateDialogOpen(false);
    setEditingTimer(null);
  };

  const wizardInitialData = React.useMemo(() => {
    if (!editingTimer) return null;
    return {
      name: editingTimer.name,
      category: editingTimer.description?.split(' ')[0] || 'Work',
      workDuration: editingTimer.segments[0].duration,
      restDuration: editingTimer.segments[1]?.duration || 300,
      rounds: editingTimer.repeatCount
    };
  }, [editingTimer]);

  const activeTimers = timers.filter(t => t.status !== TimerStatus.ARCHIVED);
  const finishedTimers = timers.filter(t => t.status === TimerStatus.ARCHIVED);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md" sx={{ py: 3 }}>

        {/* Active Timers Section */}
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 700,
            background: 'linear-gradient(to right, #2563EB, #9333EA)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Active Timers
        </Typography>

        {activeTimers.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 3,
              borderRadius: 3,
              bgcolor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
              No active timers
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Create a timer to get started
            </Typography>
            <IconButton
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                width: 56,
                height: 56,
                background: 'linear-gradient(135deg, #9333EA 0%, #7E22CE 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7E22CE 0%, #6B21A8 100%)',
                },
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 6 }}>
            {activeTimers.map((timer, index) => (
              <TimerCard
                key={timer.id}
                timer={timer}
                onStart={() => startTimer(timer.id)}
                onPause={() => pauseTimer(timer.id)}
                onReset={() => resetTimer(timer.id)}
                onEdit={() => handleEditTimer(timer)}
                onDelete={() => handleDeleteTimer(timer.id)}
                onArchive={() => handleArchiveTimer(timer.id)}
                color={timerColors[index % timerColors.length]}
              />
            ))}
          </Box>
        )}

        {/* Finished Timers Section */}
        {finishedTimers.length > 0 && (
          <>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: 'text.secondary',
              }}
            >
              Finished
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, opacity: 0.8 }}>
              {finishedTimers.map((timer, index) => (
                <TimerCard
                  key={timer.id}
                  timer={timer}
                  onStart={() => startTimer(timer.id)}
                  onPause={() => pauseTimer(timer.id)}
                  onReset={() => resetTimer(timer.id)}
                  onEdit={() => handleEditTimer(timer)}
                  onDelete={() => handleDeleteTimer(timer.id)}
                  onArchive={() => handleArchiveTimer(timer.id)}
                  color={timerColors[index % timerColors.length]}
                />
              ))}
            </Box>
          </>
        )}

        {/* Floating Action Button for mobile */}
        <Fab
          color="primary"
          aria-label="add timer"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #2563EB 0%, #9333EA 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1D4ED8 0%, #7E22CE 100%)',
            },
          }}
          onClick={() => setCreateDialogOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Container>

      {/* Create Timer Dialog */}
      <CreateTimerWizard
        open={createDialogOpen}
        onClose={handleCloseDialog}
        onCreate={handleCreateOrUpdateTimer}
        initialData={wizardInitialData}
      />
    </Box>
  );
};

export default TimersPage;