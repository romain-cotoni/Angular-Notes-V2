import { Component, inject } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./core/components/header/header.component";
import { FooterComponent } from "./core/components/footer/footer.component";
import { ProfilComponent } from './profil/components/profil/profil.component';
import { ProfilService } from './shared/services/profil.service';
import { StorageService } from './shared/services/storage.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [NgIf, NgClass, RouterOutlet, HeaderComponent, FooterComponent, ProfilComponent]
})
export class AppComponent {
  private router = inject(Router);
  //private profilService = inject(ProfilService);
  //private storageService = inject(StorageService);

  title = 'notes-write-V2';
  isDevMode: boolean = false;
  isToolTips: boolean = false;

  ngOnInit(): void {
    /*this.profilService.isToolTips$.subscribe(value => {
      this.isToolTips = value;
    });*/
    /*this.profilService.isDevMode$.subscribe(value => {
      this.isDevMode = value;
    });*/
    //this.isDevMode = this.storageService.getIsDevMode();
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

  /*checkIsDevMode(isDevMode: any) {
    this.isDevMode = isDevMode;
  }*/

  
}
