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
import { filter, map, Observable, of, startWith } from 'rxjs';
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
  allNotesOfUser: Note[] | null = null;
  selectedNote: Note | null = null;
  filteredNotesOptions: Observable<Note[]> = of([]);
  editable: boolean = true;
  deletable: boolean = false;
  sharable: boolean = false;
  
  search: string = "Search by title";
  isToolTips: boolean = false;
  isDevMode: boolean = false;

  ngOnInit(): void {
    this.profilService.isToolTips$.subscribe(value => {
      this.isToolTips = value;
    });
    this.profilService.isDevMode$.subscribe(value => {
      this.isDevMode = value;
    });
    this.isDevMode = this.storageService.getIsDevMode();
    
    this.getAllNotes();
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

  getAllNotes() {
    if(!this.getNotesFromStorage()) {
      this.getNotesFromDb();
    }
  }

  getNotesFromStorage(): boolean {
    this.allNotesOfUser = this.storageService.getNotes();
    if(this.allNotesOfUser) {
      this.getFilteredNotesOptions(this.allNotesOfUser);
      console.log("getNotes() from storage: ", this.allNotesOfUser)
      return true;
    } 
    else {
      return false;
    }
  }

  getNotesFromDb() {
    this.noteService.getNotes().subscribe({
      next: (response) => {
        this.allNotesOfUser = response;
        this.getFilteredNotesOptions(this.allNotesOfUser);
        this.storageService.setNotes(this.allNotesOfUser);
        console.log("getNotes() from db: ", this.allNotesOfUser)
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
  }

  displayOptionNote(note: Note): string {
    return note ? note.title as string : '';
  }

  onNoteOptionsSelectionChanged(event: MatAutocompleteSelectedEvent) {
    let selectedNote = event.option.value as Note;
    this.selectedNote = selectedNote;
    console.log("selectedNote: ", selectedNote);
    this.noteService.setSelectedNote(selectedNote);
    //this.memorizeSelectedNote(this.selectedNote);
    //this.editable  = this.selectedNote.right === Right.WRITE || this.selectedNote.right === Right.OWNER;
    //this.deletable = this.selectedNote.right === Right.OWNER;
    //this.sharable  = this.selectedNote.right === Right.OWNER;
    //this.displayNote();
    //this.clearSearchInput();
  }

  memorizeSelectedNote(note: Note) {
    //this.noteService.setSelectedNote(note);
    //this.sessionStorageService.setSelectedNote(note);
  }

  displayNote() {
    //Set title in viewer
    //this.renderer.setProperty(this.editableTitle.nativeElement  , "innerText", this.selectedNote?.title);
    //Set content in viewer
    //this.renderer.setProperty(this.editableContent.nativeElement, "innerHTML", this.selectedNote?.content);
  }


}
