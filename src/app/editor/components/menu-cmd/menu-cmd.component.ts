import { Component, inject } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ShareNoteComponent } from '../share-note/share-note.component';
import { ProfilService } from '../../../shared/services/profil.service';
import { StorageService } from '../../../shared/services/storage.service';
import { NoteService } from '../../../shared/services/note.service';
import { Note } from '../../../shared/models/note';
import { EditorService } from '../../../shared/services/editor.service';
import { EventService } from '../../../shared/services/event.service';

@Component({
  selector: 'app-menu-cmd',
  standalone: true,
  imports: [NgIf,
            NgClass,
            MatIconModule,
            MatButtonModule,
            MatTooltip],
  templateUrl: './menu-cmd.component.html',
  styleUrl: './menu-cmd.component.scss'
})
export class MenuCmdComponent {  
  private profilService  = inject(ProfilService);
  private storageService = inject(StorageService);
  private noteService    = inject(NoteService);
  private editorService  = inject(EditorService);
  private eventService   = inject(EventService);
  readonly dialog        = inject(MatDialog);

  isToolTips : boolean = false;
  isDevMode  : boolean = false;
  lock       : boolean = false;
  editable   : boolean = true;
  deletable  : boolean = true;
  sharable   : boolean = true;


  editorTitle   : string  = '';
  editorContent : string  = '';
  noteSelected! : Note;
  notesList     : Note[] = [];


  ngOnInit(): void {
    console.log("menu-cmd.component");

    // Subscribe
    this.profilService.isToolTips$.subscribe(isToolTips => {
      this.isToolTips = isToolTips;
    });

    /*this.profilService.isDevMode$.subscribe(isDevMode => {
       this.isDevMode = isDevMode;
    });*/

    this.eventService.noteSelected$.subscribe(note => {
      this.noteSelected = note;
      console.log("MenuCmd -> EventService -> noteSelected subscription: ", this.noteSelected);
    })

    // Get saved states
    this.isDevMode = this.storageService.getIsDevMode();
    
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ShareNoteComponent, {
      
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed ', result);
    });
  }
  
  saveNote() {
    /*console.log("saveNote() -> noteSelected subscription: ", this.noteSelected)
    if(this.noteSelected) {
      this.noteService.saveNote(this.noteSelected);
    }*/
    this.eventService.emitSaveNoteEvent();
  }
  
  deleteNote() {
    this.noteService.deleteNote();
  }
  
  shareNote() {
    //TODO 
    this.openDialog();
  }
  
  clearEditor() {
    this.noteService.updateSelectedNoteObservable({});
    this.noteService.updateEditorContentObservable('');
    this.noteService.updateEditorTitleObservable('');
  }

  unlockEditor() {
    this.editorService.unlock();
  }

  sort() {
    //TODO
  }


}
