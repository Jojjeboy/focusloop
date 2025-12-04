import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Chip,
    Stack,
    Slider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Definiera typen för datat som används i wizarden
export interface TimerWizardData {
    name: string;
    category: string;
    workDuration: number;
    restDuration: number;
    rounds: number;
}

interface CreateTimerWizardProps {
    open: boolean;
    onClose: () => void;
    // Byt ut 'any' mot den specifika typen
    onCreate: (timerData: TimerWizardData) => void;
    initialData?: TimerWizardData | null;
}

export const CreateTimerWizard: React.FC<CreateTimerWizardProps> = ({
    open,
    onClose,
    onCreate,
    initialData,
}) => {
    const [timerName, setTimerName] = useState('');
    const [category, setCategory] = useState('Work');
    const [workDuration, setWorkDuration] = useState(25);
    const [restDuration, setRestDuration] = useState(5);
    const [rounds, setRounds] = useState(4);

    React.useEffect(() => {
        if (open) {
            if (initialData) {
                setTimerName(initialData.name);
                setCategory(initialData.category);
                // initialData kommer i sekunder, konvertera till minuter för UI
                setWorkDuration(Math.floor(initialData.workDuration / 60));
                setRestDuration(Math.floor(initialData.restDuration / 60));
                setRounds(initialData.rounds);
            } else {
                setTimerName('');
                setCategory('Work');
                setWorkDuration(25);
                setRestDuration(5);
                setRounds(4);
            }
        }
    }, [open, initialData]);

    const categories = [
        { name: 'Work', icon: <WorkIcon />, color: '#9333EA' },
        { name: 'Study', icon: <SchoolIcon />, color: '#10B981' },
        { name: 'Dev', icon: <CodeIcon />, color: '#F59E0B' },
        { name: 'Wellness', icon: <FavoriteIcon />, color: '#EC4899' },
    ];

    const handleCreate = () => {
        onCreate({
            name: timerName || `${category} Session`,
            category,
            workDuration: workDuration * 60, // Convert to seconds
            restDuration: restDuration * 60, // Convert to seconds
            rounds,
        });
        handleClose();
    };

    const handleClose = () => {
        setTimerName('');
        setCategory('Work');
        setWorkDuration(25);
        setRestDuration(5);
        setRounds(4);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 1,
                },
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {initialData ? 'Edit Timer' : 'Create New Timer'}
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mt: 1 }}>
                    {/* Name Input */}
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Timer Name
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="e.g., Morning Workout"
                        value={timerName}
                        onChange={(e) => setTimerName(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    {/* Category Selection */}
                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                        Category
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                        {categories.map((cat) => (
                            <Chip
                                key={cat.name}
                                icon={cat.icon}
                                label={cat.name}
                                onClick={() => setCategory(cat.name)}
                                sx={{
                                    py: 2.5,
                                    px: 1,
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    mb: 1,
                                    ...(category === cat.name
                                        ? {
                                                background: `${cat.color}20`,
                                                color: cat.color,
                                                borderColor: cat.color,
                                                border: '2px solid',
                                        }
                                        : {
                                                background: 'transparent',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                        }),
                                }}
                            />
                        ))}
                    </Stack>

                    <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                        {/* Work Duration */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                                Work (minutes)
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Slider
                                    value={workDuration}
                                    onChange={(_, newValue) => setWorkDuration(newValue as number)}
                                    min={1}
                                    max={60}
                                    aria-labelledby="work-duration-slider"
                                    valueLabelDisplay="auto"
                                />
                                <Typography variant="h6" sx={{ fontWeight: 700, minWidth: 40, textAlign: 'center' }}>
                                    {workDuration}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Rest Duration */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                                Rest (minutes)
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Slider
                                    value={restDuration}
                                    onChange={(_, newValue) => setRestDuration(newValue as number)}
                                    min={1}
                                    max={60}
                                    aria-labelledby="rest-duration-slider"
                                    valueLabelDisplay="auto"
                                />
                                <Typography variant="h6" sx={{ fontWeight: 700, minWidth: 40, textAlign: 'center' }}>
                                    {restDuration}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Rounds */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                            Rounds
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton
                                onClick={() => setRounds(Math.max(1, rounds - 1))}
                                sx={{ border: '1px solid', borderColor: 'divider' }}
                            >
                                <RemoveIcon />
                            </IconButton>
                            <Typography variant="h4" sx={{ fontWeight: 700, minWidth: 40, textAlign: 'center' }}>
                                {rounds}
                            </Typography>
                            <IconButton
                                onClick={() => setRounds(rounds + 1)}
                                sx={{ border: '1px solid', borderColor: 'divider' }}
                            >
                                <AddIcon />
                            </IconButton>
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                cycles
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleCreate}
                        sx={{
                            background: 'linear-gradient(135deg, #9333EA 0%, #7E22CE 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #7E22CE 0%, #6B21A8 100%)',
                            },
                        }}
                    >
                        {initialData ? 'Save Changes' : 'Create Timer'}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};