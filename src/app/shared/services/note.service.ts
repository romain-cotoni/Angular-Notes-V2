import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Note } from '../models/note';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { StorageService } from './storage.service';

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

  private subscriptions: Subscription[] = [];
  private noteSelected : Note           = {};
  private editorContent: string         = '';
  private editorTitle  : string         = '';
  

// Create observables to communicate values between components

  private editorTitleSubject = new BehaviorSubject<string>('');
  editorTitle$ = this.editorTitleSubject.asObservable();

  private editorContentSubject = new BehaviorSubject<string>('');
  editorContent$ = this.editorContentSubject.asObservable();

  private noteSelectedSubject = new BehaviorSubject<Note>({});
  noteSelected$ = this.noteSelectedSubject.asObservable();

  private notesListSubject = new BehaviorSubject<Note[]>([]);
  notesList$ = this.notesListSubject.asObservable();


  ngOnInit() {
    // Subscribe to observables
    this.subscriptions.push(
      this.noteSelected$.subscribe(note => { this.noteSelected = note; }),
      this.editorContent$.subscribe(content => this.editorContent = content),
      this.editorTitle$.subscribe(title => this.editorTitle = title)
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

// Methods to update observables

  updateSelectedNoteObservable(note: Note): void {
    this.noteSelectedSubject.next(note);
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
  save() {
    if(this.noteSelected?.id) {
      this.noteSelected.title   = this.editorTitle;
      this.noteSelected.content = this.editorContent;
      this.update(this.noteSelected);
    } 
    else {
      let noteToCreate: Note = {
        title  : this.editorTitle,
        content: this.editorContent
      }
      this.create(noteToCreate);
    }
  }

  update(noteToUpdate: Note) {
    console.log("updateNote: ", noteToUpdate);
    this.updateNote(noteToUpdate).subscribe({
      next: (noteUpdated) => {
        // update selected note to display
        this.updateSelectedNoteObservable(noteUpdated);

        // update list of notes to display
        let noteIndex: number = this.notesList.findIndex(note => note.id === noteUpdated.id); //Find note by id in a note list and return it's index
        this.notesList[noteIndex] = noteUpdated; //Replace note by updated version
        this.noteService.updateNotesListObservable(this.notesList);
        
      },
      error: (error) => { console.log("Error -> from updateNote(): ", error); }
    });  
  }


  create(noteToCreate: Note) {
    this.noteService.createNote(noteToCreate).subscribe({
      next: (noteCreated) => {
        // update selected note to display
        this.noteService.updateSelectedNoteObservable(noteCreated);

        // add note to list of notes to display
        this.notesList.push(noteCreated)
        this.noteService.updateNotesListObservable(this.notesList);
      },
      error: (error) => { console.log("Error -> from createNote(): ", error); },
    })
  }


// Methods to call endpoints api rest
  
  /**
   * Get list of all user's notes
   */
  getNotes(): Observable<Note[]> {
    return this.httpClient.get<Note[]>(`${BASE_URL}`);
  }

  /**
  * Get one note selected by it's id
  */  
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



/*private notes: Note[] = []; // Cache notes locally
private note: Note = {};    // Cache selected note locally*/

/*getNotes(): Observable<Note[]> {
    return this.httpClient.get<Note[]>(`${BASE_URL}`).pipe(
      map(notes => {
        this.notes = notes;
        return notes;
      })
    );
  }*/

  /*getNote(noteId: string): Observable<Note> {
    return this.httpClient.get<Note>(`${BASE_URL}/${noteId}`).pipe(
      map(note => {
        this.note = note;
        return note;
      })
    );
  }*/
