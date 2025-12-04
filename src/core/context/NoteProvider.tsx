import React, { useEffect, useState, useCallback, ReactNode } from 'react';
import { Note, CreateNoteDto, UpdateNoteDto } from '../models/Note';
import { NoteService } from '../services/NoteService';
import { NoteContext, NoteContextValue } from './NoteContext';
import { useAuth } from './AuthContext';
import { FirestoreService } from '../../services/FirestoreService';

interface NoteProviderProps {
    children: ReactNode;
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [notes, setNotes] = useState<Note[]>(() => NoteService.getAll());
    const [syncEnabled] = useState(true);

    // Load notes from Firestore when user authenticates
    const refreshNotes = useCallback(async () => {
        if (!user || !syncEnabled) {
            return;
        }

        try {
            const firestoreNotes = await FirestoreService.getUserNotes(user.uid);

            // Smart merge: prefer local notes over stale Firestore data
            firestoreNotes.forEach(firestoreNote => {
                const localNote = NoteService.getById(firestoreNote.id);

                if (localNote) {
                    // Compare timestamps to determine which version is more recent
                    const localUpdatedAt = new Date(localNote.updatedAt).getTime();
                    const firestoreUpdatedAt = new Date(firestoreNote.updatedAt).getTime();
                    const isLocalNewer = localUpdatedAt > firestoreUpdatedAt;

                    if (isLocalNewer) {
                        // Local note is newer - push to Firestore
                        FirestoreService.updateNote(firestoreNote.id, {
                            title: localNote.title,
                            content: localNote.content,
                            completed: localNote.completed,
                        }).catch(err => console.error('Error syncing local note to Firestore:', err));
                    } else {
                        // Firestore is newer - update local from Firestore
                        NoteService.update(firestoreNote.id, firestoreNote);
                    }
                } else {
                    // Note doesn't exist locally - create it from Firestore
                    NoteService.notes.set(firestoreNote.id, firestoreNote);
                    NoteService['notifyListeners']();
                }
            });

            setNotes(NoteService.getAll());
        } catch (error) {
            console.error('Error loading notes from Firestore:', error);
            setNotes(NoteService.getAll());
        }
    }, [user, syncEnabled]);

    // Initial/Auth-klar synkronisering
    React.useLayoutEffect(() => {
        if (!authLoading && user && syncEnabled) {
            void refreshNotes();
        }
    }, [authLoading, user, syncEnabled, refreshNotes]);

    // Subscribe to service changes
    useEffect(() => {
        const unsubscribe = NoteService.subscribe(() => {
            setNotes(NoteService.getAll());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const createNote = useCallback(async (
        data: CreateNoteDto
    ): Promise<Note> => {
        // Create locally first
        const note = NoteService.create(data);

        // Sync to Firestore if user is authenticated
        if (user && syncEnabled) {
            try {
                await FirestoreService.createNote(user.uid, data);
            } catch (error) {
                console.error('Error creating note in Firestore:', error);
            }
        }

        return note;
    }, [user, syncEnabled]);

    const updateNote = useCallback(async (id: string, data: UpdateNoteDto) => {
        // Update locally first
        NoteService.update(id, data);

        // Sync to Firestore if user is authenticated
        if (user && syncEnabled) {
            try {
                await FirestoreService.updateNote(id, data);
            } catch (error) {
                console.error('Error updating note in Firestore:', error);
            }
        }
    }, [user, syncEnabled]);

    const toggleCompleted = useCallback(async (id: string) => {
        const note = NoteService.getById(id);
        if (!note) return;

        const newCompleted = !note.completed;
        NoteService.toggleCompleted(id);

        // Sync to Firestore
        if (user && syncEnabled) {
            try {
                await FirestoreService.updateNote(id, { completed: newCompleted });
            } catch (error) {
                console.error('Error syncing toggle completed:', error);
            }
        }
    }, [user, syncEnabled]);

    const deleteNote = useCallback(async (id: string) => {
        // Delete locally first
        NoteService.delete(id);

        // Sync to Firestore if user is authenticated
        if (user && syncEnabled) {
            try {
                await FirestoreService.deleteNote(id);
            } catch (error) {
                console.error('Error deleting note from Firestore:', error);
            }
        }
    }, [user, syncEnabled]);

    const value: NoteContextValue = React.useMemo(() => ({
        notes,
        createNote,
        updateNote,
        toggleCompleted,
        deleteNote,
        refreshNotes,
    }), [
        notes,
        createNote,
        updateNote,
        toggleCompleted,
        deleteNote,
        refreshNotes,
    ]);

    return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};
