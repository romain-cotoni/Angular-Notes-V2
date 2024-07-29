import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ProfilService } from '../../../shared/services/profil.service';
import { StorageService } from '../../../shared/services/storage.service';

@Component({
  selector: 'app-menu-extra',
  standalone: true,
  imports: [NgClass],
  templateUrl: './menu-extra.component.html',
  styleUrl: './menu-extra.component.scss'
})
export class MenuExtraComponent {
  private profilService = inject(ProfilService);
  private storageService = inject(StorageService);

  isDevMode: boolean = false;
  
  ngOnInit(): void {
    this.profilService.isDevMode$.subscribe(value => {
      this.isDevMode = value;
    });
    this.isDevMode = this.storageService.getIsDevMode();
  }

}
