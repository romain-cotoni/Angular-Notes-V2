import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ProfilService } from '../../../shared/services/profil.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { StorageService } from '../../../shared/services/storage.service';

@Component({
  selector: 'app-menu-profil',
  standalone: true,
  imports: [NgIf,
            NgClass,
            RouterModule,
            MatTooltipModule,
            MatMenuModule,
            MatIconModule,
            MatButtonModule,
            MatSlideToggle],
  templateUrl: './menu-profil.component.html',
  styleUrl: './menu-profil.component.scss'
})
export class MenuProfilComponent {
  private notificationsService = inject(NotificationsService);
  private profilService = inject(ProfilService);
  private storageService = inject(StorageService);

  isToolTips: boolean = false;
  isDevMode: boolean = false;
  isNotifications: boolean = false;

              
  ngOnInit(): void {
    this.notificationsService.isNotification$.subscribe(value => {
      this.isNotifications = value;
    })
    this.profilService.isDevMode$.subscribe(value => {
      this.isDevMode = value;
    });
    this.isDevMode = this.storageService.getIsDevMode();
  }

  onAvatar() {

  }

}
