import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    IconButton,
    Box,
    Typography,
    Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { TimerCombination } from '../../../core/models/TimerCombination';
import { AppCard } from '../../../shared/components';

interface TimerListProps {
    timers: TimerCombination[];
    onSelect: (timer: TimerCombination) => void;
    onDelete: (id: string) => void;
    selectedTimerId?: string;
}

export const TimerList: React.FC<TimerListProps> = ({
    timers,
    onSelect,
    onDelete,
    selectedTimerId,
}) => {
    if (timers.length === 0) {
        return (
            <AppCard>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                        No timers yet. Create your first timer combination!
                    </Typography>
                </Box>
            </AppCard>
        );
    }

    return (
        <AppCard title="Your Timers">
            <List sx={{ pt: 0 }}>
                {timers.map((timer, index) => (
                    <ListItem
                        key={timer.id}
                        disablePadding
                        secondaryAction={
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(timer.id);
                                }}
                                color="error"
                            >
                                <DeleteIcon />
                            </IconButton>
                        }
                        sx={{
                            borderBottom: index < timers.length - 1 ? '1px solid' : 'none',
                            borderColor: 'divider',
                        }}
                    >
                        <ListItemButton
                            onClick={() => onSelect(timer)}
                            selected={timer.id === selectedTimerId}
                            sx={{
                                borderRadius: 1,
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.lighter',
                                    '&:hover': {
                                        backgroundColor: 'primary.light',
                                    },
                                },
                            }}
                        >
                            <IconButton color="primary" sx={{ mr: 1 }}>
                                <PlayArrowIcon />
                            </IconButton>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {timer.name}
                                        </Typography>
                                        <Chip
                                            label={timer.status}
                                            size="small"
                                            color={
                                                timer.status === 'RUNNING'
                                                    ? 'success'
                                                    : timer.status === 'COMPLETED'
                                                        ? 'info'
                                                        : 'default'
                                            }
                                        />
                                    </Box>
                                }
                                secondary={
                                    <Typography variant="body2" color="text.secondary">
                                        {timer.description || `${timer.segments.length} segments • ${timer.repeatCount} repeats`}
                                    </Typography>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </AppCard>
    );
};

export default TimerList;
