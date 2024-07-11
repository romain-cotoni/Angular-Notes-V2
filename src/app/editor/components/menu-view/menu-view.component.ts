import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
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
  isDevMode: boolean = false;

  constructor(private profilService: ProfilService) {}

  ngOnInit(): void {
    this.profilService.isDevMode$.subscribe(value => {
      this.isDevMode = value;
    });
  }
  
}
