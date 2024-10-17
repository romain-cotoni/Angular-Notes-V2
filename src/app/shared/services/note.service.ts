import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Note } from '../models/note';
import { EventService } from './event.service';
import { Observable } from 'rxjs';
import { AccountNote } from '../models/account-note';
import { StorageService } from './storage.service';
import { TagService } from './tag.service';

const BASE_URL = environment.apiUrl + '/notes';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class NoteService {

  readonly httpClient     = inject(HttpClient);
  readonly eventService   = inject(EventService);
  readonly storageService = inject(StorageService);
  readonly tagService     = inject(TagService);

  selectedNote!: Note | null; 


  getSelectedNote() {
    return this.selectedNote || this.storageService.getSelectedNote();
  }


  setSelectedNote(note: Note | null) {
    this.selectedNote = note;
    this.storageService.setSelectedNote(note); 
  }


  updateNote(noteToUpdate: Note) {
    this.update(noteToUpdate).subscribe({
      next: (noteUpdated) => {
        this.eventService.emitUpdateNoteSelected(noteUpdated); // Update selected note to display
        this.eventService.emitUpdateNotesList();               // Get updated list of notes
        this.eventService.emitMessageEvent("Note updated", false);
      },
      error: (error) => { console.log("Error: NoteService - update(): ", error); }
    });  
  }


  createNote(noteToCreate: Note) {
    this.create(noteToCreate).subscribe({
      next: (noteCreated) => {       
        this.eventService.emitUpdateNoteSelected(noteCreated); // Update selected note to display
        this.eventService.emitUpdateNotesList();               // Get updated list of notes
        this.eventService.emitMessageEvent("Note created", false);
      },
      error: (error) => { console.log("Error: NoteService - create(): ", error); },
    })
  }


  deleteNote(noteToDeleteId: number) {
    this.delete(noteToDeleteId).subscribe({ 
      next: () => { 
          this.eventService.emitUpdateNoteSelected(null); // Update selected note to empty
          this.eventService.emitUpdateNotesList();        // Get updated list of notes
          this.eventService.emitMessageEvent("Note deleted", false);
      },
      error: (error) => { console.log("Error: NoteService - delete()", error) }
    });
  }



  // METHODS  TO CALL ENDPOINTS API REST
 
  getNotes(): Observable<Note[]> {
    return this.httpClient.get<Note[]>(`${BASE_URL}`);
  }


  getNotesByTagId(tagId: number): Observable<Note[]> {
    return this.httpClient.get<Note[]>(`${BASE_URL}/tag/${tagId}`);
  }

  
  getNote(noteId: number): Observable<Note> {
    return this.httpClient.get<Note>(`${BASE_URL}/${noteId}`);
  }


  create(note: Note): Observable<Note> {
    return this.httpClient.post<Note>(BASE_URL, note, httpOptions);
  }


  update(noteDTO: Note): Observable<Note> {
    return this.httpClient.patch<Note>(BASE_URL + '/' + noteDTO.id, noteDTO, httpOptions);
  }


  delete(noteId: number) {
    return this.httpClient.delete(`${BASE_URL}/${noteId}`, httpOptions);
  }


  share(accountNotes: AccountNote[]): Observable<boolean> {
    const url = BASE_URL + '/share';
    return this.httpClient.post<boolean>(url, accountNotes, httpOptions);
  }
  

  unshare(accountNotes: AccountNote[]): Observable<boolean> {
    const url = BASE_URL + '/unshare';
    return this.httpClient.post<boolean>(url, accountNotes, httpOptions);
  }

}