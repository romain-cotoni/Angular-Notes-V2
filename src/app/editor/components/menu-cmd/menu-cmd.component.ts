import { Component, inject, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ShareNoteComponent } from '../share-note/share-note.component';
import { ProfilService } from '../../../shared/services/profil.service';
import { StorageService } from '../../../shared/services/storage.service';

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
  //@Input() isToolTips: boolean = false;
  //@Input() isDevMode: boolean = false;
  private profilService = inject(ProfilService);
  private storageService = inject(StorageService);
  readonly dialog = inject(MatDialog);

  isToolTips: boolean = false;
  isDevMode: boolean = false;

  editable: boolean = true;
  deletable: boolean = true;
  sharable: boolean = true;


  ngOnInit(): void {
    this.profilService.isToolTips$.subscribe(value => {
      this.isToolTips = value;
    });
    this.profilService.isDevMode$.subscribe(value => {
      this.isDevMode = value;
    });
    this.isDevMode = this.storageService.getIsDevMode();
  }

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
    this.openDialog();
  }
  
  edit() {
    //TODO
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ShareNoteComponent, {
      
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed ', result);
    });
  }

}
