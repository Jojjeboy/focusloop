import React, { useState } from 'react';
import { Typography, IconButton, Box, Checkbox } from '@mui/material';
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
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3, // 12px
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 1,
        mb: 2,
        transition: 'all 0.2s ease-in-out',
        opacity: note.completed ? 0.6 : 1,
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: expanded ? 2 : 0 }}>
        <Checkbox
          checked={note.completed}
          onChange={handleToggleCompleted}
          sx={{
            p: 0,
            mr: 1.5,
            color: 'primary.main',
            '&.Mui-checked': {
              color: 'primary.main',
            },
          }}
        />{' '}
        <Typography
          onClick={() => setExpanded(!expanded)}
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            fontSize: '1rem',
            textDecoration: note.completed ? 'line-through' : 'none',
            cursor: 'pointer',
          }}
        >
          {note.title}
        </Typography>
        <IconButton size="small" onClick={() => setExpanded(!expanded)}>
          <ExpandMoreIcon
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          />
        </IconButton>
      </Box>

      {/* Expanded Content */}
      {expanded && (
        <Box>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'pre-wrap',
              mb: 2,
              color: 'text.secondary',
              lineHeight: 1.6,
            }}
          >
            {note.content}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <IconButton
              size="small"
              onClick={() => onEdit(note)}
              aria-label="Redigera"
              sx={{
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(note.id)}
              aria-label="Ta bort"
              sx={{
                color: 'error.main',
                '&:hover': {
                  bgcolor: 'error.main',
                  color: 'white',
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default NoteAccordionItem;
