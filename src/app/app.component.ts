import { Component } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./core/components/header/header.component";
import { FooterComponent } from "./core/components/footer/footer.component";
import { ProfilComponent } from './profil/components/profil/profil.component';
import { ProfilService } from './shared/services/profil.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [NgIf, NgClass, RouterOutlet, HeaderComponent, FooterComponent, ProfilComponent]
})
export class AppComponent {
  title = 'notes-write-V2';
  isDevMode: boolean = false;
  isToolTips: boolean = false;

  constructor(private router: Router,
              private profilService: ProfilService) {}

  ngOnInit(): void {
    this.profilService.isToolTips$.subscribe(value => {
      this.isToolTips = value;
    });
    this.profilService.isDevMode$.subscribe(value => {
      this.isDevMode = value;
    });
  }

  showComponent(component:string): boolean {
    if( component === "header" || component === "footer" ) {
      return this.router.url !== "/register" &&
             this.router.url !== "/login" &&
             this.router.url !== "/logout";
    }
    return false;
  }

  isEditor() {
    return this.router.url === "/editor";
  }

  checkIsDevMode(isDevMode: any) {
    this.isDevMode = isDevMode;
  }

  
}
