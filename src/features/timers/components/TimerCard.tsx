import React, { useState } from 'react';
import { Box, Typography, IconButton, Chip, CircularProgress, Menu, MenuItem, Collapse } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TimerCombination, TimerStatus } from '../../../core/models/TimerCombination';

interface TimerCardProps {
    timer: TimerCombination;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onArchive?: () => void;
    color: string;
}

export const TimerCard: React.FC<TimerCardProps> = ({
    timer,
    onStart,
    onPause,
    onReset,
    onEdit,
    onDelete,
    onArchive,
    color,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [expanded, setExpanded] = useState(false);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
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

    const handleToggleExpand = () => {
        setExpanded(!expanded);
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
                borderRadius: 3, // 12px
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 1,
                mb: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                },
            }}
        >
            {/* Collapsed Header - Always Visible */}
            <Box
                onClick={handleToggleExpand}
                sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
            >
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', mr: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {timer.name}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'stretch' }}>
                        {timer.segments.map((segment, index) => {
                            const isActive = index === timer.currentSegmentIndex;
                            const timeToShow = isActive ? timer.remainingTime : segment.duration;
                            const originalDuration = segment.duration;

                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        textAlign: 'center',
                                        opacity: isActive ? 1 : 0.5,
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        minWidth: 80,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.5 }}>
                                        <Typography
                                            variant={isActive ? "h5" : "h6"}
                                            sx={{
                                                fontWeight: isActive ? 800 : 600,
                                                color: isActive ? color : 'text.secondary',
                                                lineHeight: 1,
                                                fontFeatureSettings: "'tnum'",
                                                fontVariantNumeric: 'tabular-nums',
                                            }}
                                        >
                                            {Math.floor(timeToShow / 60)}:{(timeToShow % 60).toString().padStart(2, '0')}
                                        </Typography>

                                        {isActive && (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'text.disabled',
                                                    fontWeight: 500,
                                                    fontSize: '0.75rem',
                                                }}
                                            >
                                                / {Math.floor(originalDuration / 60)}:{(originalDuration % 60).toString().padStart(2, '0')}
                                            </Typography>
                                        )}
                                    </Box>

                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'block',
                                            color: isActive ? color : 'text.secondary',
                                            fontSize: '0.75rem',
                                            mt: 0.5,
                                            fontWeight: isActive ? 700 : 500,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}
                                    >
                                        {segment.label}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                <IconButton
                    sx={{
                        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                    }}
                >
                    <ExpandMoreIcon />
                </IconButton>
            </Box>

            {/* Expanded Content */}
            <Collapse in={expanded}>
                <Box sx={{ px: 3, pb: 3 }}>
                    {/* Segment Info and Menu */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
                        <IconButton size="small" onClick={handleMenuClick}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            slotProps={{
                                paper: {
                                    elevation: 1,
                                    sx: { borderRadius: 2, minWidth: 120 }
                                }
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
                                    strokeLinecap: 'round',
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
                        {timer.status === TimerStatus.COMPLETED ? (
                            <Box
                                onClick={onArchive}
                                sx={{
                                    flex: 1,
                                    py: 1.5,
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                                    },
                                }}
                            >
                                <Typography sx={{ color: 'white', fontWeight: 600 }}>
                                    Archive
                                </Typography>
                            </Box>
                        ) : (
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
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                                    },
                                }}
                            >
                                {isRunning ? <PauseIcon sx={{ color: 'white', mr: 0.5 }} /> : <PlayArrowIcon sx={{ color: 'white', mr: 0.5 }} />}
                                <Typography sx={{ color: 'white', fontWeight: 600 }}>
                                    {isRunning ? 'Pause' : 'Start'}
                                </Typography>
                            </Box>
                        )}
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
            </Collapse>
        </Box>
    );
};

export default TimerCard;
