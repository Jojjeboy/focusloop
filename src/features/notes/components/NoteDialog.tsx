import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { Note, CreateNoteDto, UpdateNoteDto } from '../../../core/models/Note';

interface NoteDialogProps {
  open: boolean;
  note?: Note;
  onClose: () => void;
  onSave: (data: CreateNoteDto | UpdateNoteDto) => void;
}

export const NoteDialog: React.FC<NoteDialogProps> = ({ open, note, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Using useLayoutEffect to avoid "set state in effect" warning and ensure state is synced before paint
  React.useLayoutEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note, open]);

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      onSave({ title: title.trim(), content: content.trim() });
      onClose();
    }
  };

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{note ? 'Redigera anteckning' : 'Ny anteckning'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Titel"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Innehåll"
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Avbryt</Button>
        <Button onClick={handleSave} variant="contained" disabled={!isValid}>
          Spara
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoteDialog;
