import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Note } from '../models/note';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

const BASE_URL = environment.apiUrl + '/notes';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class NoteService {
  private httpClient = inject(HttpClient);
  private storageService = inject(StorageService);



  private editorTitleSubject = new BehaviorSubject<string>('');
  editorTitle$ = this.editorTitleSubject.asObservable();

  private editorContentSubject = new BehaviorSubject<string>('');
  editorContent$ = this.editorContentSubject.asObservable();

  private selectedNoteSubject = new BehaviorSubject<Note>({});
  selectedNote$ = this.selectedNoteSubject.asObservable();

  private notesListSubject = new BehaviorSubject<Note[]>([]);
  notesList$ = this.notesListSubject.asObservable();
  

  updateSelectedNoteObservable(note: Note): void {
    this.selectedNoteSubject.next(note);
    console.log("updateSelectedNoteObservable: ", note)
  }

  updateEditorTitleObservable(title: string) {
    this.editorTitleSubject.next(title);
  }

  updateEditorContentObservable(content: string) {
    this.editorContentSubject.next(content);
  }

  updateNotesListObservable(notes: Note[]) {
    this.notesListSubject.next(notes)
    this.storageService.setNotes(notes);
    console.log("updateNotesListObservable: ", notes)
  }


  // Methods to call endpoints api rest

  getNotes(): Observable<Note[]> {
    return this.httpClient.get<Note[]>(`${BASE_URL}`);
  }


  getNote(noteId: string): Observable<Note> {
    return this.httpClient.get<Note>(`${BASE_URL}/${noteId}`);
  }


  createNote(note: Note): Observable<Note> {
    return this.httpClient.post<Note>(BASE_URL, note, httpOptions);
  }


  updateNote(noteDTO: Note): Observable<Note> {
    return this.httpClient.patch<Note>(BASE_URL + '/' + noteDTO.id, noteDTO, httpOptions);
  }


  deleteNote(noteId: string) {
    return this.httpClient.delete(`${BASE_URL}/${noteId}`, httpOptions);
  }


//   shareNote(noteShared: NoteShared): Observable<NoteShared> {
//     const url = BASE_URL + 'share_note';
//     return this.httpClient.post<NoteShared>(url, noteShared, httpOptions);
//   }
  
//   unshareNote(noteShared: NoteShared): Observable<NoteShared> {
//     const url = BASE_URL + 'unshare_note';
//     return this.httpClient.post<NoteShared>(url, noteShared, httpOptions);
//   }

}
