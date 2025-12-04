import React, { useState } from 'react';
import { Box, Container, Typography, IconButton, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTimers } from '../../../core/context/TimerContext';
import { StatsCards, TimerCard, CreateTimerWizard } from '../components';
import { TimerType, TimerCombination } from '../../../core/models/TimerCombination';

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
  } = useTimers();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTimer, setEditingTimer] = useState<TimerCombination | null>(null);

  // Calculate stats
  const activeCount = timers.filter(t => t.status === 'RUNNING' || t.status === 'PAUSED').length;
  const completedCount = timers.filter(t => t.status === 'COMPLETED').length;
  const totalTimeHours = Math.floor(
    timers.reduce((acc, t) => acc + t.totalElapsedTime, 0) / 3600
  );

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

  const handleCloseDialog = () => {
    setCreateDialogOpen(false);
    setEditingTimer(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFBFC' }}>
      <Container maxWidth="sm" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C12 2 8 6 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 6 12 2 12 2ZM12 22C12 22 16 18 16 14C16 11.79 14.21 10 12 10C9.79 10 8 11.79 8 14C8 18 12 22 12 22Z"
                    fill="white"
                    fillOpacity="0.9"
                  />
                </svg>
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1F2937' }}>
                  FocusLoop
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Focus Timer
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                width: 48,
                height: 48,
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
        </Box>

        {/* Stats Cards */}
        <StatsCards
          activeCount={activeCount}
          completedCount={completedCount}
          totalTime={`${totalTimeHours}h`}
        />

        {/* Section Title */}
        <Typography
          variant="overline"
          sx={{
            display: 'block',
            mb: 2,
            fontWeight: 700,
            fontSize: '0.75rem',
            letterSpacing: 1,
            color: '#6B7280',
          }}
        >
          ACTIVE TIMERS
        </Typography>

        {/* Timer Cards */}
        {timers.length === 0 ? (
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
              No timers yet
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Create your first timer to get started
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
          timers.map((timer, index) => (
            <TimerCard
              key={timer.id}
              timer={timer}
              onStart={() => startTimer(timer.id)}
              onPause={() => pauseTimer(timer.id)}
              onReset={() => resetTimer(timer.id)}
              onEdit={() => handleEditTimer(timer)}
              onDelete={() => handleDeleteTimer(timer.id)}
              color={timerColors[index % timerColors.length]}
            />
          ))
        )}

        {/* Floating Action Button for mobile */}
        <Fab
          color="primary"
          aria-label="add timer"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #9333EA 0%, #7E22CE 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #7E22CE 0%, #6B21A8 100%)',
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
        initialData={editingTimer ? {
          name: editingTimer.name,
          category: editingTimer.description?.split(' ')[0] || 'Work',
          workDuration: editingTimer.segments[0].duration,
          restDuration: editingTimer.segments[1]?.duration || 300,
          rounds: editingTimer.repeatCount
        } : null}
      />
    </Box>
  );
};

export default TimersPage;