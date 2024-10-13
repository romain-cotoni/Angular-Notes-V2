import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { QuillEditorComponent, QuillModule } from 'ngx-quill';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { TagDialogComponent } from '../../../shared/dialogs/tag-dialog/tag-dialog.component';
import { EventService } from '../../../shared/services/event.service';
import { PdfService } from '../../../shared/services/pdf.service';
import { AccountService } from '../../../shared/services/account.service';
import { NoteService } from '../../../shared/services/note.service';
import { Account } from '../../../shared/models/account';
import { Note } from '../../../shared/models/note';


@Component({
    selector: 'app-editor',
    standalone: true,
    templateUrl: './editor.component.html',
    styleUrl: './editor.component.scss',
    imports: [NgClass, 
              AsyncPipe,
              FormsModule, 
              QuillModule, 
              LayoutModule]
})


export class EditorComponent {
  readonly router             = inject(Router);
  readonly noteService        = inject(NoteService);
  readonly accountService     = inject(AccountService);
  readonly eventService       = inject(EventService);
  readonly pdfService         = inject(PdfService);
  readonly breakpointObserver = inject(BreakpointObserver);
  readonly dialog             = inject(MatDialog);
  readonly changeDetector     = inject(ChangeDetectorRef);  
   
  @ViewChild('quillEditor', { static: true }) quillEditor!: QuillEditorComponent;

  readonly subscriptions: Subscription[] = [];
  
  account!      : Account;
  isDevMode!    : boolean;
  isEditable    : boolean = true; // Is editor disabled by default
  noteSelected  : Note | null = null;
  editorContent : string      = '';


  toolbarDesktopOptions = [
    [ 'bold', 'italic', 'underline'                   ], // toggled buttons
    [ 'link', 'image'                                 ], // links/images
    [ 'blockquote', 'code-block'                      ], 
    [ { 'header': 1 }, { 'header': 2 }                ], // custom button values
    [ { 'header': [1, 2, 3, 4, 5, 6, false] }         ],
    [ { 'list'  : 'ordered' }, { 'list': 'bullet' }   ],
    [ { 'script': 'sub' }, { 'script': 'super' }      ], // superscript/subscript
    [ { 'indent': '-1' }, { 'indent': '+1' }          ], // outdent/indent
    [ { 'size'  : ['small', false, 'large', 'huge'] } ], // custom dropdown
    [ { 'color' : [] }, { 'background': [] }          ], // dropdown with defaults from theme
    [ { 'font'  : [] }                                ],
  ];

  toolbarMobileOptions = [
    [ 'bold', 'italic', 'underline'                   ], // toggled buttons
    [ 'link', 'image'                                 ], // links/images
    [ 'blockquote', 'code-block'                      ], 
  ];

  toolbarOptions = this.toolbarDesktopOptions; // default toolbar
  
  
  ngOnInit(): void {
    console.log("editor.component");
    
    this.subscriptions.push(
      
      this.eventService.noteSelected$.subscribe(note => {
        if(note?.id) { this.getSelectedNote(note.id); }
      }),

      this.eventService.eventSaveNote$.subscribe( (title) => {
        this.saveNote(title);
      }),

      this.eventService.eventDeleteNote$.subscribe( () => {
        this.openDeleteDialog();
      }),
      
      this.eventService.eventShareNote$.subscribe( () => {
        this.shareNote();
      }),

      this.eventService.eventOpenTagDialog$.subscribe( () => {
        this.openTagDialog();
      }),

      this.eventService.eventClearEditor$.subscribe( () => {
        this.clear();
      }),

      this.eventService.eventDownloadPdf$.subscribe( () => {
        this.downloadPDF();
      }),

      this.eventService.eventFocusEditor$.subscribe( () => {
        this.focusEditor();
      }),

      this.eventService.eventIsDevMode$.subscribe(isDevMode => {
        this.isDevMode = isDevMode;
      }),

      this.eventService.eventIsEditable$.subscribe(isEditable => {
        this.isEditable = isEditable;
        this.changeDetector.detectChanges();
      }),
    );


    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet]).subscribe(result => {
      this.toolbarOptions = result.matches ? this.toolbarMobileOptions : this.toolbarDesktopOptions;
      this.isEditable = !result.matches;
    });


    let noteSelected = this.noteService.getSelectedNote();
    if(noteSelected) {
      this.getSelectedNote(noteSelected.id as number);
    }

      
    this.account    = this.accountService.getCurrentAccount();
    this.isDevMode  = this.account.isDevMode;

  }


  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


  private getSelectedNote(noteId: number) {
    this.noteService.getNote(noteId).subscribe({
      next: (note) => {
        console.log("selectednote : ", note);
        this.noteSelected = note;
        this.noteService.setSelectedNote(note);
        this.loadNoteIntoEditor(note);
      },
      error: (error) => { 
        if(this.isDevMode) { 
          console.log("Error: Editor -> NoteService -> getNote(): " + error);
        } 
      }
    })
  }


  private loadNoteIntoEditor(note: Note) {
    if(note) { 
      if(note?.id) { 
        this.noteSelected = note;
        if(note?.content) { this.editorContent = note.content; }
      } else {
        this.editorContent = "";
      }
    }
  }


  private saveNote(title: string) {
    if(this.noteSelected) {
      this.noteSelected.title   = title;
      this.noteSelected.content = this.editorContent;
      this.noteService.updateNote(this.noteSelected);
    } else {
      let noteToCreate: Note = {
        title  : title,
        content: this.editorContent,
      }
      this.noteService.createNote(noteToCreate);
    }
  }


  private deleteNote() {
    if(this.noteSelected) {
      this.noteService.deleteNote(this.noteSelected.id as number);
      this.eventService.emitClearEditorEvent();
    }
  }


  openDeleteDialog() {
    if(this.noteSelected) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: { title: "Confirmation to delete",
                txt1 : "You're about to delete the Note !",
                txt2 : "Do you wish to proceed ?"
        },
      });
      dialogRef.afterClosed().subscribe((choice: boolean) => {
        if(choice) {
          this.deleteNote();
        }
      });
    }
  }


  openTagDialog() {
    if(this.noteSelected) {
      const dialogRef = this.dialog.open(TagDialogComponent, {
        autoFocus : false, // Prevents automatic focus on input field
        maxWidth  : '80vw',
        maxHeight : '80vh',
        data      : { 
          title: this.noteSelected.title,
        },
      });
      dialogRef.afterClosed().subscribe((choice: boolean) => {
        if(choice) {
          
        }
      });
    }
  }
  

  shareNote() {
    if(this.noteSelected) {
      this.router.navigate(['/share-note']);
    }
  }


  clear() {
    this.noteSelected  = null;
    this.editorContent = '';
    this.eventService.emitUpdateNoteSelected(null);
    this.noteService.setSelectedNote(null);
  }


  downloadPDF() {
    this.pdfService.convertHtmlToPdf(this.editorContent);
  }


  focusEditor() {
    const quill = this.quillEditor.quillEditor; // Access Quill editor instance
    if (quill) {
      quill.focus(); // Use Quill's focus() method
    }
  }
  

}