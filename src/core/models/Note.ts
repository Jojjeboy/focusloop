/**
 * Note Model
 * Represents a user's note about desired functionality or feature requests
 */

export interface Note {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteDto {
  title: string;
  content: string;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  completed?: boolean;
}
