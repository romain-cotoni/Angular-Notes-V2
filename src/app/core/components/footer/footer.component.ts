import { Component, inject, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { ProfilService } from '../../../shared/services/profil.service';
import { StorageService } from '../../../shared/services/storage.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgClass],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private profilService = inject(ProfilService);
  private storageService = inject(StorageService);
  isToolTips: boolean = false;
  isDevMode: boolean = false;

  ngOnInit(): void {
    this.profilService.isToolTips$.subscribe(value => {
      this.isToolTips = value;
    });
    this.profilService.isDevMode$.subscribe(value => {
      this.isDevMode = value;
    });
    this.isDevMode = this.storageService.getIsDevMode();
  }

}
