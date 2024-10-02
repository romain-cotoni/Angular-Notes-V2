import { Component, inject } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./core/components/header/header.component";
import { FooterComponent } from "./core/components/footer/footer.component";
import { ProfilComponent } from './profil/components/profil/profil.component';
import { EventService } from './shared/services/event.service';
import { Subscription } from 'rxjs';
import { Account } from './shared/models/account';
import { AccountService } from './shared/services/account.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [NgIf, 
              NgClass, 
              RouterOutlet, 
              HeaderComponent, 
              FooterComponent, 
              ProfilComponent]
})
export class AppComponent {
  readonly router         = inject(Router);
  readonly eventService   = inject(EventService);
  readonly accountService = inject(AccountService);
  
  title = 'notes-write-V2';

  account! : Account;

  isDevMode!  : boolean;
  isToolTips! : boolean;
  isEditable! : boolean;

  readonly subscriptions : Subscription[] = [];
  
  ngOnInit() {
    console.log("app.component");

    this.subscriptions.push(
      this.eventService.eventIsDevMode$.subscribe(isDevMode => {
        this.isDevMode = isDevMode;
      }),

      this.eventService.eventIsToolTips$.subscribe(isToolTips => {
        this.isToolTips = isToolTips;
      }),

      this.eventService.eventIsEditable$.subscribe(isEditable => {
        this.isEditable = isEditable;
      })
    )

    this.account = this.accountService.getCurrentAccount();
      this.isDevMode  = this.account?.isDevMode ;
      this.isToolTips = this.account?.isToolTips;
      this.isEditable = this.account?.isEditable;
    

  }


  showComponent(component:string): boolean {
    if( component === "header" || component === "footer" ) {
      return this.router.url !== "/register" &&
             this.router.url !== "/login" &&
             this.router.url !== "/logout" &&
             this.router.url !== "/lost-pwd";
    }
    return false;
  }


  isEditor() {
    return this.router.url === "/editor";
  }
  
}
