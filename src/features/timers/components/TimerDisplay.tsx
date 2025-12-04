import React from 'react';
import { Box, Typography, LinearProgress, Chip } from '@mui/material';
import { TimerCombination, TimerType } from '../../../core/models/TimerCombination';
import { AppCard } from '../../../shared/components';
import { formatTime } from '../../../shared/utils';

interface TimerDisplayProps {
    timer: TimerCombination;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timer }) => {
    const currentSegment = timer.segments[timer.currentSegmentIndex];
    const progress = currentSegment
        ? ((currentSegment.duration - timer.remainingTime) / currentSegment.duration) * 100
        : 0;

    const getSegmentColor = (type: TimerType): string => {
        switch (type) {
            case TimerType.FOCUS:
                return '#ef4444';
            case TimerType.SHORT_BREAK:
                return '#10b981';
            case TimerType.LONG_BREAK:
                return '#3b82f6';
            default:
                return '#6b7280';
        }
    };

    return (
        <AppCard elevation={3}>
            <Box sx={{ textAlign: 'center' }}>
                {/* Timer Name */}
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                    {timer.name}
                </Typography>

                {/* Current Segment Info */}
                {currentSegment && (
                    <Box sx={{ mb: 3 }}>
                        <Chip
                            label={currentSegment.label}
                            sx={{
                                backgroundColor: getSegmentColor(currentSegment.type),
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                mb: 2,
                            }}
                        />
                        <Typography variant="caption" display="block" color="text.secondary">
                            Repeat {timer.currentRepeat} of {timer.repeatCount} • Segment{' '}
                            {timer.currentSegmentIndex + 1} of {timer.segments.length}
                        </Typography>
                    </Box>
                )}

                {/* Time Display */}
                <Typography
                    variant="h1"
                    sx={{
                        fontFamily: 'monospace',
                        fontSize: { xs: '4rem', md: '6rem' },
                        fontWeight: 700,
                        color: currentSegment ? getSegmentColor(currentSegment.type) : 'text.primary',
                        mb: 3,
                    }}
                >
                    {formatTime(timer.remainingTime)}
                </Typography>

                {/* Progress Bar */}
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 6,
                            backgroundColor: currentSegment
                                ? getSegmentColor(currentSegment.type)
                                : undefined,
                        },
                    }}
                />

                {/* Status Badge */}
                <Box sx={{ mt: 2 }}>
                    <Chip
                        label={timer.status}
                        size="small"
                        color={timer.status === 'RUNNING' ? 'success' : 'default'}
                    />
                </Box>
            </Box>
        </AppCard>
    );
};

export default TimerDisplay;
