import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '../../../shared/services/storage.service';
import { ProfilService } from '../../../shared/services/profil.service';

@Component({
  selector: 'app-menu-view',
  standalone: true,
  imports: [NgClass,
            RouterModule,
            MatIconModule],
  templateUrl: './menu-view.component.html',
  styleUrl: './menu-view.component.scss'
})
export class MenuViewComponent {
  private storageService = inject(StorageService);
  private profilService = inject(ProfilService);
  isDevMode: boolean = false;

  ngOnInit(): void {
    console.log("MenuViewComponent ngOnInit()");
    this.profilService.isDevMode$.subscribe(value => {
      this.isDevMode = value;
    });
    this.isDevMode = this.storageService.getIsDevMode();
  }
  
}
