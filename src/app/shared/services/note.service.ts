import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Note } from '../models/note';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { StorageService } from './storage.service';
import { EventService } from './event.service';

const BASE_URL = environment.apiUrl + '/notes';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class NoteService {

  private httpClient     = inject(HttpClient);
  private storageService = inject(StorageService);
  private eventService   = inject(EventService);

  private subscriptions : Subscription[] = [];
  private noteSelected  : Note           = {};
  private notesList     : Note[]         = [];
  private editorContent : string         = '';
  private editorTitle   : string         = '';
  

// Create observables to communicate values between components

  private editorTitleSubject = new BehaviorSubject<string>('');
  editorTitle$ = this.editorTitleSubject.asObservable();

  private editorContentSubject = new BehaviorSubject<string>('');
  editorContent$ = this.editorContentSubject.asObservable();

  private noteSelectedSubject = new BehaviorSubject<Note>({});
  noteSelected$ = this.noteSelectedSubject.asObservable();

  private notesListSubject = new BehaviorSubject<Note[]>([]);
  notesList$ = this.notesListSubject.asObservable();


  /**
   * Subscribe to observables
   */
  ngOnInit() {
    this.eventService.noteSelected$.subscribe(note => {
      this.noteSelected = note;
      console.log("NoteService - EventService - noteSelected$: ", note);
    });
    /*this.subscriptions.push(
      this.noteSelected$.subscribe(note => { this.noteSelected = note; console.log("subscription - noteSelected: ", this.noteSelected); }),
      this.editorContent$.subscribe(content => this.editorContent = content),
      this.editorTitle$.subscribe(title => this.editorTitle = title)
    );*/
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


// Methods to update observables

  updateSelectedNoteObservable(note: Note): void {
    this.noteSelectedSubject.next(note);
    this.noteSelected = note;
    console.log("updateSelectedNoteObservable: ", this.noteSelected);
  }

  updateEditorTitleObservable(title: string) {
    this.editorTitleSubject.next(title);
    console.log("updateEditorTitleObservable: ", title);
  }

  updateEditorContentObservable(content: string) {
    this.editorContentSubject.next(content);
    console.log("updateEditorContentObservable: ", content);
  }

  updateNotesListObservable(notes: Note[]) {
    this.notesListSubject.next(notes)
    this.storageService.setNotes(notes);
    console.log("updateNotesListObservable: ", notes);
  }

  
// METHODS  TO CALL ENDPOINTS API REST
  
  /**
   * Get list of all user's notes
   */
  getNotes(): Observable<Note[]> {
    return this.httpClient.get<Note[]>(`${BASE_URL}`).pipe(
      map(notes => {
        this.notesList = notes;
        console.log("NoteService - getNotes - this.notesList: ", this.notesList);
        return notes;
      })
    );
  }

  /*
  * Get one note selected by it's id
  */  
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


  /* shareNote(noteShared: NoteShared): Observable<NoteShared> {
     const url = BASE_URL + 'share_note';
     return this.httpClient.post<NoteShared>(url, noteShared, httpOptions);
   }
  
   unshareNote(noteShared: NoteShared): Observable<NoteShared> {
     const url = BASE_URL + 'unshare_note';
     return this.httpClient.post<NoteShared>(url, noteShared, httpOptions);
   }*/

 
 
  filterNotes(keyword: string): Observable<Note[]> {
    return this.getNotes().pipe(
      map(notes => notes.filter(note => 
        (note.title?.toLowerCase().includes(keyword.toLowerCase()) || '')
        // || (note.content?.toLowerCase().includes(keyword.toLowerCase()) || '')  
      ))
    );
  }

  /**
   * Auto-select between 'update' or 'create' a Note when clicked on 'save' btn.
   * If the Note already exist we update it.
   * Else the note doesn't exist then we create it.
   */
  saveNote(noteSelected: Note) {
    console.log("saveNote() - noteSelected: ", noteSelected);
    if(this.noteSelected?.id) {
      this.noteSelected.title   = this.editorTitle;
      this.noteSelected.content = this.editorContent;
      this.updateNote(this.noteSelected);
    } 
    else {
      let noteToCreate: Note = {
        title  : this.editorTitle,
        content: this.editorContent
      }
      this.createNote(noteToCreate);
    }
  }

  updateNote(noteToUpdate: Note) {
    this.update(noteToUpdate).subscribe({
      next: (noteUpdated) => {
        // Update selected note to display
        this.updateSelectedNoteObservable(noteUpdated);
        // Find note by id in a note list and return it's index
        let noteIndex: number = this.notesList.findIndex(note => note.id === noteUpdated.id);
        // Replace note by updated version
        this.notesList[noteIndex] = noteUpdated;
        // Update list of notes to display
        this.updateNotesListObservable(this.notesList);
      },
      error: (error) => { console.log("Error -> from NoteService - update(): ", error); }
    });  
  }


  createNote(noteToCreate: Note) {
    this.create(noteToCreate).subscribe({
      next: (noteCreated) => {
        // Update selected note to display
        this.updateSelectedNoteObservable(noteCreated);
        // Add note to list of notes to display
        this.notesList.push(noteCreated)
        this.updateNotesListObservable(this.notesList);
      },
      error: (error) => { console.log("Error -> from NoteService - create(): ", error); },
    })
  }


  deleteNote() {
    if(this.noteSelected?.id) {
      this.delete(this.noteSelected.id).subscribe({ 
        next: (result) => { console.log("Result from NoteService - delete()", result) },
        error: (error) => { console.log("Error from NoteService - delete()", error) }
      });
    }
  }


}