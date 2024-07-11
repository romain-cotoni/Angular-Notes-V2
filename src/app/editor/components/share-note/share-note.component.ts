import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';

import { MatDialogTitle, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-share-note',
  standalone: true,
  imports: [MatButtonModule,
            MatIconModule,
            MatFormField,
            MatLabel,
            MatChipsModule,
            MatDialogTitle,
            MatDialogActions,
            MatDialogContent],
  templateUrl: './share-note.component.html',
  styleUrl: './share-note.component.scss'
})
export class ShareNoteComponent {
  constructor(public dialogRef: MatDialogRef<ShareNoteComponent>) {}
  
  onCancel() {
    this.dialogRef.close();
  }

  onOk() {
    this.dialogRef.close();
  }

}
