import { Note, CreateNoteDto, UpdateNoteDto } from '../models/Note';

/**
 * NoteService - CRUD operations for notes
 * Using local state with localStorage persistence
 */

class NoteServiceClass {
  public notes: Map<string, Note> = new Map();
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadNotesFromLocalStorage();

    // Save state when the user leaves/reloads the page
    if (typeof globalThis.window !== 'undefined') {
      globalThis.window.addEventListener('beforeunload', () => {
        this.saveNotesToLocalStorage();
      });
    }
  }

  /**
   * Save notes to local storage
   */
  private saveNotesToLocalStorage(): void {
    const notesArray = Array.from(this.notes.entries());
    localStorage.setItem('notes', JSON.stringify(notesArray));
  }

  /**
   * Load notes from local storage
   */
  private loadNotesFromLocalStorage(): void {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      try {
        const notesArray = JSON.parse(storedNotes);
        const hydratedNotes = new Map<string, Note>();

        notesArray.forEach(([id, note]: [string, Note]) => {
          hydratedNotes.set(id, note);
        });

        this.notes = hydratedNotes;
      } catch (error) {
        console.error('Failed to parse notes from local storage', error);
      }
    }
  }

  /**
   * Subscribe to note changes
   */
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all subscribers of changes
   */
  private notifyListeners(): void {
    this.saveNotesToLocalStorage();
    this.listeners.forEach((callback) => callback());
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `note_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Create a new note
   */
  create(data: CreateNoteDto): Note {
    const id = this.generateId();
    const now = new Date();

    const note: Note = {
      id,
      title: data.title,
      content: data.content,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    this.notes.set(id, note);
    this.notifyListeners();
    return note;
  }

  /**
   * Get a note by ID
   */
  getById(id: string): Note | undefined {
    return this.notes.get(id);
  }

  /**
   * Get all notes
   */
  getAll(): Note[] {
    return Array.from(this.notes.values());
  }

  /**
   * Update a note
   */
  update(id: string, data: UpdateNoteDto): Note | undefined {
    const note = this.notes.get(id);
    if (!note) {
      return undefined;
    }

    const updatedNote: Note = {
      ...note,
      ...data,
      id: note.id,
      createdAt: note.createdAt,
      updatedAt: new Date(),
    };

    this.notes.set(id, updatedNote);
    this.notifyListeners();
    return updatedNote;
  }

  /**
   * Toggle completed status
   */
  toggleCompleted(id: string): Note | undefined {
    const note = this.notes.get(id);
    if (!note) {
      return undefined;
    }

    return this.update(id, { completed: !note.completed });
  }

  /**
   * Delete a note
   */
  delete(id: string): boolean {
    const result = this.notes.delete(id);
    if (result) {
      this.notifyListeners();
    }
    return result;
  }

  /**
   * Clear all notes
   */
  clear(): void {
    this.notes.clear();
    this.notifyListeners();
  }

  /**
   * Get note count
   */
  count(): number {
    return this.notes.size;
  }
}

// Export singleton instance
export const NoteService = new NoteServiceClass();
