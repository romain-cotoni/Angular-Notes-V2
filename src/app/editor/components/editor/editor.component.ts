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
import { SharedEventService } from '../../../shared/services/shared-event.service';
import { EventService } from '../../../shared/services/event.service';

@Component({
    selector: 'app-editor',
    standalone: true,
    templateUrl: './editor.component.html',
    styleUrl: './editor.component.scss',
    imports: [NgClass, FormsModule, QuillModule, EditorMenuComponent]
})


export class EditorComponent {
  //isMobile: boolean        = false;  
  private noteService        = inject(NoteService);
  //private profilService    = inject(ProfilService);
  private storageService     = inject(StorageService);
  private sharedEventService = inject(SharedEventService);
  private eventService       = inject(EventService);
  readonly dialog            = inject(MatDialog);

  private subscriptions: Subscription[] = [];
  
  isDevMode: boolean = false;
  selectedNote!: Note | null;
  editorTitle: string = '';
  editorContent: string = '';

  //private subscription!: Subscription;

  toolbarOptions = [
    ['bold', 'italic', 'underline'],                  // toggled buttons
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],     // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],         // outdent/indent
    // [{ 'direction': 'rtl' }],                      // text direction
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    // [{ 'align': [] }],
    //['clean']                                       // remove formatting button
  ];
  

  ngOnInit(): void {
    console.log("editor.component");
    this.isDevMode = this.storageService.getIsDevMode();
    
    /*this.noteService.selectedNote$.subscribe(selectedNote => {
      if(selectedNote?.title) {
        this.editorTitle = selectedNote.title;
      }
      if(selectedNote?.content) {
        this.editorContent = selectedNote.content;
      }
    });

    this.subscription = this.sharedEventService.buttonClick$.subscribe(() => {
      this.editorTitle = "";
      this.editorContent = "";
      this.selectedNote = null;
    });*/


    this.subscriptions.push(
      this.eventService.noteSelected$.subscribe(note => this.loadNoteIntoEditor(note)),
      this.eventService.notesList$.subscribe(notes => this.updateNotesList(notes)),
      this.eventService.editorContent$.subscribe(content => this.editorContent = content),
      this.eventService.editorTitle$.subscribe(title => this.editorTitle = title)
    );

  }

  loadNoteIntoEditor(note: Note) {
    if(note?.title) { this.editorTitle = note.title; }
    if(note?.content) { this.editorContent = note.content; }
  }

  updateNotesList(notes: Note[]) {
    // Handle notes list update
  }

  onEditorContentChange() {
    this.eventService.updateEditorContent(this.editorContent);
  }

  onEditorTitleChange(title: string) {
    this.eventService.updateEditorTitle(title);
  }


  /*onContentChange() {
    this.noteService.updateEditorContentObservable(this.editorContent);
  }
  

  onEditorClick(event: MouseEvent) {
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


  ngOnDestroy() {
    /*if (this.subscription) {
      this.subscription.unsubscribe();
    }*/

    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


}
