import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from '../../../editor/components/filter-dialog/filter-dialog.component';
import { AppComponent } from '../../../app.component';
import { ProfilService } from '../../../shared/services/profil.service';
import { Profil } from '../../../shared/models/profil';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { StorageService } from '../../../shared/services/storage.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [AppComponent,
            FormsModule,
            NgIf,
            MatToolbarModule,
            MatIconModule,
            MatFormFieldModule,
            MatButtonModule,
            MatInputModule,
            MatSlideToggleModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent {
  private profilService = inject(ProfilService);
  private storageService = inject(StorageService);
  readonly dialog = inject(MatDialog);

  //@Output() isDevModeEmit: EventEmitter<boolean> = new EventEmitter();
  
  profil: Profil = {};
  
  
  ngOnInit(): void {
    console.log("ProfilComponent ngOnInit()")
    this.profilService.isToolTips$.subscribe(value => {
      this.profil.isToolTips = value;
    });
    // Check for isDevMode from service first then from storage
    this.profilService.isDevMode$.subscribe(value => {
      this.profil.isDevMode = value;
    });
    if(!this.profil.isDevMode) {
      this.profil.isDevMode = this.storageService.getIsDevMode();
    } 
  }

  ngOnDestroy() {
    
  }

  onToolTipsToggleChange(event: any): void {
    this.profilService.setIsToolTips(event.checked);
  }

  onDevModeToggleChange(event: any): void {
    this.profilService.setIsDevMode(event.checked);
    //console.log("getIsDevMode: ", this.profilService.getIsDevMode());
    //this.isDevMode = event.checked;
    //this.isDevModeEmit.emit(event.checked);
  }

  onToggleChange(event: any): void {
    //this.isDevMode = event.checked;
    //this.isDevModeEmit.emit(event.checked);
  }

  onEditorClick(event: MouseEvent) {
    event.preventDefault(); // Prevent the default context menu from appearing
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
