import React from 'react';
import { Box, Typography, IconButton, Chip, CircularProgress, Menu, MenuItem } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TimerCombination, TimerStatus } from '../../../core/models/TimerCombination';

interface TimerCardProps {
    timer: TimerCombination;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    onEdit: () => void;
    onDelete: () => void;
    color: string;
}

export const TimerCard: React.FC<TimerCardProps> = ({
    timer,
    onStart,
    onPause,
    onReset,
    onEdit,
    onDelete,
    color,
}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleMenuClose();
        onEdit();
    };

    const handleDelete = () => {
        handleMenuClose();
        onDelete();
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} min`;
    };

    const isRunning = timer.status === TimerStatus.RUNNING;

    const currentSegment = timer.segments[timer.currentSegmentIndex];
    const segmentDuration = currentSegment ? currentSegment.duration : 1;
    const progress = ((segmentDuration - timer.remainingTime) / segmentDuration) * 100;

    return (
        <Box
            sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: 'background.paper',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                mb: 2,
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {timer.name}
                    </Typography>
                    <Chip
                        label={`${currentSegment?.label || 'Focus'} • ${formatDuration(segmentDuration)}`}
                        size="small"
                        sx={{
                            height: 24,
                            fontSize: '0.75rem',
                            background: `${color}20`,
                            color: color,
                            fontWeight: 500,
                        }}
                    />
                </Box>
                <IconButton size="small" onClick={handleMenuClick}>
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    PaperProps={{
                        elevation: 1,
                        sx: { borderRadius: 2, minWidth: 120 }
                    }}
                >
                    <MenuItem onClick={handleEdit} sx={{ fontSize: '0.875rem' }}>
                        <EditIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                        Edit
                    </MenuItem>
                    <MenuItem onClick={handleDelete} sx={{ fontSize: '0.875rem', color: 'error.main' }}>
                        <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} />
                        Delete
                    </MenuItem>
                </Menu>
            </Box>

            {/* Circular Progress */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, position: 'relative' }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                        variant="determinate"
                        value={100}
                        size={140}
                        thickness={4}
                        sx={{ color: '#f0f0f0' }}
                    />
                    <CircularProgress
                        variant="determinate"
                        value={progress}
                        size={140}
                        thickness={4}
                        sx={{
                            color: color,
                            position: 'absolute',
                            left: 0,
                            transform: 'rotate(-90deg) !important',
                        }}
                    />
                    <Box
                        sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            {Math.floor(timer.remainingTime / 60)}:{(timer.remainingTime % 60).toString().padStart(2, '0')}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                            remaining
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Stats */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {timer.currentRepeat}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                        Sessions
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {formatTime(timer.totalElapsedTime)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                        Total Time
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {Math.round(progress)}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                        Completion
                    </Typography>
                </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Box
                    onClick={isRunning ? onPause : onStart}
                    sx={{
                        flex: 1,
                        py: 1.5,
                        borderRadius: 2,
                        background: isRunning ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, background 0.3s',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                        },
                    }}
                >
                    {isRunning ? <PauseIcon sx={{ color: 'white', mr: 0.5 }} /> : <PlayArrowIcon sx={{ color: 'white', mr: 0.5 }} />}
                    <Typography sx={{ color: 'white', fontWeight: 600 }}>
                        {isRunning ? 'Pause' : 'Start'}
                    </Typography>
                </Box>
                <IconButton
                    onClick={onReset}
                    sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                    }}
                >
                    <RefreshIcon />
                </IconButton>
            </Box>
        </Box>
    );
};
