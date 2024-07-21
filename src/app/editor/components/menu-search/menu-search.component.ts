import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProfilService } from '../../../shared/services/profil.service';

@Component({
  selector: 'app-menu-search',
  standalone: true,
  imports: [NgClass,
            MatTooltipModule,
            MatMenuModule, 
            MatIconModule, 
            MatFormFieldModule, 
            MatButtonModule, 
            MatInputModule, 
            MatCheckboxModule, 
            MatSlideToggleModule],
  templateUrl: './menu-search.component.html',
  styleUrl: './menu-search.component.scss'
})
export class MenuSearchComponent {
  search: string = "Search by title";
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

  setBy(choice: string) {
    switch(choice) {
      case "title": {
          this.search = "Search by title";
          break;
      }
      case "tag": {
        this.search = "Search by tag";
        break;
      }
      case "content": {
        this.search = "Search by content";
        break;
      }
      default: {
        this.search = "Search";
        break;
      }
    }
  }
}
