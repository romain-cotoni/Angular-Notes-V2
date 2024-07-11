import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { ProfilService } from '../../../shared/services/profil.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgClass],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  
  isToolTips: boolean = false;
  isDevMode: boolean = false;

  constructor(private profilService: ProfilService) {}

  ngOnInit(): void {
    this.profilService.isToolTips$.subscribe(value => {
      this.isToolTips = value;
    });
    this.profilService.isDevMode$.subscribe(value => {
      this.isDevMode = value;
    });
  }

}
