import { Injectable } from '@angular/core';
import { environment } from '../../../../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Note } from '../models/note';
import { BehaviorSubject, Observable } from 'rxjs';

const BASE_URL = environment.apiUrl + '/notes';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class NoteService {

  //selectedNote?: Note;

  private selectedNoteSubject = new BehaviorSubject<Note>({});
  
  selectedNote$ = this.selectedNoteSubject.asObservable();
  
  constructor(private httpClient: HttpClient) { }
  
  /*getSelectedNote() {
    return this.selectedNote;
  }*/

  setSelectedNote(note: Note): void {
    this.selectedNoteSubject.next(note);
  }



  getNotes(): Observable<Note[]> {
    return this.httpClient.get<Note[]>(`${BASE_URL}`);
  }


  getNote(noteId: string): Observable<Note> {
    return this.httpClient.get<Note>(`${BASE_URL}/${noteId}`);
  }


  createNote(note: Note): Observable<Note> {
    return this.httpClient.post<Note>(`${BASE_URL}`, note, httpOptions);
  }


  updateNote(note: Note): Observable<Note> {
    return this.httpClient.put<Note>(`${BASE_URL}`, note, httpOptions)
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
