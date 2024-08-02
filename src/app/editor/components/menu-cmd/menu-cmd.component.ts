import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ShareNoteComponent } from '../share-note/share-note.component';
import { ProfilService } from '../../../shared/services/profil.service';
import { StorageService } from '../../../shared/services/storage.service';
import { NoteService } from '../../../shared/services/note.service';
import { Note } from '../../../shared/models/note';
import { SharedEventService } from '../../../shared/services/shared-event.service';

@Component({
  selector: 'app-menu-cmd',
  standalone: true,
  imports: [NgClass,
            MatIconModule,
            MatButtonModule,
            MatTooltip],
  templateUrl: './menu-cmd.component.html',
  styleUrl: './menu-cmd.component.scss'
})
export class MenuCmdComponent {  
  private profilService = inject(ProfilService);
  private storageService = inject(StorageService);
  private noteService = inject(NoteService);
  private sharedEventService = inject(SharedEventService);
  readonly dialog = inject(MatDialog);

  isToolTips: boolean = false;
  isDevMode: boolean = false;
  editorTitle: string = '';
  editorContent: string = '';


  editable: boolean = true;
  deletable: boolean = true;
  sharable: boolean = true;

  selectedNote!: Note;
  editNote!: Note;
  notesList: Note[] = [];

  ngOnInit(): void {
    console.log("menu-cmd.component");

    // Subscribe to futur events
    this.profilService.isToolTips$.subscribe(isToolTips => {
      this.isToolTips = isToolTips;
    });

    // this.profilService.isDevMode$.subscribe(isDevMode => {
    //   this.isDevMode = isDevMode;
    // });
    
    this.noteService.notesList$.subscribe(notes => {
      this.notesList = notes;
    });

    this.noteService.editorTitle$.subscribe(editorTitle => {
      this.editorTitle = editorTitle;
    });

    this.noteService.editorContent$.subscribe(editorContent => {
      this.editorContent = editorContent;
    });
    
    this.noteService.selectedNote$.subscribe(note => {
      this.selectedNote = note;
    });


    // Get saved past states
    this.isDevMode = this.storageService.getIsDevMode();
    
  }

  
  delete() {
    //TODO
  }

  clear() {
    this.sharedEventService.emitButtonClick();
  }
  
  edit() {
    //TODO
  }

  sort() {
    //TODO
  }


  /**
   * Update or create
   */
  save() {
    //IF THE NOTE ALREADY EXIST
    if(this.selectedNote?.id) {
      this.selectedNote.title   = this.editorTitle;
      this.selectedNote.content = this.editorContent;
      this.updateNote(this.selectedNote);
    } 
    //IF THE NOTE DOESN'T ALREADY EXIST
    else {
      let noteToCreate: Note = {
        title  : this.editorTitle,
        content: this.editorContent
      }
      this.createNote(noteToCreate);
    }
  }

  updateNote(noteToUpdate: Note) {
    console.log("updateNote: ", noteToUpdate);
    this.noteService.updateNote(noteToUpdate).subscribe({
      next: (noteUpdated) => {
        // update selected note to display
        this.selectedNote.title   = noteUpdated.title  ; //Change old title with new title
        this.selectedNote.content = noteUpdated.content; //Change old content with new content
        this.noteService.updateSelectedNoteObservable(this.selectedNote);

        // update list of notes to display
        let noteIndex: number = this.notesList.findIndex(note => note.id === noteUpdated.id); //Find note by id in a note list and return it's index
        this.notesList[noteIndex] = noteUpdated; //Replace note by updated version
        this.noteService.updateNotesListObservable(this.notesList);
        
      },
      error: (error) => { console.log("Error -> from updateNote(): ", error); }
    });  
  }


  createNote(noteToCreate: Note) {
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
  
  
  share() {
    this.openDialog();
  }
  

  openDialog(): void {
    const dialogRef = this.dialog.open(ShareNoteComponent, {
      
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed ', result);
    });
  }


}
