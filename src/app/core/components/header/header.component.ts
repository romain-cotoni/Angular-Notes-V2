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
import { Tag } from '../../../shared/models/tag';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


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
  readonly router             = inject(Router);
  readonly breakpointObserver = inject(BreakpointObserver);
  readonly eventService       = inject(EventService);
  readonly noteService        = inject(NoteService);
  readonly accountService     = inject(AccountService);

  @ViewChild('noteAutocomplete') noteAutocomplete!: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  @Input() isEditor!   : boolean;
  @Input() isDevMode!  : boolean;
  @Input() isToolTips! : boolean;

  noteControl  = new FormControl('');
  titleControl = new FormControl('');
  tagsControl  = new FormControl('');
  filteredNotesOptions: Observable<Note[]> = of([]);

  isEditable  : boolean = true;
  isWritable  : boolean = true;
  isDeletable : boolean = false;
  isSharable  : boolean = false;
  //isTagable   : boolean = false; 
  isAscending : boolean = true;
  hasNotifs   : boolean = false;
  searchType  : string  = "title";

  noteSelected          : Note | null = null;
  username?             : string      = "username";
  
  private accountId?        : number;
  private accountNoteRight! : Right;
  readonly subscriptions    : Subscription[] = [];

  
  ngOnInit(): void {
    console.log("header.component");

    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet]).subscribe(result => {
      this.isEditable = !result.matches;
      //setTimeout(() => { this.eventService.emitIsEditable(this.isEditable);}, 200);
    });
    
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
        this.clearEditor();
      }),
      /*this.eventService.eventIsEditable$.subscribe(isEditable => {
        this.isEditable = isEditable;
      })*/
    )

    // Get the last update of Note Selected
    this.noteSelected = this.noteService.getSelectedNote();
    if(this.noteSelected?.title) { 
      this.titleControl.setValue(this.noteSelected?.title);
    }
    if(this.noteSelected?.tags && this.noteSelected?.tags?.length > 0) { 
      this.getTagsNamesList(this.noteSelected.tags);
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
            case 'tag': {
              return note.tags?.some(tag => tag.name.toLowerCase().includes(inputValue.toLowerCase()));
            }
            case 'title':
            default:
              return note.title?.toLowerCase().includes(inputValue);
          }
        });

        // Sort notes ascending or descending order
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
        //this.isTagable   = true;
        this.isSharable  = this.accountNoteRight === Right.OWNER || this.accountNoteRight === Right.SHARE;

        // map tags name by Note id
        this.getTagsNamesList(note.tags as Tag[]);
      },
      error: (error) => { 
        if(this.isDevMode) { 
          console.log("Error: Header -> NoteService -> getNote(): " + error);
        } 
      }
    })
  }


  getTagsNamesList(tags: Tag[]) {
    this.tagsControl.setValue(tags.map(tag => tag.name).join(' '));
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

  onClear() {
    this.clearEditor();
    this.eventService.emitClearEditorEvent();
  }

  clearEditor() {
    this.isWritable  = true;
    this.isDeletable = false;
    this.isSharable  = false;
    //this.isTagable   = false;
    this.noteSelected = null;
    this.titleControl.setValue(null);
    this.tagsControl.setValue(null);
    this.clearSearchInput();
    this.uncheckedAllSearchOptions();
  }


  onDownloadPdf() {
    this.eventService.emitDownloadPdfEvent();
  }


  onOpenTagDialog() {
    this.eventService.emitOpenTagDialogEvent();
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


  onToggleEditable() {
    this.isEditable = !this.isEditable;
    console.log("Header isEditable : ", this.isEditable)
    this.eventService.emitIsEditable(this.isEditable);
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
