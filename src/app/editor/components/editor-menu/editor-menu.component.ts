import { Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-editor-menu',
  standalone: true,
  imports: [RouterModule,
            FilterDialogComponent,
            MatTooltipModule,
            MatMenuModule, 
            MatIconModule, 
            MatFormFieldModule, 
            MatButtonModule, 
            MatInputModule, 
            MatCheckboxModule, 
            MatSlideToggleModule,
            MatDialogModule],
  templateUrl: './editor-menu.component.html',
  styleUrl: './editor-menu.component.scss'
})
export class EditorMenuComponent {
  
  editable: boolean = true;
  deletable: boolean = true;
  search: string = "Search by title";
  readonly dialog = inject(MatDialog);

  constructor() {}

  delete() {
    //TODO
  }

  clear() {
    //TODO
  }

  sort() {
    //TODO
  }

  save() {
    //TODO
  }

  share() {
    //TODO
  }
  
  edit() {
    //TODO
  }

  openDialog(event: MouseEvent): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      position: { top: `${event.clientY}px`, left: `${event.clientX}px` },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed ', result);
    });
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
}
