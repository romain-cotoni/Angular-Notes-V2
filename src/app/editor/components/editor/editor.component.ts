import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { EditorMenuComponent } from "../editor-menu/editor-menu.component";
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { ProfilService } from '../../../shared/services/profil.service';
import { NoteService } from '../../../shared/services/note.service';
import { Note } from '../../../shared/models/note';
import { StorageService } from '../../../shared/services/storage.service';
import { Subscription } from 'rxjs';
import { EventService } from '../../../shared/services/event.service';

@Component({
    selector: 'app-editor',
    standalone: true,
    templateUrl: './editor.component.html',
    styleUrl: './editor.component.scss',
    imports: [NgClass, FormsModule, QuillModule, EditorMenuComponent]
})


export class EditorComponent {
  private noteService    = inject(NoteService);
  private eventService   = inject(EventService);
  private storageService = inject(StorageService);
  private profilService  = inject(ProfilService);
  readonly dialog        = inject(MatDialog);
  
  private subscriptions: Subscription[] = [];
  
  //isMobile: boolean = false; //TODO: set mobile breakpoint subscription
  
  isDevMode     : boolean = false;
  noteSelected  : Note    = {}   ;
  noteSelectedId: number  = -1   ;
  editorTitle   : string  = ''   ;
  editorContent : string  = ''   ;

  toolbarOptions = [
    [  'bold', 'italic', 'underline'                ], // toggled buttons
    [  'blockquote', 'code-block'                   ], 
    [{ 'header': 1 }, { 'header': 2 }               ], // custom button values
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }        ],
    [{ 'list'  : 'ordered' }, { 'list': 'bullet' }  ],
    [{ 'script': 'sub' }, { 'script': 'super' }     ], // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }         ], // outdent/indent
    [{ 'size'  : ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ 'color' : [] }, { 'background': [] }         ], // dropdown with defaults from theme
    [{ 'font'  : [] }                               ],
    //[{ 'direction': 'rtl' }                       ], // text direction
    //[{ 'align': [] }                              ], 
    //['clean'                                      ]  // remove formatting button
  ];
  

  ngOnInit(): void {
    console.log("editor.component");

    // Get cache storage //TODO: Maybe improve for global with subscription
    this.isDevMode = this.storageService.getIsDevMode();

    // Subscriptions
    this.subscriptions.push(
      this.eventService.noteSelected$.subscribe(note => {
        this.loadNoteIntoEditor(note);
        console.log("Editor -> EventService -> noteSelected$: ", note);
      }),
      this.eventService.eventSaveNote$.subscribe( () => {
        this.saveNote();
        console.log("Editor -> EventService -> eventSaveNote$");
      }),
      //this.noteService.noteSelected$.subscribe(note => this.loadNoteIntoEditor(note)),
      //this.noteService.notesList$.subscribe(notes => this.updateNotesList(notes)),
      //this.noteService.editorContent$.subscribe(content => this.editorContent = content),
      //this.noteService.editorTitle$.subscribe(title => this.editorTitle = title)
    );

  }

  loadNoteIntoEditor(note: Note) {
    if(note) { this.noteSelected = note; }
    if(note?.id) { this.noteSelectedId = note.id; }
    if(note?.title) { this.editorTitle = note.title; }
    if(note?.content) { this.editorContent = note.content; }
  }

  private saveNote() {
    console.log("Editor -> saveNote() -> noteSelectedId: ", this.noteSelectedId);
    if(this.noteSelectedId !== -1) {
      this.noteSelected.title   = this.editorTitle;
      this.noteSelected.content = this.editorContent;
      this.noteService.updateNote(this.noteSelected);
    } 
    else {
      let noteToCreate: Note = {
        title  : this.editorTitle,
        content: this.editorContent
      }
      this.noteService.createNote(noteToCreate);
    }
  }

  onEditorContentChange() {
    this.noteService.updateEditorContentObservable(this.editorContent);
  }

  onEditorTitleChange() {
    this.noteService.updateEditorTitleObservable(this.editorTitle);
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


}

  /*onEditorClick(event: MouseEvent) {
    //event.preventDefault(); // Prevent the default context menu from appearing
    
    //if (event.button == 2) { // Check if the right mouse button was clicked
    this.openDialog(event);
    //}
    console.log("right click")
  }


  openDialog(event: MouseEvent): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      position: { top: `${event.clientY}px`, left: `${event.clientX}px` },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed ', result);
    });
  }*/