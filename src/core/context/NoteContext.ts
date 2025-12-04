import { createContext, useContext } from 'react';
import { Note, CreateNoteDto, UpdateNoteDto } from '../models/Note';

export interface NoteContextValue {
    notes: Note[];
    createNote: (data: CreateNoteDto) => Promise<Note>;
    updateNote: (id: string, data: UpdateNoteDto) => Promise<void>;
    toggleCompleted: (id: string) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
    refreshNotes: () => Promise<void>;
}

export const NoteContext = createContext<NoteContextValue | undefined>(undefined);

export const useNotes = (): NoteContextValue => {
    const context = useContext(NoteContext);
    if (!context) {
        throw new Error('useNotes must be used within a NoteProvider');
    }
    return context;
};
