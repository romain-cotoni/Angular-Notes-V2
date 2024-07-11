import { Component } from '@angular/core';
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
  
  isToolTips: boolean = false;
  isDevMode: boolean = false;
  isNotifications: boolean = false;

  constructor(private profilService: ProfilService,
              private notificationsService: NotificationsService) {}
              
  ngOnInit(): void {
    this.profilService.isDevMode$.subscribe(value => {
      this.isDevMode = value;
    });
    this.notificationsService.isNotification$.subscribe(value => {
      this.isNotifications = value;
    })
  }

  onAvatar() {

  }

}
