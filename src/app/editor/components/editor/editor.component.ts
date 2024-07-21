import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { EditorMenuComponent } from "../editor-menu/editor-menu.component";
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { ProfilService } from '../../../shared/services/profil.service';

@Component({
    selector: 'app-editor',
    standalone: true,
    templateUrl: './editor.component.html',
    styleUrl: './editor.component.scss',
    imports: [NgClass, FormsModule, QuillModule, EditorMenuComponent]
})


export class EditorComponent {
  isMobile: boolean = false;
  
  readonly dialog = inject(MatDialog);

  editorContent = '';
  
  toolbarOptions = [
    ['bold', 'italic', 'underline'],                  // toggled buttons
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
     [{ 'script': 'sub' }, { 'script': 'super' }],    // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],         // outdent/indent
    // [{ 'direction': 'rtl' }],                      // text direction
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
     [{ 'font': [] }],
    // [{ 'align': [] }],
    //['clean']                                       // remove formatting button
  ];

  isDevMode: boolean = false;

  constructor(private profilService: ProfilService) {}

  ngOnInit(): void {
    this.profilService.isDevMode$.subscribe(value => {
      this.isDevMode = value;
    });
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
  }


}
