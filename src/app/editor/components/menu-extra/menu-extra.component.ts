import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { ProfilService } from '../../../shared/services/profil.service';

@Component({
  selector: 'app-menu-extra',
  standalone: true,
  imports: [NgClass],
  templateUrl: './menu-extra.component.html',
  styleUrl: './menu-extra.component.scss'
})
export class MenuExtraComponent {
  isDevMode: boolean = false;
  
  constructor(private profilService: ProfilService) {}

  ngOnInit(): void {
    this.profilService.isDevMode$.subscribe(value => {
      this.isDevMode = value;
    });
  }
}
