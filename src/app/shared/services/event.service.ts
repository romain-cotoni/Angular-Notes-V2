import { Injectable } from '@angular/core';
import { Note } from '../models/note';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  readonly noteSelectedSubject       = new Subject<Note | null>();
  readonly notesListSubject          = new Subject<boolean>();
  readonly noteTitleSubject          = new Subject<string>();
  readonly eventSaveNoteSubject      = new Subject<string>();
  readonly eventDeleteNoteSubject    = new Subject<boolean>();
  readonly eventClearEditorSubject   = new Subject<boolean>();
  readonly eventShareNoteSubject     = new Subject<boolean>();
  readonly eventOpenTagDialogSubject = new Subject<boolean>();
  readonly eventDownloadPdfSubject   = new Subject<boolean>();
  readonly eventFocusEditorSubject   = new Subject<boolean>();
  readonly eventMessageSubject       = new Subject<[string, boolean]>();
  readonly eventIsDevModeSubject     = new BehaviorSubject<boolean>(false);
  readonly eventIsToolTipsSubject    = new BehaviorSubject<boolean>(false);
  readonly eventIsEditableSubject    = new BehaviorSubject<boolean>(true);

  noteSelected$       = this.noteSelectedSubject.asObservable();
  notesList$          = this.notesListSubject.asObservable();
  noteTitle$          = this.noteTitleSubject.asObservable();
  eventSaveNote$      = this.eventSaveNoteSubject.asObservable();
  eventDeleteNote$    = this.eventDeleteNoteSubject.asObservable();
  eventClearEditor$   = this.eventClearEditorSubject.asObservable();
  eventShareNote$     = this.eventShareNoteSubject.asObservable();
  eventOpenTagDialog$ = this.eventOpenTagDialogSubject.asObservable();
  eventDownloadPdf$   = this.eventDownloadPdfSubject.asObservable();
  eventFocusEditor$   = this.eventFocusEditorSubject.asObservable();
  eventIsDevMode$     = this.eventIsDevModeSubject.asObservable();
  eventIsToolTips$    = this.eventIsToolTipsSubject.asObservable();
  eventIsEditable$    = this.eventIsEditableSubject.asObservable();
  eventMessage$       = this.eventMessageSubject.asObservable();

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


  emitOpenTagDialogEvent() {
    this.eventOpenTagDialogSubject.next(true);
  }
  
  
  emitDownloadPdfEvent() {
    this.eventDownloadPdfSubject.next(true);
  }


  emitFocusEditorEvent() {
    this.eventFocusEditorSubject.next(true);
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
  
  
  emitMessageEvent(msg: string, isError: boolean) {
    this.eventMessageSubject.next([msg, isError]);
  }


}
