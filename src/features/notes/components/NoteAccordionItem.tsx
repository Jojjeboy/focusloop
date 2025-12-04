import React, { useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    IconButton,
    Box,
    Checkbox,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Note } from '../../../core/models/Note';

interface NoteAccordionProps {
    note: Note;
    onEdit: (note: Note) => void;
    onToggleCompleted: (id: string) => void;
    onDelete: (id: string) => void;
}

export const NoteAccordionItem: React.FC<NoteAccordionProps> = ({
    note,
    onEdit,
    onToggleCompleted,
    onDelete,
}) => {
    const [expanded, setExpanded] = useState(false);

    const handleToggleCompleted = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        onToggleCompleted(note.id);
    };

    return (
        <Accordion
            expanded={expanded}
            onChange={() => setExpanded(!expanded)}
            sx={{
                opacity: note.completed ? 0.6 : 1,
                '&:before': {
                    display: 'none',
                },
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`note-${note.id}-content`}
                id={`note-${note.id}-header`}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                    <Checkbox
                        checked={note.completed}
                        onChange={handleToggleCompleted}
                        onClick={(e) => e.stopPropagation()}
                        sx={{ p: 0 }}
                    />
                    <Typography
                        sx={{
                            flexGrow: 1,
                            textDecoration: note.completed ? 'line-through' : 'none',
                        }}
                    >
                        {note.title}
                    </Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Box>
                    <Typography
                        variant="body1"
                        sx={{ whiteSpace: 'pre-wrap', mb: 2 }}
                    >
                        {note.content}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <IconButton
                            size="small"
                            onClick={() => onEdit(note)}
                            aria-label="Redigera"
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => onDelete(note.id)}
                            color="error"
                            aria-label="Ta bort"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default NoteAccordionItem;
