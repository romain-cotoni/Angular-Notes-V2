import { Component, inject } from '@angular/core';
import { NgClass, AsyncPipe, NgFor, NgForOf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NoteService } from '../../../shared/services/note.service';
import { ProfilService } from '../../../shared/services/profil.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Note } from '../../../shared/models/note';
import { Right } from '../../../shared/enums/right';
import { filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { StorageService } from '../../../shared/services/storage.service';


@Component({
  selector: 'app-menu-search',
  standalone: true,
  imports: [NgClass,
            AsyncPipe,
            NgFor,
            NgForOf,
            ReactiveFormsModule,
            MatTooltipModule,
            MatMenuModule, 
            MatIconModule, 
            MatFormFieldModule, 
            MatButtonModule, 
            MatInputModule, 
            MatCheckboxModule, 
            MatSlideToggleModule,
            MatAutocompleteModule],
  templateUrl: './menu-search.component.html',
  styleUrl: './menu-search.component.scss'
})
export class MenuSearchComponent {
  private storageService = inject(StorageService);
  private profilService = inject(ProfilService);
  private noteService = inject(NoteService);

  noteControl = new FormControl('');
  notes: Note[] | null = null;
  selectedNote: Note | null = null;
  filteredNotesOptions: Observable<Note[]> = of([]);
  editable: boolean = true;
  deletable: boolean = false;
  sharable: boolean = false;
  
  search: string = "Search by title";
  isToolTips: boolean = false;
  isDevMode: boolean = false;
  notesList: Note[] = [];

  ngOnInit(): void {
    console.log("menu-search.component");

    this.profilService.isToolTips$.subscribe(isToolTips => {
      this.isToolTips = isToolTips;
    });

    this.profilService.isDevMode$.subscribe(isDevMode => {
      this.isDevMode = isDevMode;
    });

    this.noteService.notesList$.subscribe(notes => {
      this.notesList = notes;
    });


    this.isDevMode = this.storageService.getIsDevMode();
    
    //this.getAllNotes(); // from session or db

    this.noteService.getNotes().subscribe({
      next: (notes) => {
        this.noteService.updateNotesListObservable(notes)
      },
      error: (error) => {
        console.log("error menu-search.component getNotes(): ", error);
      },
      complete: () => {
        this.filteredNotesOptions = this.noteControl.valueChanges.pipe(
          startWith(''),
          filter(value => typeof value === 'string'), // Ensure value is a string
          switchMap(value => this.noteService.notesList$.pipe(
            map(notes => this.filterNotes(value as string, notes))
          ))
        );
      }
    })
    
  }

  private filterNotes(value: string, options: Note[]): Note[] {
    const filterValue = (value || '').toLowerCase();
    return options?.filter(option => (option.title as string).toLowerCase().includes(filterValue));
  }


  setBy(choice: string) {
    switch(choice) {
      case "title": {
          this.search = "Search by title";
          break;
      }
      case "tag": {
        this.search = "Search by tag";
        break;
      }
      case "content": {
        this.search = "Search by content";
        break;
      }
      default: {
        this.search = "Search";
        break;
      }
    }
  }

  /*getAllNotes() {
    if(!this.getNotesFromStorage()) {
      this.getNotesFromDb();
    }
  }

  getNotesFromStorage(): boolean {
    let notes: Note[] = this.storageService.getNotes();
    if(notes) {
      this.getFilteredNotesOptions(notes);
      console.log("getNotes() from storage: ", notes)
      return true;
    } 
    else {
      return false;
    }
  }

  getNotesFromDb() {
    this.noteService.getNotes().subscribe({
      next: (notes) => {
        this.getFilteredNotesOptions(notes);
        console.log("getNotes() from db: ", notes)
        this.noteService.updateNotesListObservable(notes)
      },
      error: (error) => {
        console.log("error menu-search.component getNotes(): ", error);
      }
    })
  }

  getFilteredNotesOptions(options: Note[]) {
    this.filteredNotesOptions = this.noteControl.valueChanges.pipe(
      startWith(''),
      filter(value => typeof value === 'string'),
      map(value => options?.filter(option => (option.title as string).toLowerCase().includes(value?.toLowerCase() || '') ))
    );
  }*/

  displayOptionNote(note: Note): string {
    return note ? note.title as string : '';
  }

  onNoteOptionsSelectionChanged(event: MatAutocompleteSelectedEvent) {
    let selectedNote = event.option.value as Note;
    this.selectedNote = selectedNote;
    console.log("selectedNote: ", selectedNote);
    this.noteService.updateSelectedNoteObservable(selectedNote);
  }

}
