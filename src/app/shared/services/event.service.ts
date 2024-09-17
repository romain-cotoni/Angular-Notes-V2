import { Injectable } from '@angular/core';
import { Note } from '../models/note';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  private noteSelectedSubject     = new Subject<Note | null>();
  private notesListSubject        = new Subject<boolean>();
  private noteTitleSubject        = new Subject<string>();
  private eventSaveNoteSubject    = new Subject<string>();
  private eventDeleteNoteSubject  = new Subject<boolean>();
  private eventClearEditorSubject = new Subject<boolean>();
  private eventShareNoteSubject   = new Subject<boolean>();
  private eventIsLockSubject      = new Subject<boolean>();
  private eventDownloadPdfSubject = new Subject<boolean>();
  private eventIsDevModeSubject   = new BehaviorSubject<boolean>(false);
  private eventIsToolTipsSubject  = new BehaviorSubject<boolean>(false);
  private eventIsEditableSubject  = new BehaviorSubject<boolean>(false);

  noteSelected$     = this.noteSelectedSubject.asObservable();
  notesList$        = this.notesListSubject.asObservable();
  noteTitle$        = this.noteTitleSubject.asObservable();
  eventSaveNote$    = this.eventSaveNoteSubject.asObservable();
  eventDeleteNote$  = this.eventDeleteNoteSubject.asObservable();
  eventClearEditor$ = this.eventClearEditorSubject.asObservable();
  eventShareNote$   = this.eventShareNoteSubject.asObservable();
  eventIsLock$      = this.eventIsLockSubject.asObservable();
  eventDownloadPdf$ = this.eventDownloadPdfSubject.asObservable();
  eventIsDevMode$   = this.eventIsDevModeSubject.asObservable();
  eventIsToolTips$  = this.eventIsToolTipsSubject.asObservable();
  eventIsEditable$  = this.eventIsEditableSubject.asObservable();
  

  emitUpdateNoteSelected(note: Note | null) {
    this.noteSelectedSubject.next(note);
  }

  
  emitUpdateNotesList() {
    this.notesListSubject.next(true);
  }


  emitSaveNoteEvent(title: string) {
    this.eventSaveNoteSubject.next(title);
  }

  
  emitDeleteNoteEvent() {
    this.eventDeleteNoteSubject.next(true);
  }
  
  
  emitClearEditorEvent() {
    this.eventClearEditorSubject.next(true);
  }
  
  
  emitShareNoteEvent() {
    this.eventShareNoteSubject.next(true);
  }
  
  
  emitLockEvent(isLocked: boolean) {
    this.eventIsLockSubject.next(isLocked);
  }
  
  
  emitDownloadPdfEvent() {
    this.eventDownloadPdfSubject.next(true);
  }


  emitIsDevMode(isDevMode: boolean) {
    this.eventIsDevModeSubject.next(isDevMode);
  }

  
  emitIsToolTips(isToolTips: boolean) {
    this.eventIsToolTipsSubject.next(isToolTips);
  }


  emitIsEditable(isEditable: boolean) {
    this.eventIsEditableSubject.next(isEditable);
  }
  
  

}
