import { Component, inject, Input, ViewChild } from '@angular/core';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, of, startWith, Subscription } from 'rxjs';


import { EventService } from '../../../shared/services/event.service';
import { NoteService } from '../../../shared/services/note.service';
import { AccountService } from '../../../shared/services/account.service';
import { Note } from '../../../shared/models/note';
import { Right } from '../../../shared/enums/right';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf,
            NgFor,
            NgClass,
            AsyncPipe,
            RouterModule,
            ReactiveFormsModule,
            MatSlideToggleModule,
            MatButtonModule,
            MatIconModule,
            MatMenuModule,
            MatFormFieldModule,
            MatInputModule,
            MatTooltipModule,
            MatAutocompleteModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private router               = inject(Router);
  private eventService         = inject(EventService);
  private noteService          = inject(NoteService);
  private accountService       = inject(AccountService);

  @ViewChild('noteAutocomplete') noteAutocomplete!: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  @Input() isEditor!   : boolean;
  @Input() isDevMode!  : boolean;
  @Input() isToolTips! : boolean;
  @Input() isEditable! : boolean;

  noteControl  = new FormControl('');
  titleControl = new FormControl('');
  filteredNotesOptions: Observable<Note[]> = of([]);

  isWritable  : boolean = true;
  isDeletable : boolean = false;
  isSharable  : boolean = false;
  isAscending : boolean = true;
  hasNotifs   : boolean = false;
  searchType  : string  = "title";

  noteSelected: Note | null = null;
  username?: string = "username";
  
  private accountId?        : number;
  private accountNoteRight! : Right;
  private subscriptions     : Subscription[] = [];

  
  ngOnInit(): void {
    console.log("header.component");
    
    this.getNotesList();

    let currentAccount = this.accountService.getCurrentAccount(); 
    this.accountId = currentAccount?.id;
    this.username  = currentAccount?.username;

    // If a new note is created the list is updated
    this.subscriptions.push(
      this.eventService.notesList$.subscribe( () => { 
        this.getNotesList();
      }),
      this.eventService.eventClearEditor$.subscribe( () => {
        this.onClearEditor();
      })
    )

    // Get the last update of Note Selected
    this.noteSelected = this.noteService.getSelectedNote();
    if(this.noteSelected?.title) { 
      this.titleControl.setValue(this.noteSelected?.title);
    }

    this.isDeletable = this.noteSelected != null; 
    
  }


  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


  getNotesList() {
    this.noteService.getNotes().subscribe({
      next: (notes) => {
        this.filterNotes(notes);
      },
      error: (error) => { 
        if(this.isDevMode) { 
          console.log("Error: Header -> NoteService -> getNotes(): " + error);
        } 
      }
    })
  }


  private filterNotes(notesToFilter: Note[]) {
    this.filteredNotesOptions = this.noteControl.valueChanges.pipe(
      startWith(''), //initialize before the user types anything
      map(value => {
        const inputValue = typeof value === 'string' ? value.toLowerCase() : '';
        
        const filteredNotes = notesToFilter?.filter(note => {
          switch (this.searchType) {
            case 'content': {
              return note.content?.toLowerCase().includes(inputValue);
            }
            case 'title':
            default:
              return note.title?.toLowerCase().includes(inputValue);
          }
        });

        // Sort notes ascending or descending order
        console.log("filteredNotes: ", filteredNotes)
        return filteredNotes.sort(( (previous, next) => {
          const previousTitle = previous.title?.toLowerCase() ?? '';
          const nextTitle     = next.title?.toLowerCase() ?? '';
          return this.isAscending ? previousTitle.localeCompare(nextTitle) : nextTitle.localeCompare(previousTitle);
        }))

      })
    );
  }


  displayOptionNote(note: Note): string {
    return note ? note.title as string : '';
  }


  onNoteOptionsSelectionChanged(event: MatAutocompleteSelectedEvent) {
    let noteSelected  : Note   = event.option.value as Note;
    let noteSelectedId: number = noteSelected.id as number;
    this.noteService.getNote(noteSelectedId).subscribe({
      next: (note) => {
        this.eventService.emitUpdateNoteSelected(note);
        this.titleControl.setValue(note.title as string);
        this.accountNoteRight = this.getAccountNoteRight(note);
        this.isWritable  = this.accountNoteRight === Right.OWNER || this.accountNoteRight === Right.WRITE;
        this.isDeletable = true;
        this.isSharable  = this.accountNoteRight === Right.OWNER;
      },
      error: (error) => { 
        if(this.isDevMode) { 
          console.log("Error: Header -> NoteService -> getNote(): " + error);
        } 
      }
    })
  }


  clearSearchInput() {
    this.noteControl.reset('');
  }


  uncheckedAllSearchOptions() { 
    this.noteAutocomplete.options.forEach((option) => {
        option.deselect();
    });
  }


  onSaveNote() {
    this.eventService.emitSaveNoteEvent(this.titleControl.value as string);
    this.isDeletable = true;
  }


  onShareNote() {
    this.eventService.emitShareNoteEvent();
  }


  onDeleteNote() {
    this.eventService.emitDeleteNoteEvent();
  }


  onClearEditor() {
    this.isWritable  = true;
    this.isDeletable = false;
    this.isSharable  = false;
    this.noteSelected = null;
    this.titleControl.setValue(null);
    this.clearSearchInput();
    this.uncheckedAllSearchOptions();
    this.eventService.emitClearEditorEvent();
  }


  onDownloadPdf() {
    this.eventService.emitDownloadPdfEvent();
  }


  onOrder() {
    this.searchType = "title"
    this.isAscending = !this.isAscending;
    if (this.autocompleteTrigger) {
      this.autocompleteTrigger.closePanel();
      setTimeout(() => { // Add a small delay to allow for a smooth transition between closing and opening
        this.getNotesList();  // Trigger a re-fetch and sorting of notes after the order changes
        this.autocompleteTrigger.openPanel();
      }, 200);
    }
  }


  onSetSearch(search_type: string) {
    console.log("search_type: ",search_type)
    this.searchType = search_type;
  }


  onDashboard() {
    this.router.navigate(['/dashboard']);
  }
  

  onEditor() {
    this.router.navigate(['/editor']);
  }

  onMoveCursorToEditor() {
    this.eventService.emitFocusEditorEvent();
  }


  private getAccountNoteRight(note: Note): Right {
    if(this.accountId) {
      let accountNotes = note?.accountNotes;
      // Get Account Note association current Account & Note selected
      let accountNote = accountNotes?.find( (accountNote) => accountNote.accountNoteId.accountId === this.accountId);
      let right = accountNote?.right; // Get Right for Account Note association
      if(right) { 
        return right; 
      }
    } 
    return Right.READ; // Return minimum Read Right only if get Right fail 
  }



}
