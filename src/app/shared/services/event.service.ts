import { Injectable } from '@angular/core';
import { Note } from '../models/note';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private eventSubject         = new Subject<any>();
  private eventSaveNoteSubject = new Subject<boolean>();
  private noteSelectedSubject  = new Subject<Note>();
  private notesListSubject     = new Subject<Note[]>();
  private editorContentSubject = new Subject<string>();
  private editorTitleSubject   = new Subject<string>();

  event$         = this.eventSubject.asObservable();
  eventSaveNote$ = this.eventSaveNoteSubject.asObservable();
  noteSelected$  = this.noteSelectedSubject.asObservable();
  notesList$     = this.notesListSubject.asObservable();
  editorContent$ = this.editorContentSubject.asObservable();
  editorTitle$   = this.editorTitleSubject.asObservable();


  /**
   * Emits a generic event with any type of data to subscribers.
   * @param data The data or event payload to emit.
   */
  emitEvent(data: any) {
    this.eventSubject.next(data);
  }

  /**
   * Emits a generic event with any type of data to subscribers.
   * @param data The data or event payload to emit.
   */
  emitSaveNoteEvent() {
    this.eventSaveNoteSubject.next(true);
  }

  /**
   * Emits the selected note to all subscribers.
   * @param note - The Note object that was selected.
   */
  updateNoteSelected(note: Note) {
    this.noteSelectedSubject.next(note);
  }

  /**
   * Emits the updated list of notes to all subscribers.
   * @param notes - An array of Note objects representing the updated list.
   */
  updateNotesList(notes: Note[]) {
    this.notesListSubject.next(notes);
  }

  /**
   * Emits the updated content of the editor to all subscribers.
   * @param content - A string representing the updated content in the editor.
   */
  updateEditorContent(content: string) {
    this.editorContentSubject.next(content);
  }

  /**
   * Emits the updated title of the editor to all subscribers.
   * @param title - A string representing the updated title in the editor.
   */
  updateEditorTitle(title: string) {
    this.editorTitleSubject.next(title);
  }


}
