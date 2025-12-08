import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { TimerCombination } from '../core/models/TimerCombination';
import { Note, CreateNoteDto, UpdateNoteDto } from '../core/models/Note';

const TIMERS_COLLECTION = 'timers';
const NOTES_COLLECTION = 'notes';

/**
 * FirestoreService - Handles all Firestore operations for timers
 */
export class FirestoreService {
  /**
   * Get all timers for a user
   */
  static async getUserTimers(userId: string): Promise<TimerCombination[]> {
    try {
      const timersRef = collection(db, TIMERS_COLLECTION);
      const q = query(timersRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      const timers: TimerCombination[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        timers.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
        } as TimerCombination);
      });

      return timers;
    } catch (error) {
      console.error('Error getting timers:', error);
      return [];
    }
  }

  /**
   * Get a single timer by ID
   */
  static async getTimer(timerId: string): Promise<TimerCombination | null> {
    try {
      const timerRef = doc(db, TIMERS_COLLECTION, timerId);
      const timerDoc = await getDoc(timerRef);

      if (timerDoc.exists()) {
        const data = timerDoc.data();
        return {
          ...data,
          id: timerDoc.id,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
        } as TimerCombination;
      }

      return null;
    } catch (error) {
      console.error('Error getting timer:', error);
      return null;
    }
  }

  /**
   * Create a new timer
   */
  static async createTimer(
    userId: string,
    timer: Omit<TimerCombination, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const timerRef = doc(collection(db, TIMERS_COLLECTION));
      const timerData = {
        ...timer,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(timerRef, timerData);
      return timerRef.id;
    } catch (error) {
      console.error('Error creating timer:', error);
      throw error;
    }
  }

  /**
   * Update an existing timer
   */
  static async updateTimer(timerId: string, updates: Partial<TimerCombination>): Promise<void> {
    try {
      const timerRef = doc(db, TIMERS_COLLECTION, timerId);
      await updateDoc(timerRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating timer:', error);
      throw error;
    }
  }

  /**
   * Delete a timer
   */
  static async deleteTimer(timerId: string): Promise<void> {
    try {
      const timerRef = doc(db, TIMERS_COLLECTION, timerId);
      await deleteDoc(timerRef);
    } catch (error) {
      console.error('Error deleting timer:', error);
      throw error;
    }
  }

  /**
   * Get all notes for a user
   */
  static async getUserNotes(userId: string): Promise<Note[]> {
    try {
      const notesRef = collection(db, NOTES_COLLECTION);
      const q = query(notesRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      const notes: Note[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notes.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
        } as Note);
      });

      return notes;
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  }

  /**
   * Subscribe to real-time note updates for a user
   * Returns an unsubscribe function
   */
  static subscribeToUserNotes(userId: string, callback: (notes: Note[]) => void): () => void {
    try {
      const notesRef = collection(db, NOTES_COLLECTION);
      const q = query(notesRef, where('userId', '==', userId));

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const notes: Note[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            notes.push({
              ...data,
              id: doc.id,
              createdAt: data.createdAt?.toDate?.() || new Date(),
              updatedAt: data.updatedAt?.toDate?.() || new Date(),
            } as Note);
          });

          callback(notes);
        },
        (error) => {
          console.error('Error in notes snapshot listener:', error);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up notes listener:', error);
      return () => {}; // Return a no-op unsubscribe function
    }
  }

  /**
   * Create a new note
   */
  static async createNote(userId: string, note: CreateNoteDto): Promise<string> {
    try {
      const noteRef = doc(collection(db, NOTES_COLLECTION));
      const noteData = {
        ...note,
        userId,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(noteRef, noteData);
      return noteRef.id;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  /**
   * Update an existing note
   */
  static async updateNote(noteId: string, updates: UpdateNoteDto): Promise<void> {
    try {
      const noteRef = doc(db, NOTES_COLLECTION, noteId);
      await updateDoc(noteRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  /**
   * Delete a note
   */
  static async deleteNote(noteId: string): Promise<void> {
    try {
      const noteRef = doc(db, NOTES_COLLECTION, noteId);
      await deleteDoc(noteRef);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }
}
