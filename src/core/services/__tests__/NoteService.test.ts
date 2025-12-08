import { describe, it, expect, beforeEach } from 'vitest';
import { NoteService } from '../NoteService';

/**
 * Unit tests for NoteService
 * Tests CRUD operations, localStorage persistence, and subscription system
 */
describe('NoteService', () => {
  // Clear all notes before each test to ensure isolation
  beforeEach(() => {
    NoteService.clear();
    localStorage.clear();
  });

  describe('CRUD Operations', () => {
    it('should create a new note with correct initial state', () => {
      const note = NoteService.create({
        title: 'Test Note',
        content: 'This is a test note',
      });

      expect(note).toBeDefined();
      expect(note.title).toBe('Test Note');
      expect(note.content).toBe('This is a test note');
      expect(note.completed).toBe(false);
      expect(note.id).toMatch(/^note_/);
      expect(note.createdAt).toBeInstanceOf(Date);
      expect(note.updatedAt).toBeInstanceOf(Date);
    });

    it('should generate unique IDs for each note', () => {
      const note1 = NoteService.create({ title: 'Note 1', content: 'Content 1' });
      const note2 = NoteService.create({ title: 'Note 2', content: 'Content 2' });

      expect(note1.id).not.toBe(note2.id);
    });

    it('should retrieve a note by ID', () => {
      const created = NoteService.create({
        title: 'Findable Note',
        content: 'Find me!',
      });

      const found = NoteService.getById(created.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.title).toBe('Findable Note');
    });

    it('should return undefined for non-existent note ID', () => {
      const note = NoteService.getById('non-existent-id');
      expect(note).toBeUndefined();
    });

    it('should retrieve all notes', () => {
      NoteService.create({ title: 'Note 1', content: 'Content 1' });
      NoteService.create({ title: 'Note 2', content: 'Content 2' });

      const allNotes = NoteService.getAll();
      expect(allNotes).toHaveLength(2);
      expect(allNotes[0].title).toBe('Note 1');
      expect(allNotes[1].title).toBe('Note 2');
    });

    it('should update a note', () => {
      const note = NoteService.create({
        title: 'Original Title',
        content: 'Original Content',
      });

      const updated = NoteService.update(note.id, {
        title: 'Updated Title',
        content: 'Updated Content',
      });

      expect(updated).toBeDefined();
      expect(updated?.title).toBe('Updated Title');
      expect(updated?.content).toBe('Updated Content');
      expect(updated?.id).toBe(note.id); // ID should not change
      expect(updated?.createdAt).toEqual(note.createdAt); // Created date unchanged
      // Note: updatedAt should be >= original time (can be same if update is very fast)
      expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(note.updatedAt.getTime());
    });

    it('should return undefined when updating non-existent note', () => {
      const updated = NoteService.update('non-existent-id', {
        title: 'New Title',
      });
      expect(updated).toBeUndefined();
    });

    it('should toggle completed status', () => {
      const note = NoteService.create({
        title: 'Todo Note',
        content: 'Something to do',
      });

      expect(note.completed).toBe(false);

      const toggled = NoteService.toggleCompleted(note.id);
      expect(toggled?.completed).toBe(true);

      const toggledAgain = NoteService.toggleCompleted(note.id);
      expect(toggledAgain?.completed).toBe(false);
    });

    it('should delete a note', () => {
      const note = NoteService.create({
        title: 'To Delete',
        content: 'Delete me',
      });

      const deleted = NoteService.delete(note.id);
      expect(deleted).toBe(true);

      const found = NoteService.getById(note.id);
      expect(found).toBeUndefined();
    });

    it('should return false when deleting non-existent note', () => {
      const deleted = NoteService.delete('non-existent-id');
      expect(deleted).toBe(false);
    });

    it('should clear all notes', () => {
      NoteService.create({ title: 'Note 1', content: 'Content 1' });
      NoteService.create({ title: 'Note 2', content: 'Content 2' });

      expect(NoteService.count()).toBe(2);

      NoteService.clear();

      expect(NoteService.count()).toBe(0);
      expect(NoteService.getAll()).toHaveLength(0);
    });

    it('should return correct note count', () => {
      expect(NoteService.count()).toBe(0);

      NoteService.create({ title: 'Note 1', content: 'Content 1' });
      expect(NoteService.count()).toBe(1);

      NoteService.create({ title: 'Note 2', content: 'Content 2' });
      expect(NoteService.count()).toBe(2);
    });
  });

  describe('localStorage Persistence', () => {
    it('should save notes to localStorage when created', () => {
      NoteService.create({ title: 'Persisted Note', content: 'Save me' });

      const stored = localStorage.getItem('notes');
      expect(stored).toBeDefined();

      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0][1].title).toBe('Persisted Note');
    });

    it('should load notes from localStorage on initialization', () => {
      // Manually set localStorage
      const testNote = {
        id: 'test-id',
        title: 'Loaded Note',
        content: 'From localStorage',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      localStorage.setItem('notes', JSON.stringify([['test-id', testNote]]));

      // Create a new instance (simulated by calling private method via reflection)
      NoteService['loadNotesFromLocalStorage']();

      const loaded = NoteService.getById('test-id');
      expect(loaded).toBeDefined();
      expect(loaded?.title).toBe('Loaded Note');
    });

    it('should update localStorage when note is updated', () => {
      const note = NoteService.create({ title: 'Update Test', content: 'Original' });

      NoteService.update(note.id, { content: 'Modified' });

      const stored = localStorage.getItem('notes');
      const parsed = JSON.parse(stored!);
      expect(parsed[0][1].content).toBe('Modified');
    });

    it('should remove note from localStorage when deleted', () => {
      const note = NoteService.create({ title: 'Delete Test', content: 'Remove me' });

      NoteService.delete(note.id);

      const stored = localStorage.getItem('notes');
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(0);
    });
  });

  describe('Subscription System', () => {
    it('should notify subscribers when note is created', () => {
      let notificationCount = 0;
      const unsubscribe = NoteService.subscribe(() => {
        notificationCount++;
      });

      NoteService.create({ title: 'Notification Test', content: 'Notify me' });

      expect(notificationCount).toBe(1);
      unsubscribe();
    });

    it('should notify subscribers when note is updated', () => {
      const note = NoteService.create({ title: 'Update Test', content: 'Original' });

      let notificationCount = 0;
      const unsubscribe = NoteService.subscribe(() => {
        notificationCount++;
      });

      NoteService.update(note.id, { content: 'Updated' });

      expect(notificationCount).toBe(1);
      unsubscribe();
    });

    it('should notify subscribers when note is deleted', () => {
      const note = NoteService.create({ title: 'Delete Test', content: 'Will be deleted' });

      let notificationCount = 0;
      const unsubscribe = NoteService.subscribe(() => {
        notificationCount++;
      });

      NoteService.delete(note.id);

      expect(notificationCount).toBe(1);
      unsubscribe();
    });

    it('should notify subscribers when notes are cleared', () => {
      NoteService.create({ title: 'Note 1', content: 'Content 1' });

      let notificationCount = 0;
      const unsubscribe = NoteService.subscribe(() => {
        notificationCount++;
      });

      NoteService.clear();

      expect(notificationCount).toBe(1);
      unsubscribe();
    });

    it('should allow unsubscribing from notifications', () => {
      let notificationCount = 0;
      const unsubscribe = NoteService.subscribe(() => {
        notificationCount++;
      });

      NoteService.create({ title: 'Before Unsubscribe', content: 'Count this' });

      unsubscribe();

      NoteService.create({ title: 'After Unsubscribe', content: "Don't count this" });

      expect(notificationCount).toBe(1); // Only first creation should notify
    });

    it('should support multiple subscribers', () => {
      let count1 = 0;
      let count2 = 0;

      const unsub1 = NoteService.subscribe(() => count1++);
      const unsub2 = NoteService.subscribe(() => count2++);

      NoteService.create({ title: 'Multi-subscriber Test', content: 'Both should see this' });

      expect(count1).toBe(1);
      expect(count2).toBe(1);

      unsub1();
      unsub2();
    });
  });
});
