import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNotes } from '../../../core/context/NoteContext';
import { Note, UpdateNoteDto } from '../../../core/models/Note';
import NoteDialog from '../components/NoteDialog';
import NoteAccordionItem from '../components/NoteAccordionItem';

export const NotesPage: React.FC = () => {
  const { notes, createNote, updateNote, toggleCompleted, deleteNote } = useNotes();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);

  const handleOpenDialog = (note?: Note) => {
    setEditingNote(note);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingNote(undefined);
  };

  const handleSave = async (data: UpdateNoteDto) => {
    if (editingNote) {
      await updateNote(editingNote.id, data);
    } else {
      // Ensure we have the required fields for creating a note
      if (data.title && data.content) {
        await createNote({ title: data.title, content: data.content });
      }
    }
    handleCloseDialog();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Är du säker på att du vill ta bort denna anteckning?')) {
      await deleteNote(id);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(to right, #2563EB, #9333EA)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Anteckningar
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Lägg till
        </Button>
      </Box>

      {notes.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Inga anteckningar än
          </Typography>
          <Typography variant="body2">
            Klicka på "Lägg till" för att skapa din första anteckning
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}
        >
          {notes.map((note) => (
            <NoteAccordionItem
              key={note.id}
              note={note}
              onEdit={handleOpenDialog}
              onToggleCompleted={toggleCompleted}
              onDelete={handleDelete}
            />
          ))}
        </Box>
      )}

      <NoteDialog
        open={dialogOpen}
        note={editingNote}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />
    </Container>
  );
};

export default NotesPage;
